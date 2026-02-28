import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const space = await prisma.courseSpace.findUnique({
        where: { id: spaceId },
        select: {
            buildStatus: true,
            buildStep: true,
            buildProgress: true,
            buildError: true,
            lessons: { select: { title: true }, take: 1 }
        }
    });

    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    // Detect stale fallback content: if READY but lesson title looks like a fallback
    const firstLessonTitle = space.lessons[0]?.title || "";
    const isStale = space.buildStatus === "READY" && (
        firstLessonTitle.includes("Retry") ||
        firstLessonTitle.includes("Bangun Ulang") ||
        firstLessonTitle.includes("Sedang Diproses")
    );

    if (isStale) {
        // Auto-reset to NEVER_BUILT so AutoBuildGate triggers a fresh build
        await prisma.courseSpace.update({
            where: { id: spaceId },
            data: { buildStatus: "NEVER_BUILT", buildStep: null, buildProgress: 0, buildError: null }
        });
        return NextResponse.json({ buildStatus: "NEVER_BUILT", buildStep: null, buildProgress: 0, buildError: null });
    }

    return NextResponse.json({
        buildStatus: space.buildStatus,
        buildStep: space.buildStep,
        buildProgress: space.buildProgress,
        buildError: space.buildError,
    });
}
