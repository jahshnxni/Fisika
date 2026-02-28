import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { COURSE_BUILDER_PROMPT, QUESTIONS_ONLY_BUILDER_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";

export const maxDuration = 60;

// Models to try in order — each with separate quota pools
const GEMINI_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
];

function cleanJson(raw: string): string {
    return raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function callGeminiWithFallback(systemPrompt: string, userText: string, geminiKey: string): Promise<string> {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    for (const model of GEMINI_MODELS) {
        for (let attempt = 0; attempt <= 1; attempt++) {
            try {
                console.log(`[build] Trying model: ${model} attempt ${attempt + 1}`);
                const r = await ai.models.generateContent({
                    model,
                    contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                    config: { systemInstruction: systemPrompt, temperature: 0.3, responseMimeType: "application/json" },
                });
                const text = r.text || "";
                if (text.length > 20) {
                    console.log(`[build] ✅ Success with model: ${model}`);
                    return text;
                }
            } catch (e: any) {
                const isQuota = e.message?.includes("429") || e.message?.includes("quota") || e.message?.includes("RESOURCE_EXHAUSTED");
                console.warn(`[build] Model ${model} attempt ${attempt + 1} failed (quota=${isQuota}):`, e.message?.slice(0, 100));
                if (isQuota) break; // move to next model
                if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
            }
        }
    }
    throw new Error("Semua model AI sementara mengalami batas kuota. Coba lagi dalam beberapa menit.");
}

async function setStep(spaceId: string, status: string, step: string | null, progress: number, error?: string | null) {
    await prisma.courseSpace.update({
        where: { id: spaceId },
        data: { buildStatus: status, buildStep: step, buildProgress: progress, buildError: error ?? null }
    });
}

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    const { spaceId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const space = await prisma.courseSpace.findUnique({ where: { id: spaceId } });
    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    if (space.buildStatus === "READY") return NextResponse.json({ status: "READY" });
    if (space.buildStatus === "QUEUED" || space.buildStatus === "PROCESSING") {
        return NextResponse.json({ status: space.buildStatus });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        await setStep(spaceId, "ERROR", null, 0, "GEMINI_API_KEY tidak dikonfigurasi");
        return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    try {
        await setStep(spaceId, "PROCESSING", "PARSING", 10);
        const fullText = space.pdfText || "";

        await setStep(spaceId, "PROCESSING", "SEGMENTING", 25);
        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        const questions = segmentQuestions(fullText);
        console.log(`[build] docType=${docType} subject=${subject} questions=${questions.length} textLen=${fullText.length}`);

        await setStep(spaceId, "PROCESSING", "CLASSIFYING", 40);

        const systemPrompt = docType === "questions_only" ? QUESTIONS_ONLY_BUILDER_PROMPT : COURSE_BUILDER_PROMPT;
        let userPrompt: string;

        if (docType === "questions_only") {
            const sample = questions.slice(0, 6).join("\n\n---\n\n");
            userPrompt = `Kumpulan soal dari "${space.title}" (mata pelajaran: ${subject || "tidak diketahui"}, total ~${questions.length} soal).\n\nSoal-soal representatif:\n\n${sample}\n\nBangun kursus lengkap dengan materi prasyarat, latihan bertingkat (EASY→EXTREME), dan pembahasan soal dari PDF.`;
        } else {
            userPrompt = `Dokumen: "${space.title}" (${subject || "tidak diketahui"})\n\n${fullText.substring(0, 5000)}\n\nBangun kursus pembelajaran lengkap dari konten ini.`;
        }

        await setStep(spaceId, "PROCESSING", "GENERATING", 55);

        // ─── Try all models — throw if ALL fail ──────────────────────────────
        let parsedPayload: any = null;
        try {
            const raw = await callGeminiWithFallback(systemPrompt, userPrompt, geminiKey);
            parsedPayload = JSON.parse(cleanJson(raw));
            console.log("[build] AI parsed OK, lessons:", parsedPayload?.lessons?.length);
        } catch (aiErr: any) {
            // Set ERROR — don't save stale fallback as READY
            console.error("[build] All AI models failed:", aiErr.message);
            await setStep(spaceId, "ERROR", null, 0, aiErr.message);
            return NextResponse.json({ error: aiErr.message }, { status: 503 });
        }

        if (!parsedPayload?.lessons?.length) {
            await setStep(spaceId, "ERROR", null, 0, "AI mengembalikan respons kosong. Coba lagi.");
            return NextResponse.json({ error: "Empty AI response" }, { status: 503 });
        }

        // ─── Save to DB as READY ──────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "FINALIZING", 80);

        await prisma.$transaction(async (tx) => {
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    title: parsedPayload.main_topic || space.title,
                    isGenerated: true,
                    theme: parsedPayload.ui_config?.theme || "cosmic",
                    uiConfig: JSON.stringify(parsedPayload.ui_config || {}),
                    conceptGraph: JSON.stringify(parsedPayload.concept_graph || {}),
                    buildStatus: "READY",
                    buildStep: "FINALIZING",
                    buildProgress: 100,
                    buildError: null,
                }
            });
            await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });
            for (let i = 0; i < parsedPayload.lessons.length; i++) {
                const l = parsedPayload.lessons[i];
                await tx.generatedLesson.create({
                    data: {
                        courseId: spaceId,
                        title: l.title || `Topik ${i + 1}`,
                        slug: `${spaceId}-lesson-${i + 1}`,
                        order: i + 1,
                        contentMdx: l.contentMdx || "",
                        scaffoldedMdx: Array.isArray(l.scaffoldedExamples) ? JSON.stringify(l.scaffoldedExamples) : "[]",
                        pdfWalkthrough: l.pdfWalkthrough || "",
                    }
                });
            }
        });

        return NextResponse.json({ status: "READY", docType, lessonCount: parsedPayload.lessons.length });

    } catch (e: any) {
        console.error("[build] Fatal:", e.message);
        await setStep(spaceId, "ERROR", null, 0, e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
