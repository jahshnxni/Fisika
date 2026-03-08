/**
 * lib/ai/models.ts
 * Centralized model constants for the OMNITUTOR OS platform.
 * All model references go through here — never hardcode models in routes.
 *
 * Pinning model versions for production stability (blueprint principle #20).
 */

export const MODELS = {
    /**
     * Fast, cheap text model. Used for:
     * - Chat streaming (tutor/QA/practice)
     * - Quiz generation
     * - Mastery signal extraction
     * - Topic extraction from PDF
     */
    text: process.env.OPENAI_MODEL_TEXT || "gpt-4o-mini",

    /**
     * Reasoning model. Used for:
     * - Cognitive error diagnosis
     * - Roadmap planning
     * - Structured storyboard generation
     * - UI patch proposals
     */
    reasoning: process.env.OPENAI_MODEL_REASONING || "gpt-4o-mini",

    /**
     * Image generation. Used for:
     * - Concept cards
     * - Topic map diagrams
     * - Error infographics
     * - Formula visual cards
     */
    image: process.env.OPENAI_MODEL_IMAGE || "dall-e-3",

    /**
     * Text-to-speech. Used for:
     * - Voiceover generation for Remotion/Manim videos
     */
    tts: process.env.OPENAI_MODEL_TTS || "tts-1",

    /**
     * Video (Sora). ONLY for:
     * - Intro clips (≤12s)
     * - Outro clips (≤12s)
     * - Motivational quick clips
     * NEVER for solution steps or deterministic content.
     */
    video: process.env.OPENAI_MODEL_VIDEO || "sora-2",
} as const;

export type ModelKey = keyof typeof MODELS;
