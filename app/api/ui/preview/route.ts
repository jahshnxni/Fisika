import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const PreviewRequestSchema = z.object({
    proposalId: z.string(),
    courseId: z.string().optional(),
});

/**
 * POST /api/ui/preview
 *
 * Generates a safe sandbox preview URL for a UI Patch Proposal.
 *
 * Current implementation:
 *   - Validates the proposal exists and belongs to the user's course
 *   - Returns proposal details for internal UI preview rendering
 *   - Updates proposal status to "previewed"
 *
 * Phase 5 full implementation (requires Vercel Sandbox):
 *   - Will use vercel-sandbox to spin up an isolated Next.js env
 *   - Run typecheck + lint + build smoke test in sandbox
 *   - Return live preview URL from Vercel's CDN
 *
 * Why not auto-apply?
 *   Patches with riskLevel "high" require explicit admin approval.
 *   No patch is ever applied to production code automatically.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    let body: z.infer<typeof PreviewRequestSchema>;
    try {
        body = PreviewRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    // Find the proposal — verify ownership via course
    const proposal = await prisma.uiPatchProposal.findFirst({
        where: { id: body.proposalId },
        include: { course: { select: { userId: true, id: true } } },
    });

    if (!proposal) return Response.json({ error: "Proposal not found" }, { status: 404 });
    if (proposal.course.userId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 });
    if (proposal.riskLevel === "high" && user.role !== "ADMIN") {
        return Response.json({
            error: "High-risk patches require admin review before preview",
            proposal: { id: proposal.id, riskLevel: proposal.riskLevel },
        }, { status: 403 });
    }

    // Mark as previewed
    await prisma.uiPatchProposal.update({
        where: { id: proposal.id },
        data: { status: "previewed", updatedAt: new Date() },
    });

    // Parse implementation plan (stored as JSON string)
    let implementationPlan: string[] = [];
    try {
        implementationPlan = JSON.parse(proposal.implementationPlan);
    } catch { }

    let successMetrics: string[] = [];
    try {
        successMetrics = JSON.parse(proposal.successMetrics);
    } catch { }

    // Return structured preview data for the UI to display
    return Response.json({
        proposalId: proposal.id,
        status: "previewed",
        area: proposal.area,
        diagnosis: proposal.diagnosis,
        goal: proposal.goal,
        patchSummary: proposal.patchSummary,
        implementationPlan,
        pedagogicalReason: proposal.pedagogicalReason,
        riskLevel: proposal.riskLevel,
        rollbackPlan: proposal.rollbackPlan,
        successMetrics,
        previewNote: proposal.riskLevel === "low"
            ? "This is a low-risk patch. Review the implementation plan and approve when ready."
            : "This patch requires careful review before approval. Check the rollback plan.",
        requiresAdminApproval: proposal.riskLevel === "high",
        // Vercel Sandbox preview URL will be added in Phase 5 full integration
        sandboxPreviewUrl: null,
        warning: "Patches are NEVER applied automatically. Use /api/ui/approve (Phase 5) to apply after review.",
    });
}
