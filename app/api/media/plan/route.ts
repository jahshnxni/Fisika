import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { manimCinematicEngine } from "@/lib/ai/prompts/manim-cinematic-engine";

export const runtime = "nodejs";
export const maxDuration = 60;

const MediaRequestSchema = z.object({
    topic: z.string(),
    subtopic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard", "extreme"]).default("medium"),
    questionText: z.string().optional(),
    solutionSteps: z.array(z.string()).optional(),
    commonMistakes: z.array(z.string()).optional(),
    formulaDensity: z.number().min(0).max(1).default(0.3),
    outputType: z.enum(["auto", "image", "video"]).default("auto"),
    targetDurationSec: z.number().default(90),
    weakness: z.string().optional(),
    courseId: z.string().optional(),
    pedagogicalNeed: z.string().optional(),
});

/**
 * POST /api/media/plan
 *
 * Generates a video storyboard or image brief for a given topic.
 * Uses the MATH CINEMATIC EXPLAINER ENGINE prompt for math videos.
 * Primary: Gemini, Fallback: OpenAI, Final Fallback: local defaults.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: z.infer<typeof MediaRequestSchema>;
    try {
        body = MediaRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    const { topic, formulaDensity = 0.3 } = body;
    const isVideoRequest = body.outputType === "video" || formulaDensity > 0.5;

    try {
        const geminiKey = process.env.GEMINI_API_KEY;

        if (geminiKey) {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey: geminiKey });

            if (isVideoRequest) {
                // Use the full MATH CINEMATIC EXPLAINER ENGINE for video storyboards
                const userPrompt = `Soal/Topik: ${topic}${body.subtopic ? `\nSubtopik: ${body.subtopic}` : ""}${body.questionText ? `\nSoal lengkap: ${body.questionText}` : ""}${body.solutionSteps ? `\nLangkah solusi: ${body.solutionSteps.join(", ")}` : ""}
Difficulty: ${body.difficulty}
Target durasi: ${body.targetDurationSec}s

Buatkan storyboard video matematika lengkap dalam format JSON sesuai schema.
Output JSON harus memiliki field:
{
  "topic": "...",
  "targetLevel": "beginner|intermediate|advanced",
  "goal": "tujuan video",
  "scenes": [
    {
      "id": "scene_01",
      "type": "hook|question|given|target|concept|why-method|step|verification|mistake|quiz|outro",
      "durationSec": 5,
      "objective": "...",
      "narration": "...",
      "screenText": ["..."],
      "latex": ["..."],
      "transitionIn": "fade",
      "transitionOut": "fade"
    }
  ],
  "commonMistakes": ["..."]
}`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: userPrompt,
                    config: {
                        systemInstruction: manimCinematicEngine,
                    },
                });

                const text = response?.text || "";
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return Response.json({
                        type: "video_storyboard",
                        engine: "manim",
                        data: parsed,
                    });
                }
            } else {
                // Generate image brief
                const prompt = `Kamu adalah guru fisika. Untuk topik "${topic}", buatkan data video edukasi dalam format JSON:
{
  "title": "Judul singkat topik",
  "keyPoints": ["poin 1", "poin 2", "poin 3", "poin 4"],
  "formula": "rumus utama jika ada, kosongkan jika tidak relevan"
}
Jawab HANYA dengan JSON valid, tanpa markdown.`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                });

                const text = response?.text || "";
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return Response.json({
                        type: "image_brief",
                        engine: "gemini",
                        data: {
                            title: parsed.title || topic,
                            keyPoints: parsed.keyPoints || [],
                            formula: parsed.formula || "",
                        },
                    });
                }
            }
        }

        // Fallback: try OpenAI if available
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey) {
            const { generateObject } = await import("ai");
            const { openai } = await import("@ai-sdk/openai");
            const { ImageBriefSchema, VideoStoryboardSchema } = await import("@/lib/ai/schemas");
            const { MODELS } = await import("@/lib/ai/models");

            const schema = isVideoRequest ? VideoStoryboardSchema : ImageBriefSchema;
            const system = isVideoRequest ? manimCinematicEngine : undefined;

            const { object } = await generateObject({
                model: openai(MODELS.text),
                schema,
                system,
                prompt: JSON.stringify({
                    topic,
                    subtopic: body.subtopic,
                    difficulty: body.difficulty,
                }),
            });

            return Response.json({
                type: isVideoRequest ? "video_storyboard" : "image_brief",
                engine: "openai",
                data: object,
            });
        }

        // No AI available — return sensible defaults
        return Response.json({
            type: "image_brief",
            engine: "local",
            data: {
                title: topic,
                keyPoints: [
                    `Memahami konsep dasar ${topic}`,
                    `Menganalisis fenomena ${topic}`,
                    `Penerapan dalam kehidupan nyata`,
                    `Strategi menyelesaikan soal`,
                ],
                formula: "",
            },
        });

    } catch (e: any) {
        console.error("[media/plan] Error:", e.message);

        // Even on error, return fallback data so the video still plays
        return Response.json({
            type: "image_brief",
            engine: "fallback",
            data: {
                title: topic,
                keyPoints: [
                    `Memahami konsep ${topic}`,
                    `Analisis pola dan prinsip`,
                    `Penerapan soal-soal`,
                ],
                formula: "",
            },
        });
    }
}
