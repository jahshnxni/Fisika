/**
 * app/api/ai/chat/legacy-stream.ts
 * Gemini / Groq fallback streaming for when OPENAI_API_KEY is not set.
 * Tries Gemini first (rotating API keys), then falls back to Groq.
 */

type Message = { role: "user" | "assistant"; content: string };

export async function* streamAI(
    systemPrompt: string,
    messages: Message[]
): AsyncGenerator<string> {
    // ── Try Gemini first ─────────────────────────────────────────────────────
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const history = messages.slice(0, -1).map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
            }));
            const lastMsg = messages[messages.length - 1]?.content || "";
            const chat = ai.chats.create({
                model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
                history,
                config: { systemInstruction: systemPrompt, temperature: 0.7 },
            });
            const stream = await chat.sendMessageStream({ message: lastMsg });
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) yield text;
            }
            return;
        } catch (e: any) {
            console.warn("[legacy-stream] Gemini failed:", e.message?.slice(0, 80));
        }
    }

    // ── Groq fallback ────────────────────────────────────────────────────────
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
        try {
            const Groq = (await import("groq-sdk")).default;
            const groq = new Groq({ apiKey: groqKey });
            const groqMessages = [
                { role: "system" as const, content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ];
            const stream = await groq.chat.completions.create({
                model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
                messages: groqMessages,
                stream: true,
                max_tokens: 3000,
                temperature: 0.7,
            });
            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) yield text;
            }
            return;
        } catch (e: any) {
            console.warn("[legacy-stream] Groq failed:", e.message?.slice(0, 80));
        }
    }

    yield "⚠️ Tidak ada AI provider yang tersedia. Harap konfigurasikan OPENAI_API_KEY, GEMINI_API_KEY, atau GROQ_API_KEY di environment variables.";
}
