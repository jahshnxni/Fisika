import { createOpenAI } from "@ai-sdk/openai";

// ─── OpenAI client via Vercel AI SDK ─────────────────────────────────────────
// Falls back to OPENAI_API_KEY if model-specific env vars are not set.

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Optionally route via Vercel AI Gateway:
    // baseURL: process.env.AI_GATEWAY_BASE_URL,
});

// Model aliases — set these in Vercel Environment Variables
export const MODELS = {
    /** Fast, cheap: used for chat, quiz, roadmap, structured extraction */
    text: process.env.OPENAI_MODEL_TEXT || "gpt-4o-mini",
    /** Reasoning: used for diagnosis, evaluation, complex analysis */
    reasoning: process.env.OPENAI_MODEL_REASONING || "gpt-4o-mini",
    /** Image generation: concept cards, diagrams */
    image: process.env.OPENAI_MODEL_IMAGE || "dall-e-3",
    /** Text-to-speech: voiceover */
    tts: process.env.OPENAI_MODEL_TTS || "tts-1",
    /** Video (Sora): intro/outro only */
    video: process.env.OPENAI_MODEL_VIDEO || "sora-2",
} as const;
