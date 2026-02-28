/**
 * Universal AI Rotator
 * Tries providers in order: Gemini → Groq → OpenAI
 * Each provider supports multiple keys (KEY, KEY_2, KEY_3 ... KEY_10).
 * Uses plain `fetch` for Groq/OpenAI (OpenAI-compatible) — no extra packages needed.
 */

// ─── Models per provider ──────────────────────────────────────────────────────
const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash-lite", "gemini-2.0-flash"];
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
const OPENAI_MODELS = ["gpt-4o-mini", "gpt-3.5-turbo"];

function getKeys(prefix: string): string[] {
    const keys: string[] = [];
    const base = process.env[prefix];
    if (base) keys.push(base);
    for (let i = 2; i <= 10; i++) {
        const k = process.env[`${prefix}_${i}`];
        if (k) keys.push(k);
    }
    return keys;
}

function isQuotaError(e: any): boolean {
    const m = (e?.message || e?.toString() || "").toLowerCase();
    return m.includes("429") || m.includes("quota") || m.includes("resource_exhausted") || m.includes("rate_limit") || m.includes("rate limit");
}

function cleanJson(raw: string): string {
    return raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

// ─── Provider: Gemini ─────────────────────────────────────────────────────────
async function tryGemini(systemPrompt: string, userText: string, temperature: number, jsonMode: boolean): Promise<string | null> {
    const keys = getKeys("GEMINI_API_KEY");
    if (keys.length === 0) return null;

    const { GoogleGenAI } = await import("@google/genai");

    for (const [ki, apiKey] of keys.entries()) {
        for (const model of GEMINI_MODELS) {
            try {
                console.log(`[ai-rotator] Gemini key${ki + 1} model:${model}`);
                const ai = new GoogleGenAI({ apiKey });
                const config: Record<string, any> = { temperature };
                if (jsonMode) config.responseMimeType = "application/json";
                if (systemPrompt) config.systemInstruction = systemPrompt;

                const r = await ai.models.generateContent({
                    model,
                    contents: [{ role: "user" as const, parts: [{ text: userText }] }],
                    config,
                });
                const text = r.text || "";
                if (text.length > 10) { console.log(`[ai-rotator] ✅ Gemini key${ki + 1}/${model}`); return text; }
            } catch (e: any) {
                console.warn(`[ai-rotator] Gemini key${ki + 1}/${model}: ${e.message?.slice(0, 80)}`);
                if (!isQuotaError(e)) break; // non-quota → skip models, try next key
            }
        }
    }
    return null;
}

// ─── Provider: Groq (OpenAI-compatible) ──────────────────────────────────────
async function tryGroq(systemPrompt: string, userText: string, temperature: number, jsonMode: boolean): Promise<string | null> {
    const keys = getKeys("GROQ_API_KEY");
    if (keys.length === 0) return null;

    for (const [ki, apiKey] of keys.entries()) {
        for (const model of GROQ_MODELS) {
            try {
                console.log(`[ai-rotator] Groq key${ki + 1} model:${model}`);
                const messages: any[] = [];
                if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
                messages.push({ role: "user", content: userText });

                const body: any = { model, messages, temperature, max_tokens: 8192 };
                if (jsonMode) body.response_format = { type: "json_object" };

                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(45000),
                });

                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(`HTTP ${res.status}: ${err.slice(0, 100)}`);
                }
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || "";
                if (text.length > 10) { console.log(`[ai-rotator] ✅ Groq key${ki + 1}/${model}`); return text; }
            } catch (e: any) {
                console.warn(`[ai-rotator] Groq key${ki + 1}/${model}: ${e.message?.slice(0, 80)}`);
                if (!isQuotaError(e)) break;
            }
        }
    }
    return null;
}

// ─── Provider: OpenAI (ChatGPT) ───────────────────────────────────────────────
async function tryOpenAI(systemPrompt: string, userText: string, temperature: number, jsonMode: boolean): Promise<string | null> {
    const keys = getKeys("OPENAI_API_KEY");
    if (keys.length === 0) return null;

    for (const [ki, apiKey] of keys.entries()) {
        for (const model of OPENAI_MODELS) {
            try {
                console.log(`[ai-rotator] OpenAI key${ki + 1} model:${model}`);
                const messages: any[] = [];
                if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
                messages.push({ role: "user", content: userText });

                const body: any = { model, messages, temperature, max_tokens: 8192 };
                if (jsonMode) body.response_format = { type: "json_object" };

                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(45000),
                });

                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(`HTTP ${res.status}: ${err.slice(0, 100)}`);
                }
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || "";
                if (text.length > 10) { console.log(`[ai-rotator] ✅ OpenAI key${ki + 1}/${model}`); return text; }
            } catch (e: any) {
                console.warn(`[ai-rotator] OpenAI key${ki + 1}/${model}: ${e.message?.slice(0, 80)}`);
                if (!isQuotaError(e)) break;
            }
        }
    }
    return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface AiCallOptions {
    systemPrompt: string;
    userText: string;
    temperature?: number;
    jsonMode?: boolean;
}

/**
 * Try Gemini → Groq → OpenAI automatically.
 * Throws only if ALL providers/keys fail.
 */
export async function callAiRotated(opts: AiCallOptions): Promise<string> {
    const { systemPrompt, userText, temperature = 0.3, jsonMode = true } = opts;

    const result =
        await tryGemini(systemPrompt, userText, temperature, jsonMode) ??
        await tryGroq(systemPrompt, userText, temperature, jsonMode) ??
        await tryOpenAI(systemPrompt, userText, temperature, jsonMode);

    if (!result) {
        throw new Error(
            "Semua provider AI (Gemini, Groq, OpenAI) quota habis atau tidak dikonfigurasi. " +
            "Tambahkan GEMINI_API_KEY_2, GROQ_API_KEY, atau OPENAI_API_KEY di Vercel env vars."
        );
    }
    return result;
}

// Keep old export name for backward compat with any other files
export const callGeminiRotated = (opts: { systemPrompt: string; userText: string; temperature?: number; jsonMode?: boolean }) =>
    callAiRotated(opts);

/**
 * Upload PDF to Gemini File API (vision). Uses key rotation.
 */
export async function uploadFileToGemini(
    data: Uint8Array,
    mimeType: string,
    displayName: string
): Promise<{ fileUri: string; name: string; apiKey: string }> {
    const keys = getKeys("GEMINI_API_KEY");
    if (keys.length === 0) throw new Error("No Gemini API keys configured for file upload");

    const { GoogleGenAI } = await import("@google/genai");

    for (const [ki, apiKey] of keys.entries()) {
        try {
            console.log(`[gemini-upload] Trying key ${ki + 1}/${keys.length}`);
            const ai = new GoogleGenAI({ apiKey });
            const blob = new Blob([data.buffer as ArrayBuffer], { type: mimeType });
            const result = await ai.files.upload({ file: blob, config: { mimeType, displayName } });
            if (result.uri) return { fileUri: result.uri, name: result.name || "", apiKey };
        } catch (e: any) {
            console.warn(`[gemini-upload] Key ${ki + 1} failed:`, e.message?.slice(0, 80));
        }
    }
    throw new Error("All Gemini keys failed for file upload");
}
