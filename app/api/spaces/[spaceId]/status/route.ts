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
        select: { buildStatus: true, buildStep: true, buildProgress: true, buildError: true }
    });

    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    // buildStatus column is authoritative — no backward compat shortcuts
    // If NEVER_BUILT, the AutoBuildGate will trigger the build pipeline
    return NextResponse.json(space);
}
