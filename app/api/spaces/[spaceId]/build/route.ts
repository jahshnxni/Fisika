import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { COURSE_BUILDER_PROMPT, QUESTIONS_ONLY_BUILDER_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";

// Allow up to 60 seconds on Vercel Pro
export const maxDuration = 60;

function cleanJson(raw: string): string {
    return raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function callGemini(ai: any, systemPrompt: string, userText: string, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const r = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                config: { systemInstruction: systemPrompt, temperature: 0.3, responseMimeType: "application/json" },
            });
            const text = r.text || "";
            if (text.length > 20) return text;
        } catch (e: any) {
            console.warn(`[build] Gemini attempt ${attempt + 1}:`, e.message?.slice(0, 80));
            if (attempt === retries) throw e;
            await new Promise(res => setTimeout(res, 800 * (attempt + 1)));
        }
    }
    return "";
}

async function setStep(spaceId: string, status: string, step: string | null, progress: number, error?: string | null) {
    await prisma.courseSpace.update({
        where: { id: spaceId },
        data: { buildStatus: status, buildStep: step, buildProgress: progress, buildError: error ?? null }
    });
}

/**
 * POST /api/spaces/[spaceId]/build
 * Idempotent build trigger + inline AI pipeline (no fire-and-forget).
 * Client awaits this while polling /status every 2s for progress.
 */
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

    try {
        // ─── PARSING (10%) ───────────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "PARSING", 10);
        const fullText = space.pdfText || "";

        // ─── SEGMENTING (25%) ─────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "SEGMENTING", 25);
        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        const questions = segmentQuestions(fullText);
        console.log(`[build] spaceId=${spaceId} docType=${docType} subject=${subject} q=${questions.length}`);

        // ─── CLASSIFYING (40%) ────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "CLASSIFYING", 40);

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemPrompt = docType === "questions_only" ? QUESTIONS_ONLY_BUILDER_PROMPT : COURSE_BUILDER_PROMPT;

        // ─── GENERATING (55%) ─────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "GENERATING", 55);

        let userPrompt: string;
        if (docType === "questions_only") {
            const sample = questions.slice(0, 6).join("\n\n---\n\n");
            userPrompt = `Kumpulan soal dari "${space.title}" (mata pelajaran: ${subject || "tidak diketahui"}, total ~${questions.length} soal).\n\nBerikut soal-soal pertama:\n\n${sample}\n\nBangun kursus lengkap dengan materi prasyarat, latihan bertingkat, dan pembahasan soal.`;
        } else {
            userPrompt = `Dokumen: "${space.title}" (${subject || "tidak diketahui"})\n\n${fullText.substring(0, 5000)}\n\nBangun kursus pembelajaran yang lengkap.`;
        }

        let parsedPayload: any = null;
        try {
            const raw = await callGemini(ai, systemPrompt, userPrompt, 2);
            parsedPayload = JSON.parse(cleanJson(raw));
        } catch (e: any) {
            console.error("[build] AI error:", e.message);
        }

        // ─── FINALIZING (80%) ─────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "FINALIZING", 80);

        if (!parsedPayload?.lessons?.length) {
            parsedPayload = {
                main_topic: space.title,
                ui_config: { theme: docType === "questions_only" ? "science" : "cosmic", layout: "lesson-focused" },
                concept_graph: { subtopics: [], concepts: [], formulas: [], prerequisites: [] },
                lessons: [{
                    title: docType === "questions_only" ? `Soal ${subject || "Ujian"}` : "Materi Utama",
                    contentMdx: docType === "questions_only"
                        ? `## Dokumen Soal Terdeteksi\n\nDokumen ini berisi ~${questions.length} soal ${subject ? `mata pelajaran **${subject}**` : ""}.\n\nAI mengalami gangguan saat memproses — tekan **Retry** untuk mencoba lagi.`
                        : `## Dokumen Terdeteksi\n\nDokumen berhasil dibaca (${fullText.length} karakter). AI gagal memproses.\n\nTekan **Retry** untuk mencoba lagi.`,
                    scaffoldedExamples: [],
                    pdfWalkthrough: questions[0] ? `## Contoh Soal\n\n${questions[0]}` : ""
                }]
            };
        }

        // ─── SAVE + READY (100%) ──────────────────────────────────────────
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
