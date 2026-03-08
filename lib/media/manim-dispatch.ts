import type { VideoStoryboard, MediaEngine } from "@/lib/ai/schemas";

// ─── Environment ──────────────────────────────────────────────────────────────
const MANIM_WORKER_URL = process.env.MANIM_WORKER_URL || "";
const MANIM_WORKER_SECRET = process.env.MANIM_WORKER_SECRET || "";

export interface ManimDispatchInput {
    storyboard: VideoStoryboard;
    courseId: string;
    jobId: string;
    webhookUrl?: string; // Called when render completes
}

export interface ManimDispatchResult {
    accepted: boolean;
    message: string;
    estimatedSeconds?: number;
}

/**
 * Dispatch a Manim render job to the sidecar worker.
 *
 * The worker runs render_scene.py, renders formula scenes with Manim CLI,
 * concatenates clips with ffmpeg, and uploads the result to Vercel Blob.
 *
 * When render is done, the worker POSTs to webhookUrl (if provided),
 * or you can poll the worker's /status/:jobId endpoint.
 *
 * Deploy options:
 *   - Fly.io sidecar: set MANIM_WORKER_URL to your fly.dev URL
 *   - Cloud Run job: set MANIM_WORKER_URL to the Cloud Run endpoint
 *   - Vercel Sandbox (Phase 5): isolated execution environment
 *   - Local dev: http://localhost:5678
 */
export async function dispatchManimJob(input: ManimDispatchInput): Promise<ManimDispatchResult> {
    if (!MANIM_WORKER_URL) {
        console.warn("[manim-dispatch] MANIM_WORKER_URL not set — skipping Manim dispatch. Video will remain queued.");
        return { accepted: false, message: "Manim worker not configured (MANIM_WORKER_URL missing)" };
    }

    const payload = {
        jobId: input.jobId,
        courseId: input.courseId,
        storyboard: input.storyboard,
        webhookUrl: input.webhookUrl,
        blobToken: process.env.BLOB_READ_WRITE_TOKEN,
    };

    const res = await fetch(`${MANIM_WORKER_URL}/render`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(MANIM_WORKER_SECRET ? { "X-Worker-Secret": MANIM_WORKER_SECRET } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000), // 10s timeout for dispatch (not render)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Manim worker dispatch failed: ${res.status} — ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    return {
        accepted: true,
        message: data.message || "Render job accepted",
        estimatedSeconds: data.estimatedSeconds,
    };
}

/**
 * Check if storyboard qualifies for Manim (formula-heavy).
 * Returns true if formulaDensity > 0.6 OR >60% of scenes have LaTeX.
 */
export function shouldUseManimForStoryboard(storyboard: VideoStoryboard): boolean {
    if (!storyboard.scenes?.length) return false;
    const scenesWithLatex = storyboard.scenes.filter(s => (s.latex?.length ?? 0) > 0);
    const density = scenesWithLatex.length / storyboard.scenes.length;
    return density > 0.6 || storyboard.enginePreference === "manim";
}
