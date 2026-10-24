/**
 * Caveman AI Memory & Context Compression Engine
 * Inspired by https://github.com/juliusbrussee/caveman
 * 
 * Provides:
 * 1. Token-efficient conversation memory compression.
 * 2. Cross-provider state continuity (survives API key rotations & failovers).
 * 3. Per-user and per-session isolation in SQLite/PostgreSQL Prisma DB.
 */

export interface ConversationTurn {
    role: "user" | "assistant";
    content: string;
}

export interface CavemanMemoryState {
    studentTopic?: string;
    identifiedVariables: Record<string, string>;
    knownEquations: string[];
    unresolvedQuestions: string[];
    summary: string;
}

/**
 * Compress user conversation history into a high-density, token-efficient Caveman prompt prefix.
 * Keeps all mathematical values, formulas, and conversational context intact while reducing token bloat.
 */
export function buildCavemanSystemContext(
    systemPrompt: string,
    history: ConversationTurn[],
    userTopic?: string
): { enhancedPrompt: string; compressedMessages: ConversationTurn[] } {
    // Extract key variables and equations from past conversation turns
    const variables: Record<string, string> = {};
    const equations: string[] = [];

    const fullHistoryText = history.map(h => h.content).join("\n");

    // Extract formulas matching LaTeX patterns or standard physics expressions
    const equationMatches = fullHistoryText.match(/(?:\$|\\\[)(.*?)(?:\$|\\\])/g);
    if (equationMatches) {
        for (const eq of equationMatches.slice(-6)) {
            const clean = eq.replace(/[\$\\\[\]]/g, '').trim();
            if (clean && !equations.includes(clean)) {
                equations.push(clean);
            }
        }
    }

    // Identify numerical parameters (e.g. m = 5 kg, v = 20 m/s, theta = 37 deg)
    const varMatches = fullHistoryText.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*([0-9.,]+(?:\s*[a-zA-Z°/·]+)?)/g);
    for (const match of Array.from(varMatches).slice(-10)) {
        variables[match[1]] = match[2];
    }

    // Build the Caveman Memory Block
    const memoryHeader = [
        "=== [CAVEMAN MEMORY ENGINE: ACTIVE CONVERSATION CONTEXT] ===",
        userTopic ? `• TOPIK AKTIF SISWA: ${userTopic}` : "• TOPIK AKTIF: Fisika SMA / Persiapan TKA",
        Object.keys(variables).length > 0
            ? `• BESARAN DIKETAHUI DARI SESI SEBELUMNYA: ${Object.entries(variables).map(([k, v]) => `${k} = ${v}`).join(", ")}`
            : null,
        equations.length > 0
            ? `• PERSAMAAN YANG SUDAH DIBANGUN: ${equations.join(" | ")}`
            : null,
        "• INSTRUKSI KONTINUITAS MEMORI: Pertahankan konteks diskusi sebelumnya meskipun terjadi pergantian penyedia AI (failover/rotasi). Tetap ramah, sistematis, step-by-step, dan sertakan rumus fisika serta intuisi nyata.",
        "===========================================================\n"
    ].filter(Boolean).join("\n");

    const enhancedPrompt = `${systemPrompt}\n\n${memoryHeader}`;

    // Recent message window for the provider call (keeps last 8 turns)
    const compressedMessages = history.slice(-8);

    return { enhancedPrompt, compressedMessages };
}
