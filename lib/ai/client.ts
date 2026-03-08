import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

// ─── Vercel AI SDK provider (for streamText, generateObject, etc.) ────────────
export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Optionally route via Vercel AI Gateway:
    // baseURL: process.env.AI_GATEWAY_BASE_URL,
});

// ─── Raw OpenAI SDK client (for Images API, TTS, Videos/Sora) ────────────────
// Use createRawOpenAIClient() in routes that need the raw SDK (not AI SDK wrapper).
export function createRawOpenAIClient(): OpenAI {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured");
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

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

