import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { COURSE_BUILDER_PROMPT } from "@/lib/ai/master-prompt";

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

        // 1. Fetch the Space
        const space = await prisma.courseSpace.findUnique({
            where: { id: spaceId }
        });

        if (!space) {
            return NextResponse.json({ error: "Space not found" }, { status: 404 });
        }

        // Skip if already generated, unless force=true (Rebuild button)
        if (space.isGenerated && !force) {
            return NextResponse.json({ success: true, message: "Already generated." });
        }

        const textToAnalyze = space.pdfText ? space.pdfText.substring(0, 18000) : "Teks kosong.";

        // 2. Call Gemini with JSON mode enforced
        const geminiKey = process.env.GEMINI_API_KEY;
        let aiResult = "";
        let geminiError = "";

        if (geminiKey) {
            try {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey: geminiKey });

                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: [
                        {
                            role: "user" as const,
                            parts: [{
                                text: `Berikut adalah teks dari PDF yang perlu dianalisis dan dibuatkan kursus:\n\n${textToAnalyze}\n\nBuat struktur JSON kursus sesuai format yang telah ditentukan.`
                            }]
                        }
                    ],
                    config: {
                        systemInstruction: COURSE_BUILDER_PROMPT,
                        temperature: 0.4,
                        responseMimeType: "application/json",
                    },
                });
                aiResult = response.text || "";
                console.log("[generate-space] AI raw response length:", aiResult.length);
            } catch (e: any) {
                geminiError = e.message || "Unknown Gemini error";
                console.error("[generate-space] Gemini Error:", e);
            }
        } else {
            geminiError = "No GEMINI_API_KEY configured";
        }

        // 3. Clean and parse JSON (strip any accidental markdown wrapping)
        const cleaned = aiResult
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let parsedPayload: any = null;

        if (cleaned) {
            try {
                parsedPayload = JSON.parse(cleaned);
                console.log("[generate-space] JSON parsed successfully, lessons:", parsedPayload.lessons?.length);
            } catch (parseError: any) {
                console.error("[generate-space] JSON parse failed:", parseError.message);
                console.error("[generate-space] Raw AI output (first 500 chars):", cleaned.substring(0, 500));
            }
        }

        // 4. Fallback if AI fails
        if (!parsedPayload || !parsedPayload.lessons) {
            console.warn("[generate-space] Using fallback. Gemini error:", geminiError);

            // Still save but with a clear error message so user knows
            parsedPayload = {
                main_topic: space.title || "Pendahuluan",
                concept_graph: { subtopics: [], concepts: [], formulas: [], prerequisites: [] },
                ui_config: { theme: "cosmic", layout: "lesson-focused" },
                lessons: [{
                    title: "Materi Utama",
                    contentMdx: `## Perhatian\n\nAI gagal mengekstrak materi dari PDF ini secara otomatis.\n\n**Kemungkinan penyebab:**\n- PDF berisi gambar/scan (bukan teks digital)\n- Teks terlalu panjang atau tidak terbaca\n- Koneksi ke AI timeout\n\n**Silakan coba upload ulang PDF** dengan kualitas teks yang lebih baik, atau tekan tombol "Bangun Ulang" di halaman Overview.`,
                    scaffoldedExamples: [],
                    pdfWalkthrough: ""
                }]
            };
        }

        // 5. Save into Database
        await prisma.$transaction(async (tx) => {
            // Reset and update Space
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

            // Clear existing lessons before inserting fresh
            await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });

            // Insert new lessons with all fields properly mapped
            const lessons = parsedPayload.lessons || [];
            for (let i = 0; i < lessons.length; i++) {
                const l = lessons[i];

                // Normalize scaffoldedExamples to JSON string
                let scaffoldedMdxStr = "[]";
                if (Array.isArray(l.scaffoldedExamples) && l.scaffoldedExamples.length > 0) {
                    scaffoldedMdxStr = JSON.stringify(l.scaffoldedExamples);
                } else if (Array.isArray(l.scaffoldedMdx)) {
                    // Backward compat if AI returns scaffoldedMdx directly
                    scaffoldedMdxStr = JSON.stringify(l.scaffoldedMdx);
                }

                await tx.generatedLesson.create({
                    data: {
                        courseId: spaceId,
                        title: l.title || `Bab ${i + 1}`,
                        slug: `${spaceId}-lesson-${i + 1}`,
                        order: i + 1,
                        contentMdx: l.contentMdx || "",
                        scaffoldedMdx: scaffoldedMdxStr,
                        pdfWalkthrough: l.pdfWalkthrough || "",
                    }
                });
            }
        });

        return NextResponse.json({ success: true, lessonCount: parsedPayload.lessons.length });

    } catch (e: any) {
        console.error("[generate-space] Fatal Error:", e);
        return NextResponse.json({ error: e.message || "Gagal membangun kursus" }, { status: 500 });
    }
}
