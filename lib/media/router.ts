import type { MasterySignal } from "@/lib/ai/schemas";

// ─── Media Engine Types ───────────────────────────────────────────────────────
export type MediaEngine = "gpt-image" | "remotion" | "manim" | "sora" | "tts";

// Blueprint §11: exact router interface
interface MediaRouterInput {
    outputType: "image" | "video";
    formulaDensity: number;
    needsPreciseMathTypesetting: boolean;
    needsCinematicClip: boolean;
}

/**
 * Blueprint §11 — choose engine with simple deterministic rules:
 *
 * gpt-image  → any still image/diagram
 * sora       → intro/outro/motivational (≤12s) — NOT for solution steps
 * manim      → formula-heavy or math precision required
 * remotion   → all other video (default)
 *
 * Never adds audio — TTS is a separate call.
 */
export function chooseMediaEngine(input: MediaRouterInput): MediaEngine {
    if (input.outputType === "image") return "gpt-image";
    if (input.needsCinematicClip) return "sora";
    if (input.needsPreciseMathTypesetting || input.formulaDensity > 0.6) return "manim";
    return "remotion";
}


// ─── Mastery-driven media decision ───────────────────────────────────────────
/**
 * Given a mastery signal, decide IF and what media to generate proactively.
 */
export function masteryToMediaRecommendation(signal: MasterySignal): {
    shouldGenerate: boolean;
    outputType?: "image" | "video";
    engine?: MediaEngine;
    reason?: string;
} {
    if (signal.concept < 55) {
        return {
            shouldGenerate: true,
            outputType: "video",
            engine: signal.logic < 50 ? "manim" : "remotion",
            reason: `Concept score ${signal.concept}/100 — user needs visual foundation explanation`,
        };
    }
    if (signal.concept >= 55 && signal.logic < 60) {
        return {
            shouldGenerate: true,
            outputType: "image",
            engine: "gpt-image",
            reason: `Logic score ${signal.logic}/100 — concept card or diagram may help connect ideas`,
        };
    }
    if (signal.stability < 50) {
        return {
            shouldGenerate: true,
            outputType: "image",
            engine: "gpt-image",
            reason: `Stability score ${signal.stability}/100 — error infographic recommended`,
        };
    }
    return { shouldGenerate: false };
}

// ─── Dedupe key generator ─────────────────────────────────────────────────────
/**
 * Produce a stable deduplication key for a media job.
 * Same inputs → same key → avoid re-rendering identical assets.
 */
export function makeDedupeKey(parts: {
    documentId?: string;
    topic: string;
    engine: MediaEngine;
    version?: number;
}): string {
    const { documentId = "none", topic, engine, version = 1 } = parts;
    return `${documentId}:${topic.toLowerCase().replace(/\s+/g, "_")}:${engine}:v${version}`;
}
