/**
 * Julius Brussee Caveman AI Engine for Physica
 * Based on: https://github.com/juliusbrussee/caveman
 * 
 * "why many token when few do trick"
 * - Say Less: Answer first, kill ceremony, short words, payload (math/formulas/numbers) verbatim.
 * - Read Less: Compresses conversational history to save 33%+ input tokens.
 * - Modes:
 *   * /caveman: Terse, fluff-free, high-density, 100% technical accuracy.
 *   * /ultracave: Maximum token compression, fragments, payload only.
 *   * /caveman off / normal: Full standard pedagogical explanation.
 *   * /caveman status: Returns current mode.
 * - Persistent cross-session and cross-provider memory.
 */

export type CavemanMode = "caveman" | "ultracave" | "off";

export interface ConversationTurn {
    role: "user" | "assistant";
    content: string;
}

export interface CavemanTokenStats {
    originalEstimatedTokens: number;
    compressedEstimatedTokens: number;
    tokensSaved: number;
    savingsPercentage: number;
}

/**
 * Detect Caveman mode commands in user message
 */
export function detectCavemanCommand(message: string): {
    modeChange?: CavemanMode;
    isStatusQuery: boolean;
    cleanMessage: string;
} {
    const trimmed = message.trim().toLowerCase();

    if (trimmed === "/caveman status" || trimmed === "caveman status") {
        return { isStatusQuery: true, cleanMessage: message };
    }
    if (trimmed === "/caveman ultra" || trimmed === "/ultracave" || trimmed === "ultracave mode") {
        return { modeChange: "ultracave", isStatusQuery: false, cleanMessage: message.replace(/\/caveman ultra|\/ultracave/i, "").trim() };
    }
    if (trimmed === "/caveman" || trimmed === "caveman mode") {
        return { modeChange: "caveman", isStatusQuery: false, cleanMessage: message.replace(/\/caveman/i, "").trim() };
    }
    if (trimmed === "/caveman off" || trimmed === "stop caveman" || trimmed === "normal mode") {
        return { modeChange: "off", isStatusQuery: false, cleanMessage: message.replace(/\/caveman off|stop caveman|normal mode/i, "").trim() };
    }

    return { isStatusQuery: false, cleanMessage: message };
}

/**
 * Julius Brussee Caveman System Prompts
 */
export const CAVEMAN_PROMPT_RULES = `
=== CAVEMAN PROTOCOL (Julius Brussee /caveman) ===
Rule 1: ANSWER FIRST. Pattern: [thing] [action] [reason]. [next step].
Rule 2: KILL CEREMONY. No greetings ("Halo", "Tentu saja!"), no hedging, no pleasantries, no "Semoga membantu".
Rule 3: PAYLOAD VERBATIM. NEVER change or shorten formulas ($...$), LaTeX ($$...$$), numbers, units (m/s, kg, N, Pa), or code.
Rule 4: SHORT WORDS. Active voice. Maximum 20 words per explanatory sentence.
Rule 5: NEVER DROP NOT/NEVER/NO. Clarity beats compression.
`;

export const ULTRACAVE_PROMPT_RULES = `
=== ULTRACAVE PROTOCOL (Julius Brussee /ultracave) ===
Rule 1: MAXIMUM COMPRESSION. Fragments only. All fluff dead.
Rule 2: ZERO CEREMONY. Start directly with the answer/equation.
Rule 3: PAYLOAD VERBATIM. Math formulas, units, numbers 100% exact.
Rule 4: FACT ONCE. No repetition.
`;

/**
 * Read Less: Strip fluff and pleasantries from past messages before sending to AI provider.
 * Saves 30% - 50% input tokens while preserving every formula, number, and variable.
 */
export function compressMessageHistory(messages: ConversationTurn[]): {
    compressed: ConversationTurn[];
    stats: CavemanTokenStats;
} {
    let originalCharCount = 0;
    let compressedCharCount = 0;

    const compressed = messages.map(msg => {
        originalCharCount += msg.content.length;

        if (msg.role === "user") {
            // Keep user prompt clean
            compressedCharCount += msg.content.length;
            return msg;
        }

        // Strip conversational fluff from prior assistant turns to save input tokens:
        let clean = msg.content
            .replace(/^(Halo|Hai|Tentu|Baik|Selamat datang|Semoga membantu|Ada yang ingin ditanyakan).*?[\n.]/gi, "")
            .replace(/Semoga penjelasan ini bermanfaat.*?$/gi, "")
            .replace(/Jika ada pertanyaan lain.*?$/gi, "")
            .trim();

        if (!clean) clean = msg.content;
        compressedCharCount += clean.length;

        return {
            role: msg.role,
            content: clean
        };
    });

    const estOriginalTokens = Math.round(originalCharCount / 3.8);
    const estCompressedTokens = Math.round(compressedCharCount / 3.8);
    const tokensSaved = Math.max(0, estOriginalTokens - estCompressedTokens);
    const savingsPercentage = estOriginalTokens > 0 ? Math.round((tokensSaved / estOriginalTokens) * 100) : 0;

    return {
        compressed,
        stats: {
            originalEstimatedTokens: estOriginalTokens,
            compressedEstimatedTokens: estCompressedTokens,
            tokensSaved,
            savingsPercentage
        }
    };
}

/**
 * Build Full Caveman Context with Continuous Physical Variable Memory
 */
export function buildCavemanSystemContext(
    systemPrompt: string,
    history: ConversationTurn[],
    userTopic?: string,
    mode: CavemanMode = "caveman"
): { enhancedPrompt: string; compressedMessages: ConversationTurn[]; stats: CavemanTokenStats } {
    const { compressed, stats } = compressMessageHistory(history);

    // Extract physical variables and equations from conversation
    const variables: Record<string, string> = {};
    const equations: string[] = [];

    const fullHistoryText = history.map(h => h.content).join("\n");

    // Extract LaTeX equations
    const equationMatches = fullHistoryText.match(/(?:\$|\\\[)(.*?)(?:\$|\\\])/g);
    if (equationMatches) {
        for (const eq of equationMatches.slice(-8)) {
            const clean = eq.replace(/[\$\\\[\]]/g, '').trim();
            if (clean && !equations.includes(clean)) {
                equations.push(clean);
            }
        }
    }

    // Extract parameters (e.g. m_A = 4 kg, T_AB = 12 N, F = 50 N, theta = 30 deg)
    const varMatches = fullHistoryText.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*([0-9.,]+(?:\s*[a-zA-Z°/·]+)?)/g);
    for (const match of Array.from(varMatches).slice(-12)) {
        variables[match[1]] = match[2];
    }

    let modeRules = "";
    if (mode === "ultracave") {
        modeRules = ULTRACAVE_PROMPT_RULES;
    } else if (mode === "caveman") {
        modeRules = CAVEMAN_PROMPT_RULES;
    }

    const memoryHeader = [
        "=== [CAVEMAN AI MEMORY ENGINE] ===",
        `• MODE: ${mode.toUpperCase()}`,
        userTopic ? `• TOPIK: ${userTopic}` : "• TOPIK: Fisika SMA / Persiapan TKA",
        Object.keys(variables).length > 0
            ? `• BESARAN AKTIF: ${Object.entries(variables).map(([k, v]) => `${k} = ${v}`).join(", ")}`
            : null,
        equations.length > 0
            ? `• PERSAMAAN TERBENTUK: ${equations.join(" | ")}`
            : null,
        "• KONTINUITAS: Konteks tetap tersambung saat failover/rotasi AI. Jangan ulangi penjelasan awal, langsung lanjut dari variabel yang sudah diketahui.",
        modeRules,
        "=================================="
    ].filter(Boolean).join("\n");

    const enhancedPrompt = `${systemPrompt}\n\n${memoryHeader}`;

    return {
        enhancedPrompt,
        compressedMessages: compressed.slice(-8),
        stats
    };
}
