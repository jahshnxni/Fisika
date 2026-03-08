import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VideoStoryboardSchema, ImageBriefSchema } from "@/lib/ai/schemas";
import { uploadImage } from "@/lib/blob/client";
import { makeDedupeKey } from "@/lib/media/router";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const RenderRequestSchema = z.object({
    courseId: z.string(),
    type: z.enum(["image", "video"]),
    engine: z.enum(["gpt-image", "remotion", "manim", "sora", "tts"]).optional(),
    storyboard: VideoStoryboardSchema.optional(), // for video
    imageBrief: ImageBriefSchema.optional(),       // for image
    sourceType: z.enum(["concept", "question", "weakness", "recap"]).default("concept"),
});

/**
 * POST /api/media/render
 *
 * Strategy:
 *   image (gpt-image) → generate immediately → upload to Blob → return URL
 *   video (remotion/manim/sora) → queue as MediaJob → return jobId for polling
 *
 * Client polls GET /api/jobs/[jobId] for video status.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    let body: z.infer<typeof RenderRequestSchema>;
    try {
        body = RenderRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    // ─── Verify course ownership ───────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const course = await prisma.courseSpace.findFirst({ where: { id: body.courseId, userId: user.id } });
    if (!course) return Response.json({ error: "Course not found" }, { status: 404 });

    // ─── IMAGE: Generate immediately via OpenAI Image API ─────────────────
    if (body.type === "image" && body.imageBrief) {
        const brief = body.imageBrief;
        const dedupeKey = makeDedupeKey({ documentId: body.courseId, topic: brief.topic, engine: "gpt-image" });

        // Check dedupe
        const existing = await prisma.mediaJob.findFirst({ where: { dedupeKey, status: "completed" } });
        if (existing?.outputUrl) {
            return Response.json({ type: "image", url: existing.outputUrl, cached: true });
        }

        // Create job record first
        const job = await prisma.mediaJob.create({
            data: {
                courseId: body.courseId,
                sourceType: body.sourceType,
                mediaType: "image",
                engine: "gpt-image",
                inputJson: JSON.stringify(brief),
                status: "running",
                dedupeKey,
                attemptCount: 1,
            }
        });

        try {
            if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

            const OpenAI = (await import("openai")).default;
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

            const imageResponse = await client.images.generate({
                model: (process.env.OPENAI_MODEL_IMAGE || "dall-e-3") as any,
                prompt: brief.prompt,
                n: 1,
                size: "1792x1024",
                quality: "hd",
                response_format: "b64_json",
            } as any);

            const b64 = imageResponse.data?.[0]?.b64_json;
            if (!b64) throw new Error("No image data returned from OpenAI");

            const buffer = Buffer.from(b64, "base64");
            const filename = `${brief.topic.replace(/\s+/g, "_")}_${brief.imageType}.png`;
            const blob = await uploadImage(buffer, filename);

            await prisma.mediaJob.update({
                where: { id: job.id },
                data: { status: "completed", outputUrl: blob.url, updatedAt: new Date() }
            });

            return Response.json({ type: "image", url: blob.url, jobId: job.id });

        } catch (err: any) {
            await prisma.mediaJob.update({
                where: { id: job.id },
                data: { status: "failed", errorMessage: err.message?.slice(0, 200), updatedAt: new Date() }
            });
            return Response.json({ error: err.message, jobId: job.id }, { status: 502 });
        }
    }

    // ─── VIDEO: Queue async render job ────────────────────────────────────
    if (body.type === "video" && body.storyboard) {
        const board = body.storyboard;
        const engine = body.engine || board.enginePreference || "remotion";
        const dedupeKey = makeDedupeKey({ documentId: body.courseId, topic: board.topic, engine: engine as any });

        // Check dedupe
        const existing = await prisma.mediaJob.findFirst({ where: { dedupeKey, status: { in: ["queued", "running", "completed"] } } });
        if (existing) {
            return Response.json({ type: "video", jobId: existing.id, status: existing.status, url: existing.outputUrl ?? null, cached: true });
        }

        const job = await prisma.mediaJob.create({
            data: {
                courseId: body.courseId,
                sourceType: body.sourceType,
                mediaType: "video",
                engine,
                inputJson: JSON.stringify(board),
                status: "queued",
                dedupeKey,
                attemptCount: 0,
            }
        });

        // Note: Actual render is triggered by a worker (Remotion Lambda or Vercel Workflow).
        // For now, the job is queued and the client can poll /api/jobs/[jobId].
        return Response.json({
            type: "video",
            jobId: job.id,
            status: "queued",
            engine,
            message: "Video render job queued. Poll /api/jobs/" + job.id + " for status.",
        }, { status: 202 });
    }

    return Response.json({ error: "Invalid render request: missing storyboard or imageBrief" }, { status: 400 });
}
