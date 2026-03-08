import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/jobs/[jobId]
 * Poll status of an async media render job.
 *
 * Response shape:
 * {
 *   id: string,
 *   status: "queued" | "running" | "completed" | "failed" | "retryable_failed",
 *   mediaType: "image" | "video" | "audio",
 *   engine: "gpt-image" | "remotion" | "manim" | "sora" | "tts",
 *   outputUrl: string | null,
 *   errorMessage: string | null,
 *   attemptCount: number,
 *   createdAt: string,
 *   updatedAt: string,
 * }
 *
 * Suggested client polling interval:
 *   image jobs: poll every 5s (usually <10s)
 *   video jobs: poll every 10s (can take 60-180s)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { jobId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const jobId = params.jobId;
    if (!jobId) return Response.json({ error: "jobId required" }, { status: 400 });

    const job = await prisma.mediaJob.findFirst({
        where: { id: jobId },
        select: {
            id: true,
            status: true,
            mediaType: true,
            engine: true,
            outputUrl: true,
            errorMessage: true,
            attemptCount: true,
            sourceType: true,
            createdAt: true,
            updatedAt: true,
            course: { select: { userId: true } },
        },
    });

    if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

    // Verify ownership via course
    if (job.course.userId !== user.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({
        id: job.id,
        status: job.status,
        mediaType: job.mediaType,
        engine: job.engine,
        outputUrl: job.outputUrl ?? null,
        errorMessage: job.errorMessage ?? null,
        attemptCount: job.attemptCount,
        sourceType: job.sourceType,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        // Suggest retry/polling interval to client
        pollIntervalMs: job.status === "queued" || job.status === "running"
            ? job.mediaType === "video" ? 10000 : 5000
            : null,
    });
}
