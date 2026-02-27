import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { COURSE_BUILDER_PROMPT, QUESTIONS_ONLY_BUILDER_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";

function cleanJson(raw: string): string {
    return raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}

async function callGemini(ai: any, systemPrompt: string, userText: string, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.35,
                    responseMimeType: "application/json",
                },
            });
            const text = response.text || "";
            if (text.length > 20) return text;
        } catch (e: any) {
            console.warn(`[generate-space] Gemini attempt ${attempt + 1} failed:`, e.message?.substring(0, 100));
            if (attempt === retries) throw e;
            await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
        }
    }
    return "";
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { spaceId, force } = await req.json();
        if (!spaceId) return NextResponse.json({ error: "spaceId is required" }, { status: 400 });

        const space = await prisma.courseSpace.findUnique({ where: { id: spaceId } });
        if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });
        if (space.isGenerated && !force) return NextResponse.json({ success: true, message: "Already generated." });

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const fullText = space.pdfText || "";

        // ─── Phase 1: LOCAL detection (instant, zero AI calls) ───────────────────
        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        console.log(`[generate-space] Local detection → docType: ${docType}, subject: ${subject || "unknown"}`);

        // ─── Phase 2: Prepare smart payload for AI ───────────────────────────────
        let userPrompt = "";
        const systemPrompt = docType === "questions_only"
            ? QUESTIONS_ONLY_BUILDER_PROMPT
            : COURSE_BUILDER_PROMPT;

        if (docType === "questions_only") {
            // Segment questions and send a focused subset (first 8 questions max)
            const questions = segmentQuestions(fullText);
            const focused = questions.slice(0, 8).join("\n\n---\n\n");
            const totalQ = questions.length;
            console.log(`[generate-space] Segmented ${totalQ} questions, sending first ${Math.min(8, totalQ)}`);

            userPrompt = `Ini adalah kumpulan soal dari dokumen "${space.title || "Tidak Diketahui"}".
Mata pelajaran terdeteksi: ${subject || "Belum diketahui"}
Total soal terdeteksi: ~${totalQ} soal

Berikut adalah soal-soal pertama (representatif):

${focused}

Berdasarkan soal-soal di atas, bangun kursus pembelajaran dengan materi prasyarat, latihan bertingkat, dan pembahasan soal.`;
        } else {
            // Theory/mixed: send first 5500 chars of the text
            const chunk = fullText.substring(0, 5500);
            userPrompt = `Ini adalah dokumen "${space.title || "Tidak Diketahui"}".
Mata pelajaran terdeteksi: ${subject || "Belum diketahui"}
Jenis dokumen: ${docType === "theory" ? "Materi teori" : "Campuran teori dan soal"}

Konten dokumen:

${chunk}

Ekstrak dan susun menjadi kursus pembelajaran yang lengkap.`;
        }

        // ─── Phase 2: Single Gemini call ─────────────────────────────────────────
        let parsedPayload: any = null;

        try {
            const aiRaw = await callGemini(ai, systemPrompt, userPrompt, 2);
            console.log("[generate-space] AI response length:", aiRaw.length);
            if (aiRaw.length > 20) {
                parsedPayload = JSON.parse(cleanJson(aiRaw));
                console.log("[generate-space] Parsed OK — lessons:", parsedPayload.lessons?.length);
            }
        } catch (e: any) {
            console.error("[generate-space] Content generation or parse error:", e.message);
        }

        // ─── Intelligent Fallback ─────────────────────────────────────────────────
        if (!parsedPayload?.lessons?.length) {
            console.warn("[generate-space] Using fallback — docType:", docType, "subject:", subject);

            let statusMsg = "";
            if (docType === "questions_only") {
                statusMsg = `Dokumen berisi **kumpulan soal ${subject || ""}** (${segmentQuestions(fullText).length} soal terdeteksi).\n\nAI hampir selesai memproses — harap **tekan Bangun Ulang** sekali lagi dalam 10 detik.`;
            } else if (!fullText || fullText.length < 500) {
                statusMsg = "PDF terlalu sedikit teks yang bisa dibaca. PDF mungkin berupa hasil scan. Coba upload PDF dengan teks digital.";
            } else {
                statusMsg = "AI sempat mengalami gangguan koneksi. Harap **tekan Bangun Ulang** untuk mencoba lagi.";
            }

            parsedPayload = {
                main_topic: space.title,
                doc_type: docType,
                concept_graph: { subtopics: [], concepts: [], formulas: [], prerequisites: [] },
                ui_config: { theme: docType === "questions_only" ? "science" : "cosmic", layout: "lesson-focused" },
                lessons: [{
                    title: "Klik Bangun Ulang untuk Melanjutkan",
                    contentMdx: `## Status\n\n${statusMsg}\n\n---\n**Mata Pelajaran Terdeteksi:** ${subject || "Belum terdeteksi"}  \n**Jenis Dokumen:** ${docType === "questions_only" ? "Kumpulan Soal Ujian" : docType === "theory" ? "Buku/Materi Teori" : "Campuran Teori & Soal"}`,
                    scaffoldedExamples: [],
                    pdfWalkthrough: ""
                }]
            };
        }

        // ─── Save to DB ───────────────────────────────────────────────────────────
        await prisma.$transaction(async (tx) => {
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    title: parsedPayload.main_topic || space.title,
                    isGenerated: true,
                    theme: parsedPayload.ui_config?.theme || "cosmic",
                    uiConfig: JSON.stringify(parsedPayload.ui_config || {}),
                    conceptGraph: JSON.stringify(parsedPayload.concept_graph || {})
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

        return NextResponse.json({ success: true, docType, subject, lessonCount: parsedPayload.lessons.length });

    } catch (e: any) {
        console.error("[generate-space] Fatal:", e.message);
        return NextResponse.json({ error: e.message || "Gagal membangun kursus" }, { status: 500 });
    }
}
