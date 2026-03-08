import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { updateMasterySignal, recordError, serializeState, deserializeState, createInitialMasteryState } from "@/lib/mastery/engine";
import { MasterySignalSchema } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

const UpdateRequestSchema = z.object({
    subtopic: z.string(),
    observation: MasterySignalSchema.omit({ subtopic: true }).partial(),
    errorType: z.string().optional(),
    sessionId: z.string().optional(),
});

/**
 * POST /api/mastery/update
 * Called by the frontend after a user answers a quiz or completes a step.
 * Updates the per-subtopic mastery signal using exponential moving average.
 * Also called automatically by the saveMasteryProfile AI tool.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    let body: z.infer<typeof UpdateRequestSchema>;
    try {
        body = UpdateRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    // Load current state
    let masteryState = createInitialMasteryState();
    try {
        const profile = await prisma.masteryProfile.findUnique({ where: { userId: user.id } });
        if (profile) masteryState = deserializeState(profile as any);
    } catch { }

    // Apply update
    let newState = updateMasterySignal(masteryState, body.subtopic, body.observation);
    if (body.errorType) newState = recordError(newState, body.errorType, body.subtopic);

    // Persist
    const serialized = serializeState(newState);
    await prisma.masteryProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...serialized },
        update: { ...serialized, updatedAt: new Date() },
    });

    // Return dashboard-ready summary
    const signal = newState.topicMap[body.subtopic];
    return Response.json({
        updated: true,
        subtopic: body.subtopic,
        signal,
        readinessScore: newState.readinessScore,
        strengths: newState.strengths,
        weaknesses: newState.weaknesses,
        repeatedErrors: newState.repeatedErrors.slice(-5),
        independenceLevel: newState.independenceLevel,
        confidenceCalibration: newState.confidenceCalibration,
    });
}

/**
 * GET /api/mastery/update?full=true
 * Fetch full mastery dashboard for the authenticated user.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    try {
        const profile = await prisma.masteryProfile.findUnique({ where: { userId: user.id } });
        if (!profile) return Response.json({ initialized: false, readinessScore: 0, topicMap: {} });

        const state = deserializeState(profile as any);
        return Response.json({
            initialized: true,
            readinessScore: state.readinessScore,
            topicMap: state.topicMap,
            strengths: state.strengths,
            weaknesses: state.weaknesses,
            repeatedErrors: state.repeatedErrors,
            independenceLevel: state.independenceLevel,
            confidenceCalibration: state.confidenceCalibration,
        });
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
