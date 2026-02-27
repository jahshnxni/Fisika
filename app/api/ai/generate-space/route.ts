import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    DOC_CLASSIFIER_PROMPT,
    COURSE_BUILDER_PROMPT,
    QUESTIONS_ONLY_BUILDER_PROMPT
} from "@/lib/ai/master-prompt";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function chunkText(text: string, maxChars: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += maxChars) {
        chunks.push(text.slice(i, i + maxChars));
    }
    return chunks;
}

function cleanJson(raw: string): string {
    return raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}

async function callGemini(
    ai: any,
    systemPrompt: string,
    userText: string,
    retries = 2
): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.3,
                    responseMimeType: "application/json",
                },
            });
            const text = response.text || "";
            if (text.length > 10) return text;
        } catch (e: any) {
            console.warn(`[generate-space] Gemini attempt ${attempt + 1} failed:`, e.message);
            if (attempt === retries) throw e;
            // Wait 1s before retry
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return "";
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { spaceId, force } = body;
        if (!spaceId) {
            return NextResponse.json({ error: "spaceId is required" }, { status: 400 });
        }

        const space = await prisma.courseSpace.findUnique({ where: { id: spaceId } });
        if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });
        if (space.isGenerated && !force) {
            return NextResponse.json({ success: true, message: "Already generated." });
        }

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const fullText = space.pdfText || "";

        // ─── Phase 1: Classify Document Type (fast, uses only first 3000 chars) ───
        let docType: "theory" | "questions_only" | "mixed" = "theory";
        let mainSubject = "";
        let classifiedTitle = space.title;

        try {
            const classifierSample = fullText.substring(0, 3000);
            const classRaw = await callGemini(
                ai,
                DOC_CLASSIFIER_PROMPT,
                `Klasifikasikan dokumen berikut:\n\n${classifierSample}`,
                1
            );
            const classification = JSON.parse(cleanJson(classRaw));
            docType = classification.doc_type || "theory";
            mainSubject = classification.main_subject || "";
            classifiedTitle = classification.main_topic || space.title;
            console.log(`[generate-space] Doc classified as: ${docType} — subject: ${mainSubject}`);
        } catch (e) {
            console.warn("[generate-space] Classification failed, defaulting to theory mode:", e);
        }

        // ─── Phase 2: Generate Course Content (chunked, uses 6000 chars) ──────────
        const systemPrompt = docType === "questions_only"
            ? QUESTIONS_ONLY_BUILDER_PROMPT
            : COURSE_BUILDER_PROMPT;

        // Use first 6000 chars for main content generation (safe for 60s Vercel limit)
        const contentChunk = fullText.substring(0, 6000);
        const docTypeLabel = docType === "questions_only"
            ? "kumpulan soal ujian"
            : "dokumen teori/campuran";

        const userPrompt = docType === "questions_only"
            ? `Dokumen ini adalah ${docTypeLabel} dari mata pelajaran "${mainSubject || "tidak diketahui"}". Analisis soal-soal berikut dan bangun kursus pembelajaran dari topik-topik yang diujikan:\n\n${contentChunk}`
            : `Dokumen ini adalah ${docTypeLabel} dari mata pelajaran "${mainSubject || "tidak diketahui"}". Ekstrak dan susun kursus dari konten berikut:\n\n${contentChunk}`;

        let parsedPayload: any = null;

        try {
            const aiRaw = await callGemini(ai, systemPrompt, userPrompt, 2);
            console.log("[generate-space] AI response length:", aiRaw.length);
            parsedPayload = JSON.parse(cleanJson(aiRaw));
            console.log("[generate-space] Parsed OK — lessons:", parsedPayload.lessons?.length);
        } catch (e: any) {
            console.error("[generate-space] Content generation failed:", e.message);
        }

        // ─── Intelligent Fallback (show WHY, not just a generic error) ───────────
        if (!parsedPayload || !parsedPayload.lessons || parsedPayload.lessons.length === 0) {
            const fallbackReason = docType === "questions_only"
                ? "PDF ini berisi soal-soal ujian. AI sedang memproses — coba tekan tombol **Bangun Ulang** sekali lagi."
                : "AI tidak dapat menghasilkan konten dari PDF ini. Pastikan PDF tidak berupa hasil scan gambar dan memiliki teks yang dapat dibaca.";

            parsedPayload = {
                main_topic: classifiedTitle,
                doc_type: docType,
                concept_graph: { subtopics: [], concepts: [], formulas: [], prerequisites: [] },
                ui_config: { theme: docType === "questions_only" ? "science" : "cosmic", layout: "lesson-focused" },
                lessons: [{
                    title: "Kursus Sedang Diproses",
                    contentMdx: `## Status Pemrosesan\n\n${fallbackReason}\n\n**Jenis dokumen terdeteksi:** ${docType === "questions_only" ? "Kumpulan Soal Ujian" : "Dokumen Teori"}\n**Mata Pelajaran:** ${mainSubject || "Belum terdeteksi"}`,
                    scaffoldedExamples: [],
                    pdfWalkthrough: ""
                }]
            };
        }

        // ─── Save to Database ─────────────────────────────────────────────────────
        await prisma.$transaction(async (tx) => {
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    title: parsedPayload.main_topic || classifiedTitle,
                    isGenerated: true,
                    theme: parsedPayload.ui_config?.theme || "cosmic",
                    uiConfig: JSON.stringify(parsedPayload.ui_config || {}),
                    conceptGraph: JSON.stringify(parsedPayload.concept_graph || {})
                }
            });

            await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });

            const lessons = parsedPayload.lessons || [];
            for (let i = 0; i < lessons.length; i++) {
                const l = lessons[i];

                let scaffoldedMdxStr = "[]";
                if (Array.isArray(l.scaffoldedExamples) && l.scaffoldedExamples.length > 0) {
                    scaffoldedMdxStr = JSON.stringify(l.scaffoldedExamples);
                } else if (Array.isArray(l.scaffoldedMdx)) {
                    scaffoldedMdxStr = JSON.stringify(l.scaffoldedMdx);
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

        return NextResponse.json({
            success: true,
            docType,
            lessonCount: parsedPayload.lessons.length
        });

    } catch (e: any) {
        console.error("[generate-space] Fatal Error:", e);
        return NextResponse.json({ error: e.message || "Gagal membangun kursus" }, { status: 500 });
    }
}
