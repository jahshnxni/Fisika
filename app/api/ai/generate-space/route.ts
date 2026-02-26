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
        const { spaceId } = body;
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

        if (space.isGenerated) {
            return NextResponse.json({ success: true, message: "Already generated." });
        }

        const textToAnalyze = space.pdfText ? space.pdfText.substring(0, 15000) : "Teks kosong.";

        // 2. Call AI (Gemini Flash Lite or Groq)
        const geminiKey = process.env.GEMINI_API_KEY;
        let aiResult = "";

        if (geminiKey) {
            try {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey: geminiKey });
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash-lite",
                    contents: [
                        { role: "user" as const, parts: [{ text: textToAnalyze }] },
                    ],
                    config: {
                        systemInstruction: COURSE_BUILDER_PROMPT,
                        temperature: 0.3,
                    },
                });
                aiResult = response.text || "{}";
            } catch (e) {
                console.error("Gemini Gen Failed", e);
            }
        }

        // Clean JSON string (in case the AI wraps it in ```json ... ```)
        aiResult = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();

        // Use Mock data if AI fails parsing JSON
        let parsedPayload: any = {
            main_topic: "Pendahuluan",
            concept_graph: { subtopics: [] },
            ui_config: { theme: "cosmic" },
            lessons: [{ title: "Teori Dasar", contentMdx: "AI gagal mengekstrak, ini teks bawaan." }]
        };

        try {
            parsedPayload = JSON.parse(aiResult);
        } catch {
            console.warn("Using Mock fallback");
        }

        // 3. Save into Database (Engine 2 & 8: Database & UI Construction)
        await prisma.$transaction(async (tx) => {
            // Update Space
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

            // Insert Lessons
            if (parsedPayload.lessons && parsedPayload.lessons.length > 0) {
                // Clear existing lessons just in case
                await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });

                for (let i = 0; i < parsedPayload.lessons.length; i++) {
                    const l = parsedPayload.lessons[i];
                    await tx.generatedLesson.create({
                        data: {
                            courseId: spaceId,
                            title: l.title,
                            slug: `lesson-${i + 1}-${Date.now()}`,
                            order: i + 1,
                            contentMdx: l.contentMdx,
                            scaffoldedMdx: "[]",
                            pdfWalkthrough: "",
                        }
                    });
                }
            }
        });

        return NextResponse.json({ success: true, data: parsedPayload });

    } catch (e: any) {
        console.error("Generate Space API Error:", e);
        return NextResponse.json({ error: e.message || "Gagal membangun kursus" }, { status: 500 });
    }
}
