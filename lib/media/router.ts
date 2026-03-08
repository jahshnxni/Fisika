import type { MasterySignal } from "@/lib/ai/schemas";

// ─── Media Engine Types ───────────────────────────────────────────────────────
export type MediaEngine = "gpt-image" | "remotion" | "manim" | "sora" | "tts";

interface MediaRouterInput {
    outputType: "image" | "video" | "audio";
    formulaDensity?: number;       // 0.0 – 1.0  (proportion of content that is math/latex)
    needsStepByStep?: boolean;     // sequential steps required
    needsPreciseMathTypesetting?: boolean;
    needsCinematicClip?: boolean;  // intro/outro/motivational only
    isVoiceover?: boolean;
}

/**
 * Choose the best media engine for a given output type and content characteristics.
 *
 * Remotion-style explainer  — video, general / mixed content, UI-like.
 * Manim-style math animation — video, formula-heavy, requires LaTeX precision.
 * GPT Image                 — diagrams, concept cards, infographics.
 * Sora                      — cinematic intro/outro only, NOT for solution steps.
 * TTS                       — audio voiceover.
 */
export function chooseMediaEngine(input: MediaRouterInput): MediaEngine {
    const { outputType, formulaDensity = 0, needsPreciseMathTypesetting = false,
        needsCinematicClip = false, isVoiceover = false } = input;

    if (isVoiceover || outputType === "audio") return "tts";
    if (outputType === "image") return "gpt-image";
    // Video path:
    if (needsCinematicClip) return "sora"; // ≤12 s, non-deterministic — intro/outro only
    if (needsPreciseMathTypesetting || formulaDensity > 0.6) return "manim";
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
