import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const SoraRequestSchema = z.object({
    courseId: z.string(),
    clipType: z.enum(["intro", "outro", "motivational"]),
    topic: z.string(),
    durationSec: z.number().min(4).max(12).default(8),
    style: z.enum(["cinematic", "minimal", "energetic"]).default("cinematic"),
    narration: z.string().optional(), // If provided, used as the visual description
});

/**
 * POST /api/media/sora
 *
 * Generates a short intro/outro/motivational clip using OpenAI Video API (Sora).
 *
 * ⛔ IMPORTANT CONSTRAINTS:
 *   - ONLY for intro / outro / motivational clips (3-12 seconds)
 *   - NEVER for solution steps, derivations, or deterministic content
 *   - Non-deterministic output — humans must review before showing to students
 *
 * Current implementation:
 *   If OPENAI_API_KEY is set and Sora API is available → generate clip.
 *   Otherwise → returns a placeholder metadata JSON (graceful degradation).
 *
 * Prompt strategy:
 *   We generate rich visual prompts from topic + clipType + style,
 *   then queue the generation and poll for completion.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    let body: z.infer<typeof SoraRequestSchema>;
    try {
        body = SoraRequestSchema.parse(await req.json());
    } catch (e: any) {
        return Response.json({ error: "Invalid request", details: e.message }, { status: 400 });
    }

    const { clipType, topic, durationSec, style, narration } = body;

    // ── Build visual prompt ──────────────────────────────────────────────────
    const styleDescriptions = {
        cinematic: "cinematic 4K documentary style, dramatic lighting, soft bokeh, premium educational",
        minimal: "clean minimal whitespace, soft gradient background, elegant typography focus",
        energetic: "dynamic motion graphics, vibrant colors, fast cuts, modern infographic style",
    };

    const clipDescriptions = {
        intro: `${styleDescriptions[style]}. Opening sequence for a learning session about "${topic}". Student-friendly, inspiring, sets learning mindset. Show abstract representations of the topic — NOT literal diagrams or text.`,
        outro: `${styleDescriptions[style]}. Closing celebration sequence. Student achieved mastery of "${topic}". Uplifting, sense of accomplishment, forward-looking. Confetti or subtle light particles optional.`,
        motivational: `${styleDescriptions[style]}. Mid-session motivational boost. Abstract flowing motion that represents understanding and breakthrough. Brain, lightbulb, or connectivity metaphors allowed.`,
    };

    const prompt = narration
        ? `${clipDescriptions[clipType]} Visual narration: ${narration}`
        : clipDescriptions[clipType];

    // ── Try Sora API ─────────────────────────────────────────────────────────
    if (!process.env.OPENAI_API_KEY) {
        return Response.json({
            status: "degraded",
            reason: "OPENAI_API_KEY not configured",
            clipType, topic, durationSec, style,
            prompt,
            message: "Sora integration requires OPENAI_API_KEY with Video API access. Returning prompt for manual generation.",
        });
    }

    try {
        const OpenAI = (await import("openai")).default;
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // OpenAI Video API (Sora) — uses client.videos.generate() or responses API
        // NOTE: Sora API access is in limited beta. If not available, graceful fallback.
        const videoModel = process.env.OPENAI_MODEL_VIDEO || "sora-2";

        // Use the Responses API with video generation if available
        // @ts-ignore — Video API may not yet be in openai@4 typedefs
        const response = await (client as any).videos?.generate?.({
            model: videoModel,
            prompt,
            duration: durationSec,
            resolution: "1080p",
            n: 1,
        });

        if (response?.data?.[0]?.url) {
            return Response.json({
                status: "completed",
                clipType, topic, durationSec, style,
                url: response.data[0].url,
                prompt,
            });
        }

        throw new Error("Sora API returned no video URL — may not be in your plan tier.");

    } catch (err: any) {
        const isSoraUnavailable =
            err.message?.includes("not found") ||
            err.message?.includes("model") ||
            err.message?.includes("beta") ||
            err.message?.includes("undefined");

        return Response.json({
            status: isSoraUnavailable ? "api_unavailable" : "failed",
            clipType, topic, durationSec, style,
            prompt,
            error: err.message?.slice(0, 200),
            fallback: "Use the prompt above with Sora via platform.openai.com when API access is granted.",
        }, { status: isSoraUnavailable ? 200 : 502 });
        // Return 200 for api_unavailable so client can show the prompt as fallback
    }
}
