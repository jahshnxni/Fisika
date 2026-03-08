/**
 * lib/pdf/chunker.ts
 * PDF text chunker: splits extracted text into typed semantic chunks
 * (heading, paragraph, formula, table, question, diagram-caption).
 *
 * These chunks power:
 * - `getDocumentChunk` AI tool (chat context retrieval)
 * - Document Intelligence layer (blueprint Lapisan 2)
 * - Future vector search / RAG
 */

export type ChunkType = "heading" | "paragraph" | "formula" | "table" | "question" | "diagram";

export interface TextChunk {
    pageFrom: number;
    pageTo: number;
    chunkText: string;
    chunkType: ChunkType;
    metadata: {
        heading?: string;
        formulaCount: number;
        topicHint?: string;
        difficulty?: string;
        wordCount: number;
    };
}

// ─── Regex patterns ───────────────────────────────────────────────────────────
const HEADING_PATTERN = /^(#{1,3}\s|Bab\s+\d+|BAB\s+\d+|[A-Z][A-Z\s]{5,}$)/;
const FORMULA_PATTERN = /[=∫∑∏√±≈≤≥αβγδθλμπρσφωΩ]|\\frac|\\int|\\sum|\\sqrt|\\\[|\\\(|\d+\s*[*/^]\s*\d+/;
const QUESTION_PATTERN = /^(\d+[\.\)]\s|Soal\s+\d+|No\.\s*\d+|[A-Z]\.\s)/;
const TABLE_PATTERN = /(\|.+\||\t.*\t|\s{4,}\S.*\s{4,}\S)/;

// ─── Chunk size limits ────────────────────────────────────────────────────────
const CHUNK_MIN_WORDS = 5;
const CHUNK_MAX_WORDS = 150; // Force a split if a paragraph is too long

// ─── Main chunker ─────────────────────────────────────────────────────────────
/**
 * Split raw PDF text into typed semantic chunks.
 * Simple heuristic chunker — no AI call needed, runs in <50ms for 50-page PDFs.
 */
export function chunkPdfText(rawText: string, pageSize = 3000): TextChunk[] {
    // Split text into rough page approximations (every pageSize chars)
    const pages: string[] = [];
    for (let i = 0; i < rawText.length; i += pageSize) {
        pages.push(rawText.slice(i, i + pageSize));
    }

    const chunks: TextChunk[] = [];
    let lastHeading = "";

    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        const page = pages[pageIdx];
        const lines = page.split(/\n+/).filter(l => l.trim().length > 0);

        let currentChunk: string[] = [];
        let currentType: ChunkType = "paragraph";

        const flushChunk = () => {
            const text = currentChunk.join(" ").trim();
            const words = text.split(/\s+/).filter(Boolean);
            if (words.length < CHUNK_MIN_WORDS) return;

            const formulaMatches = (text.match(FORMULA_PATTERN) || []).length;
            chunks.push({
                pageFrom: pageIdx + 1,
                pageTo: pageIdx + 1,
                chunkText: text,
                chunkType: currentType,
                metadata: {
                    heading: currentType === "heading" ? text : lastHeading || undefined,
                    formulaCount: formulaMatches,
                    topicHint: inferTopicHint(text),
                    wordCount: words.length,
                },
            });
            currentChunk = [];
        };

        for (const line of lines) {
            const trimmed = line.trim();
            const detectedType = detectLineType(trimmed);

            // Type change or large chunk → flush
            if ((detectedType !== currentType && currentChunk.length > 0) ||
                countWords(currentChunk) > CHUNK_MAX_WORDS) {
                flushChunk();
            }

            if (detectedType === "heading") {
                lastHeading = trimmed;
            }

            currentType = detectedType;
            currentChunk.push(trimmed);
        }
        flushChunk();
    }

    return chunks;
}

function detectLineType(line: string): ChunkType {
    if (HEADING_PATTERN.test(line)) return "heading";
    if (QUESTION_PATTERN.test(line)) return "question";
    if (TABLE_PATTERN.test(line)) return "table";
    if (FORMULA_PATTERN.test(line)) {
        const nonMathChars = line.replace(/[^a-zA-Z]/g, "").length;
        if (nonMathChars < line.length * 0.3) return "formula"; // Mostly math
    }
    return "paragraph";
}

function countWords(lines: string[]): number {
    return lines.join(" ").split(/\s+/).filter(Boolean).length;
}

// ─── Topic hint inference (very lightweight) ──────────────────────────────────
const TOPIC_KEYWORDS: Record<string, string[]> = {
    "Fluida Statis": ["tekanan", "hidrostatis", "archimedes", "gaya apung"],
    "Fluida Dinamis": ["bernoulli", "kontinuitas", "debit", "aliran"],
    "Termodinamika": ["kalor", "entropi", "isotermal", "adiabatik", "carnot"],
    "Gelombang": ["frekuensi", "amplitudo", "panjang gelombang", "kecepatan gelombang"],
    "Listrik": ["tegangan", "arus", "hambatan", "kapasitor", "induktor"],
    "Mekanika": ["gaya", "momentum", "energi kinetik", "usaha", "percepatan"],
    "Optik": ["refraksi", "refleksi", "focal", "lensa", "cermin"],
};

export function inferTopicHint(text: string): string | undefined {
    const lower = text.toLowerCase();
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) return topic;
    }
    return undefined;
}

// ─── Chunk retrieval helper ───────────────────────────────────────────────────
/**
 * Find the most relevant chunks for a user query.
 * Simple keyword overlap — no vector search needed for Phase 1.
 */
export function findRelevantChunks(
    chunks: TextChunk[],
    query: string,
    limit = 3
): TextChunk[] {
    const queryWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    return chunks
        .map(chunk => {
            const chunkWords = chunk.chunkText.toLowerCase().split(/\s+/);
            const overlap = chunkWords.filter(w => queryWords.has(w)).length;
            return { chunk, score: overlap };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ chunk }) => chunk);
}
