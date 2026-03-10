import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { COURSE_BUILDER_PROMPT, QUESTIONS_ONLY_BUILDER_PROMPT, QUESTION_EXTRACTOR_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";

// Allow up to 60s on Vercel Pro plans
export const maxDuration = 60;

const INTERNAL_KEY = process.env.INTERNAL_BUILD_KEY || "build-internal";

async function setStep(
    spaceId: string,
    status: string,
    step: string | null,
    progress: number,
    error?: string | null
) {
    await prisma.courseSpace.update({
        where: { id: spaceId },
        data: { buildStatus: status, buildStep: step, buildProgress: progress, buildError: error ?? null }
    });
}

function cleanJson(raw: string): string {
    return raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function callGemini(ai: any, systemPrompt: string, userText: string, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                config: { systemInstruction: systemPrompt, temperature: 0.3, responseMimeType: "application/json" },
            });
            const text = response.text || "";
            if (text.length > 20) return text;
        } catch (e: any) {
            console.warn(`[build/run] Gemini attempt ${attempt + 1} failed:`, e.message?.slice(0, 80));
            if (attempt === retries) throw e;
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
    }
    return "";
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    // Security: only allow internal calls
    const key = req.headers.get("x-internal-key");
    if (key !== INTERNAL_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spaceId } = await params;
    const space = await prisma.courseSpace.findUnique({ where: { id: spaceId } });
    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    // Guard: don't double-process
    if (space.buildStatus === "PROCESSING" || space.buildStatus === "READY") {
        return NextResponse.json({ ok: true, status: space.buildStatus });
    }

    try {
        // ─── Step 1: Parse / detect ───────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "PARSING", 10);

        const fullText = space.pdfText || "";
        if (!fullText || fullText.length < 50) {
            throw new Error("PDF text is empty or too short. The PDF may be a scanned image.");
        }

        // ─── Step 2: Segment ─────────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "SEGMENTING", 25);

        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        const questions = segmentQuestions(fullText);

        console.log(`[build/run] spaceId=${spaceId} docType=${docType} subject=${subject} questions=${questions.length}`);

        // ─── Step 3: Classify / build prompt ─────────────────────────────────
        await setStep(spaceId, "PROCESSING", "CLASSIFYING", 40);

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const hasQuestions = docType === "questions_only" || docType === "mixed" || questions.length > 0;
        const systemPrompt = hasQuestions ? QUESTION_EXTRACTOR_PROMPT : COURSE_BUILDER_PROMPT;

        let userPrompt = `Dokumen: "${space.title}"
Mata pelajaran: ${subject || "tidak diketahui"}
Total Estimasi Soal Terdeteksi: ~${questions.length}

Konten Lengkap PDF:

==================================================
${fullText}
==================================================

INSTRUKSI WAJIB UNTUK AI:
${hasQuestions
                ? `1. Ekstrak SEMUA soal secara utuh ke dalam array 'lessons'.
2. Biarkan 'pdfWalkthrough' kosong.
3. Pastikan tidak ada soal yang tertinggal.
4. Jangan menjawab soalnya, cukup ambil teksnya saja.`
                : `1. Bangun kursus pembelajaran lengkap.
2. Buat pembahasan mendalam.`}
`;

        // ─── Step 4: Generate ─────────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "GENERATING", 55);

        let parsedPayload: any = null;

        try {
            const aiRaw = await callGemini(ai, systemPrompt, userPrompt, 2);
            console.log("[build/run] AI response chars:", aiRaw.length);
            parsedPayload = JSON.parse(cleanJson(aiRaw));
        } catch (e: any) {
            console.error("[build/run] AI/parse error:", e.message);
        }

        // ─── Step 5: Finalize / fallback ─────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "FINALIZING", 80);

        if (!parsedPayload?.lessons?.length) {
            // Smart fallback — at least meaningful based on what we DO know
            const fallbackLesson = docType === "questions_only" ? {
                title: `Soal-Soal ${subject || "Ujian"}`,
                contentMdx: `## Ringkasan Dokumen\n\nDokumen ini berisi **${questions.length} soal** dari bidang **${subject || "yang terdeteksi secara otomatis"}**.\n\nAI sedang mengalami kendala memproses konten ini, namun dokumennya berhasil dibaca dan terdeteksi.\n\n**Coba:**\n1. Tekan tombol Retry di bawah\n2. Atau upload ulang dengan PDF yang lebih sederhana`,
                scaffoldedExamples: [],
                pdfWalkthrough: questions[0] ? `## Contoh Soal dari PDF\n\n${questions[0]}` : ""
            } : {
                title: "Materi Utama",
                contentMdx: `## Dokumen\n\nDokumen berhasil dibaca (${fullText.length} karakter). AI gagal memproses karena timeout atau koneksi.\n\nCoba tekan **Retry**.`,
                scaffoldedExamples: [],
                pdfWalkthrough: ""
            };

            parsedPayload = {
                main_topic: space.title,
                ui_config: { theme: docType === "questions_only" ? "science" : "cosmic", layout: docType === "questions_only" ? "practice-focused" : "lesson-focused" },
                concept_graph: { subtopics: [], concepts: [], formulas: [], prerequisites: [] },
                lessons: [fallbackLesson]
            };
        }

        // ─── Save to DB ───────────────────────────────────────────────────────
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
                let scaffoldedMdxStr = "[]";
                if (Array.isArray(l.scaffoldedExamples) && l.scaffoldedExamples.length > 0) {
                    scaffoldedMdxStr = JSON.stringify(l.scaffoldedExamples);
                }
                await tx.generatedLesson.create({
                    data: {
                        courseId: spaceId,
                        title: l.title || `Topik ${i + 1}`,
                        slug: `${spaceId}-lesson-${i + 1}`,
                        order: i + 1,
                        contentMdx: l.contentMdx || "",
                        scaffoldedMdx: scaffoldedMdxStr,
                        pdfWalkthrough: l.pdfWalkthrough || "",
                    }
                });
            }
        });

        return NextResponse.json({ ok: true, docType, lessonCount: parsedPayload.lessons.length });

    } catch (e: any) {
        console.error("[build/run] Fatal:", e.message);
        await setStep(spaceId, "ERROR", null, 0, e.message || "Unknown error");
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
