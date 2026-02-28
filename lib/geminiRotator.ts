/**
 * Gemini API Key Rotator
 *
 * Reads GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3, ... from env.
 * Tries each key with each model. On quota/rate-limit error → next key.
 * Returns the AI response text on first success.
 *
 * To add more keys: set GEMINI_API_KEY_4, GEMINI_API_KEY_5, etc. in Vercel.
 */

const MODELS_TO_TRY = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
];

function getApiKeys(): string[] {
    const keys: string[] = [];
    // Primary key (backward compat)
    if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
    // Additional numbered keys: GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...
    for (let i = 2; i <= 10; i++) {
        const k = process.env[`GEMINI_API_KEY_${i}`];
        if (k) keys.push(k);
    }
    return keys;
}

function isQuotaError(e: any): boolean {
    const msg = e?.message || "";
    return msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("rate");
}

export interface GeminiCallOptions {
    systemPrompt: string;
    userText: string;
    temperature?: number;
    jsonMode?: boolean;
}

/**
 * Call Gemini with automatic key + model rotation.
 * Tries every (key × model) combination before giving up.
 */
export async function callGeminiRotated(opts: GeminiCallOptions): Promise<string> {
    const { systemPrompt, userText, temperature = 0.3, jsonMode = true } = opts;
    const keys = getApiKeys();

    if (keys.length === 0) {
        throw new Error("Tidak ada GEMINI_API_KEY yang dikonfigurasi di environment variables.");
    }

    const { GoogleGenAI } = await import("@google/genai");
    const errors: string[] = [];

    for (const [keyIdx, apiKey] of keys.entries()) {
        for (const model of MODELS_TO_TRY) {
            try {
                console.log(`[gemini] Trying key ${keyIdx + 1}/${keys.length} model ${model}`);
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
                if (text.length > 10) {
                    console.log(`[gemini] ✅ Key ${keyIdx + 1} model ${model} → ${text.length} chars`);
                    return text;
                }
                errors.push(`Key${keyIdx + 1}/${model}: empty response`);
            } catch (e: any) {
                const msg = e.message?.slice(0, 100) || "unknown";
                errors.push(`Key${keyIdx + 1}/${model}: ${msg}`);
                console.warn(`[gemini] Key ${keyIdx + 1} model ${model} failed (quota=${isQuotaError(e)}): ${msg}`);
                if (!isQuotaError(e)) {
                    // Non-quota error (bad request, parse error etc.) — skip remaining models for this key
                    // but still try next key
                    break;
                }
                // Quota error → try next model with same key
            }
        }
        // All models on this key exhausted → move to next key
        console.warn(`[gemini] Key ${keyIdx + 1} all models exhausted, trying next key...`);
    }

    throw new Error(
        `Semua API key dan model sudah dicoba namun gagal.\n` +
        `Tambahkan GEMINI_API_KEY_2, GEMINI_API_KEY_3 di Vercel env vars.\n` +
        `Detail: ${errors.slice(-4).join(" | ")}`
    );
}

/**
 * Upload a file to Gemini File API using key rotation.
 * Returns { fileUri, name, ai } for the first key that succeeds.
 */
export async function uploadFileToGemini(
    data: Uint8Array,
    mimeType: string,
    displayName: string
): Promise<{ fileUri: string; name: string; apiKey: string }> {
    const keys = getApiKeys();
    if (keys.length === 0) throw new Error("No Gemini API keys configured");

    const { GoogleGenAI } = await import("@google/genai");

    for (const [keyIdx, apiKey] of keys.entries()) {
        try {
            console.log(`[gemini-upload] Trying key ${keyIdx + 1}/${keys.length}`);
            const ai = new GoogleGenAI({ apiKey });
            const blob = new Blob([data.buffer as ArrayBuffer], { type: mimeType });
            const result = await ai.files.upload({
                file: blob,
                config: { mimeType, displayName }
            });
            if (result.uri) {
                console.log(`[gemini-upload] ✅ Key ${keyIdx + 1} uploaded: ${result.uri}`);
                return { fileUri: result.uri, name: result.name || "", apiKey };
            }
        } catch (e: any) {
            console.warn(`[gemini-upload] Key ${keyIdx + 1} failed:`, e.message?.slice(0, 80));
        }
    }
    throw new Error("Semua API key gagal mengupload file ke Gemini");
}
