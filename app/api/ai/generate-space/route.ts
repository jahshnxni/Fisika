import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
        // Prompt Engineering to force structured JSON output mapping the Curriculum
        const systemPrompt = `Kamu adalah AI Physics Course Builder.
Tugasmu adalah menganalisis teks materi mentah berikut (mungkin copas dari PDF berantakan), dan mengubahnya menjadi struktur silabus kursus JSON.

Format JSON wajib seperti ini (TANPA MARKDOWN BACKTICKS, murni JSON):
{
  "topics": ["Nama Bab Utama 1", "Nama Bab Utama 2"],
  "lessons": [
    {
      "title": "Sub Bab 1",
      "contentMdx": "Penjelasan singkat menggunakan rumus LaTeX $E=mc^2$."
    }
  ]
}

PENTING:
- Ambil inti sari materi dari PDF Text di bawah.
- Buat maksimal 3 lessons agar tidak terlalu panjang.
- Jangan gunakan formatting markdown di awal dan akhir JSON.
`;

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
                        systemInstruction: systemPrompt,
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
        let parsedPayload = { topics: ["Pendahuluan"], lessons: [{ title: "Teori Dasar", contentMdx: "AI gagal mengekstrak, ini adalah teks bawaan." }] };
        try {
            parsedPayload = JSON.parse(aiResult);
        } catch {
            console.warn("Using Mock fallback");
        }

        // 3. Save into Database (Engine 2: Database Construction)
        // Note: Using a transaction to ensure integrity
        await prisma.$transaction(async (tx) => {
            // Update Space
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    isGenerated: true,
                    conceptGraph: JSON.stringify({ topics: parsedPayload.topics })
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
