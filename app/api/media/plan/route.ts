import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { MODELS } from "@/lib/ai/models";
import { VideoStoryboardSchema, ImageBriefSchema } from "@/lib/ai/schemas";
import { mediaPlanner } from "@/lib/ai/prompts/media-planner";
import { chooseMediaEngine } from "@/lib/media/router";
import { z } from "zod";

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
});

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    let body: z.infer<typeof MediaRequestSchema>;
    try {
        body = MediaRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    const { topic, formulaDensity, outputType } = body;

    // Determine what to generate
    const resolvedOutputType = outputType === "auto"
        ? (formulaDensity > 0.5 ? "video" : "image")
        : outputType;

    const engine = chooseMediaEngine({
        outputType: resolvedOutputType as "image" | "video",
        formulaDensity,
        needsPreciseMathTypesetting: formulaDensity > 0.6,
        needsCinematicClip: false,
    });

    const prompt = JSON.stringify({
        topic,
        subtopic: body.subtopic,
        difficulty: body.difficulty,
        questionText: body.questionText,
        solutionSteps: body.solutionSteps,
        commonMistakes: body.commonMistakes,
        targetDurationSec: body.targetDurationSec,
        weakness: body.weakness,
        preferredEngine: engine,
        preferredOutputType: resolvedOutputType,
    });

    try {
        if (resolvedOutputType === "video") {
            const { object } = await generateObject({
                model: openai(MODELS.text),
                schema: VideoStoryboardSchema,
                system: mediaPlanner,
                prompt,
            });
            return Response.json({
                type: "video_storyboard",
                engine,
                data: object,
            });
        } else {
            const { object } = await generateObject({
                model: openai(MODELS.text),
                schema: ImageBriefSchema,
                system: mediaPlanner,
                prompt,
            });
            return Response.json({
                type: "image_brief",
                engine: "gpt-image",
                data: object,
            });
        }
    } catch (e: any) {
        console.error("[media/plan] generateObject failed:", e.message);
        return Response.json({ error: e.message }, { status: 503 });
    }
}
