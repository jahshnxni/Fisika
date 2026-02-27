/**
 * Local regex-based document type detector.
 * Zero AI calls — instant, no timeout risk on Vercel.
 */
export type DocType = "questions_only" | "theory" | "mixed";

export function detectDocType(text: string): DocType {
    const t = text.toLowerCase();

    // Count question patterns
    const soalPattern = (t.match(/\bsoal\s*\d+\b/g) || []).length;
    const numberedPattern = (t.match(/\n\s*\d{1,3}\s*\./g) || []).length;
    const totalQuestionSignals = soalPattern + numberedPattern;

    // Detect answer options (A. B. C. D. or (A)(B)(C) etc.)
    const hasOptions = /(\b[a-eA-E][.)]\s|\([a-eA-E]\)\s)/.test(text);

    // Detect theory markers
    const hasTheory = /(definisi|teorema|pembuktian|contoh\s+soal|materi|ringkasan|bab\s+\d|pengertian|pendahuluan)/i.test(text);

    // Detect exam/quiz headers
    const hasExamHeader = /(ujian|ulangan|soal|kuis|latihan|olimpiade|utbk|osn|sbmptn|pilihan\s+ganda|bagian\s+[abc])/i.test(text);

    if ((totalQuestionSignals >= 5 || (totalQuestionSignals >= 2 && hasOptions)) && hasExamHeader) {
        return "questions_only";
    }

    if (hasTheory && totalQuestionSignals < 3) {
        return "theory";
    }

    if (hasTheory && totalQuestionSignals >= 3) {
        return "mixed";
    }

    // Default: if has numbered items and options, it's likely questions
    if (numberedPattern >= 5 && hasOptions) return "questions_only";

    return "theory";
}

/**
 * Detect likely subject from text using keyword matching.
 */
export function detectSubject(text: string): string {
    const t = text.toLowerCase();
    if (/(informatika|algoritm|pemrograman|coding|komputer|graph|tree|searching|sorting)/i.test(t)) return "Informatika";
    if (/(fisika|gerak|gaya|energi|momentum|fluida|termodinamika|optik|listrik|magnet)/i.test(t)) return "Fisika";
    if (/(kimiawi|reaksi|unsur|senyawa|mol|atom|elektron|asam|basa|larutan)/i.test(t)) return "Kimia";
    if (/(biologi|sel|jaringan|organisme|ekosistem|genetika|dna|evolusi)/i.test(t)) return "Biologi";
    if (/(matematika|integral|diferensial|matriks|vektor|logaritma|trigonometri|limit|fungsi)/i.test(t)) return "Matematika";
    if (/(sejarah|peristiwa|kerajaan|nasional|kolonial|perjanjian)/i.test(t)) return "Sejarah";
    if (/(ekonomi|pasar|permintaan|penawaran|inflasi|fiskal|moneter)/i.test(t)) return "Ekonomi";
    return "";
}

/**
 * Segment text into individual questions.
 * Works for "Soal 1", "1.", "1)" patterns.
 */
export function segmentQuestions(text: string): string[] {
    const cleaned = text.replace(/\r/g, "");

    // Try "Soal X" split first
    let parts = cleaned.split(/(?=\bSoal\s+\d+\b)/i);

    // Fallback: numbered list "1." or "1)"
    if (parts.length <= 2) {
        parts = cleaned.split(/(?=\n\s*\d{1,3}[.)]\s)/);
    }

    return parts
        .map(s => s.trim())
        .filter(s => s.length > 60) // remove noise/headers
        .slice(0, 100); // safety cap
}
