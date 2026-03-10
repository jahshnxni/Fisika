import { NextRequest } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { UNIVERSAL_SOLVER_PROMPT } from "@/lib/ai/prompts/universal-solver";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { prompt: rawQuestion, lessonId } = await req.json();

        if (!rawQuestion) {
            return Response.json({ error: "Missing prompt (rawQuestion)" }, { status: 400 });
        }

        const result = streamText({
            model: google("gemini-2.0-flash"), // Using gemini-2.0-flash
            system: UNIVERSAL_SOLVER_PROMPT,
            prompt: `Selesaikan dan buatkan storyboard video untuk soal berikut secara mendetail sesuai instruksi mutlak Anda:\n\n${rawQuestion}`,
            temperature: 0.2, // Low temperature for factual physics/math solving
            async onFinish({ text }) {
                // Background save to database if lessonId is provided
                if (lessonId) {
                    try {
                        await prisma.generatedLesson.update({
                            where: { id: lessonId },
                            data: { pdfWalkthrough: text }
                        });
                        console.log(`[solve/route] Saved solve result for lesson ${lessonId}`);
                    } catch (e) {
                        console.error("[solve/route] Failed to save walkthrough:", e);
                    }
                }
            }
        });

        return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : (result as any).toTextStreamResponse();
    } catch (e: any) {
        console.error("[solve/route] Error:", e.message);
        return Response.json({ error: e.message }, { status: 500 });
    }
}
