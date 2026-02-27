import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Idempotent build trigger.
 * - READY       → no-op
 * - PROCESSING / QUEUED → returns current status (no duplicate job)
 * - NEVER_BUILT / ERROR → starts a fresh build
 */
export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    const { spaceId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const space = await prisma.courseSpace.findUnique({
        where: { id: spaceId },
        select: { buildStatus: true }
    });

    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    // Already done
    if (space.buildStatus === "READY") {
        return NextResponse.json({ status: "READY" });
    }

    // Already in progress — don't start duplicate
    if (space.buildStatus === "QUEUED" || space.buildStatus === "PROCESSING") {
        return NextResponse.json({ status: space.buildStatus });
    }

    // Start a new build (NEVER_BUILT or ERROR)
    await prisma.courseSpace.update({
        where: { id: spaceId },
        data: { buildStatus: "QUEUED", buildStep: "PARSING", buildProgress: 0, buildError: null }
    });

    // Fire-and-forget the worker
    const appUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

    fetch(`${appUrl}/api/spaces/${spaceId}/build/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-internal-key": process.env.INTERNAL_BUILD_KEY || "build-internal"
        }
    }).catch((e) => console.error("[build] Worker fire failed:", e.message));

    return NextResponse.json({ status: "QUEUED" });
}
