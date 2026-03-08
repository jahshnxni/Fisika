import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/jobs/[jobId]
 * Poll status of an async media render job.
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ jobId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    // Next.js 15: params is a Promise — must be awaited
    const { jobId } = await context.params;
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
    if (job.course.userId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });

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
        pollIntervalMs: job.status === "queued" || job.status === "running"
            ? job.mediaType === "video" ? 10000 : 5000
            : null,
    });
}
