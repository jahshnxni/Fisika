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
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const space = await prisma.courseSpace.findUnique({
        where: { id: spaceId },
        select: {
            buildStatus: true,
            buildStep: true,
            buildProgress: true,
            buildError: true,
            isGenerated: true,
        }
    });

    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    // Backward compat: if old record has isGenerated=true but no buildStatus, treat as READY
    if (space.isGenerated && space.buildStatus === "NEVER_BUILT") {
        return NextResponse.json({ buildStatus: "READY", buildStep: null, buildProgress: 100, buildError: null });
    }

    return NextResponse.json(space);
}
