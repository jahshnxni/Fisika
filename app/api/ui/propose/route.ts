import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateObject } from "ai";
import { openai, MODELS } from "@/lib/ai/client";
import { UiPatchProposalSchema } from "@/lib/ai/schemas";
import { uiPatchPlanner } from "@/lib/ai/prompts/ui-patch-planner";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const ProposeRequestSchema = z.object({
    area: z.enum(["chat", "lesson", "media-panel", "quiz-panel", "dashboard"]),
    frictionDescription: z.string().min(10),
    observedBehavior: z.string().optional(),
    sessionContext: z.string().optional(),
});

/**
 * POST /api/ui/propose
 * AI analyzes UX friction → returns UiPatchProposal JSON (NOT applied to code automatically)
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    let body: z.infer<typeof ProposeRequestSchema>;
    try {
        body = ProposeRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    try {
        const { object } = await generateObject({
            model: openai(MODELS.reasoning),
            schema: UiPatchProposalSchema,
            system: uiPatchPlanner,
            prompt: JSON.stringify(body),
        });

        // In Phase 5 we'll persist this to ui_patch_proposals table
        return Response.json({
            proposal: object,
            status: "proposed",
            warning: "This proposal has NOT been applied. Manual review required, especially for riskLevel: high.",
        });
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 503 });
    }
}
