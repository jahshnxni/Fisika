import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { chunkPdfText } from "@/lib/pdf/chunker";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/documents
 * Blueprint Lapisan 2 — Document Intelligence.
 * Creates a document record, triggers PDF text chunking,
 * and stores chunks in DocumentChunk table for retrieval.
 *
 * Called after: client uploads PDF to Blob, gets blob URL,
 * then POSTs here with courseId + blobUrl.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const { courseId, triggerChunking } = await req.json() as {
        courseId: string;
        triggerChunking?: boolean;
    };

    if (!courseId) return Response.json({ error: "courseId required" }, { status: 400 });

    // Verify ownership
    const course = await prisma.courseSpace.findFirst({ where: { id: courseId, userId: user.id } });
    if (!course) return Response.json({ error: "Course not found" }, { status: 404 });

    // Chunk the PDF text if it hasn't been chunked yet
    let chunksCreated = 0;
    if (triggerChunking !== false && course.pdfText && course.pdfText.length > 50) {
        const existingChunks = await prisma.documentChunk.count({ where: { courseId } });
        if (existingChunks === 0) {
            const chunks = chunkPdfText(course.pdfText);
            if (chunks.length > 0) {
                // Batch insert via createMany
                await prisma.documentChunk.createMany({
                    data: chunks.map(c => ({
                        courseId,
                        pageFrom: c.pageFrom,
                        pageTo: c.pageTo,
                        chunkText: c.chunkText.slice(0, 5000), // Limit per chunk
                        chunkType: c.chunkType,
                        metadata: JSON.stringify(c.metadata),
                    })),
                    skipDuplicates: true,
                });
                chunksCreated = chunks.length;
            }
        } else {
            chunksCreated = existingChunks; // Already chunked
        }
    }

    // Return document summary for the frontend
    const chunkStats = await prisma.documentChunk.groupBy({
        by: ["chunkType"],
        where: { courseId },
        _count: { id: true },
    });

    return Response.json({
        success: true,
        courseId,
        title: course.title,
        sourcePdfName: course.sourcePdfName,
        blobUrl: course.blobUrl,
        pdfSizeBytes: course.pdfSizeBytes,
        textLength: course.pdfText.length,
        buildStatus: course.buildStatus,
        chunksCreated,
        chunkBreakdown: Object.fromEntries(chunkStats.map(s => [s.chunkType, s._count.id])),
    });
}

/**
 * GET /api/documents?courseId=...
 * Fetch document metadata + chunk stats.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const courseId = new URL(req.url).searchParams.get("courseId");
    if (!courseId) {
        // List all documents for user
        const docs = await prisma.courseSpace.findMany({
            where: { userId: user.id },
            select: { id: true, title: true, sourcePdfName: true, blobUrl: true, buildStatus: true, createdAt: true, _count: { select: { chunks: true } } },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        return Response.json(docs);
    }

    const course = await prisma.courseSpace.findFirst({
        where: { id: courseId, userId: user.id },
        include: { _count: { select: { chunks: true, mediaJobs: true } } },
    });
    if (!course) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({
        id: course.id, title: course.title, blobUrl: course.blobUrl,
        buildStatus: course.buildStatus, chunkCount: course._count.chunks,
        mediaJobCount: course._count.mediaJobs,
    });
}
