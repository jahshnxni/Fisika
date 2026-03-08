import type { MasterySignal, WeaknessLabel } from "@/lib/ai/schemas";
import { deriveWeakness } from "@/lib/ai/schemas";

// ─── Mastery state for an entire session ──────────────────────────────────────
export interface MasteryState {
    topicMap: Record<string, MasterySignal>;   // subtopic → signal
    strengths: string[];
    weaknesses: string[];
    repeatedErrors: Array<{ type: string; count: number; subtopic: string; lastSeen: string }>;
    readinessScore: number;
    confidenceCalibration: number;
    independenceLevel: number;
}

// ─── Initial state ────────────────────────────────────────────────────────────
export function createInitialMasteryState(): MasteryState {
    return {
        topicMap: {},
        strengths: [],
        weaknesses: [],
        repeatedErrors: [],
        readinessScore: 0,
        confidenceCalibration: 0,
        independenceLevel: 0,
    };
}

// ─── Update mastery after a user interaction ──────────────────────────────────
/**
 * Update a mastery signal for a subtopic.
 * Uses exponential moving average: new = α * observation + (1-α) * old
 * α = 0.35 — weights recent performance moderately, preserves history.
 */
const ALPHA = 0.35;

export function updateMasterySignal(
    state: MasteryState,
    subtopic: string,
    observation: Partial<Omit<MasterySignal, "subtopic">>
): MasteryState {
    const existing: MasterySignal = state.topicMap[subtopic] ?? {
        subtopic,
        concept: 50, logic: 50, accuracy: 50,
        independence: 50, confidence: 50, speed: 50, stability: 50,
    };

    const updated: MasterySignal = {
        subtopic,
        concept: blend(existing.concept, observation.concept, ALPHA),
        logic: blend(existing.logic, observation.logic, ALPHA),
        accuracy: blend(existing.accuracy, observation.accuracy, ALPHA),
        independence: blend(existing.independence, observation.independence, ALPHA),
        confidence: blend(existing.confidence, observation.confidence, ALPHA),
        speed: blend(existing.speed, observation.speed, ALPHA),
        stability: stabilityUpdate(existing, observation),
    };

    const newTopicMap = { ...state.topicMap, [subtopic]: updated };
    return recomputeAggregates({ ...state, topicMap: newTopicMap });
}

function blend(old: number, next: number | undefined, alpha: number): number {
    if (next === undefined) return old;
    return Math.max(0, Math.min(100, Math.round(alpha * next + (1 - alpha) * old)));
}

/**
 * Stability: penalise oscillation. If new score differs greatly from old, lower stability.
 */
function stabilityUpdate(old: MasterySignal, obs: Partial<Omit<MasterySignal, "subtopic">>): number {
    if (obs.concept === undefined) return old.stability;
    const delta = Math.abs((obs.concept ?? old.concept) - old.concept);
    if (delta > 30) return Math.max(0, old.stability - 15); // Large swing → unstable
    if (delta < 10) return Math.min(100, old.stability + 5); // Consistent → more stable
    return old.stability;
}

// ─── Recompute aggregates from topic map ─────────────────────────────────────
function recomputeAggregates(state: MasteryState): MasteryState {
    const signals = Object.values(state.topicMap);
    if (signals.length === 0) return state;

    // Readiness = mean of all subtopic readiness scores
    const readinessScore = Math.round(
        signals.reduce((sum, s) => sum + deriveWeakness(s).readinessScore, 0) / signals.length
    );

    // Strengths/weaknesses
    const strengths = signals
        .filter(s => s.concept >= 75 && s.logic >= 70 && s.stability >= 60)
        .map(s => s.subtopic);
    const weaknesses = signals
        .filter(s => deriveWeakness(s).needsRemedial)
        .map(s => s.subtopic);

    // Independence level = mean independence
    const independenceLevel = Math.round(
        signals.reduce((sum, s) => sum + s.independence, 0) / signals.length
    );

    // Confidence calibration = agreement between confidence and accuracy
    const calibrationErrors = signals.map(s => Math.abs(s.confidence - s.accuracy));
    const confidenceCalibration = Math.round(
        100 - calibrationErrors.reduce((a, b) => a + b, 0) / calibrationErrors.length
    );

    return { ...state, readinessScore, strengths, weaknesses, independenceLevel, confidenceCalibration };
}

// ─── Register a repeated error ────────────────────────────────────────────────
export function recordError(state: MasteryState, errorType: string, subtopic: string): MasteryState {
    const errors = [...state.repeatedErrors];
    const existing = errors.find(e => e.type === errorType && e.subtopic === subtopic);
    if (existing) {
        existing.count += 1;
        existing.lastSeen = new Date().toISOString();
    } else {
        errors.push({ type: errorType, count: 1, subtopic, lastSeen: new Date().toISOString() });
    }
    return { ...state, repeatedErrors: errors };
}

// ─── Should we advance to next level? ────────────────────────────────────────
/**
 * Blueprint rule: "stability rendah → jangan naik level walau sekali benar"
 */
export function shouldAdvanceLevel(signal: MasterySignal): boolean {
    return (
        signal.concept >= 75 &&
        signal.logic >= 70 &&
        signal.accuracy >= 70 &&
        signal.independence >= 60 &&
        signal.stability >= 60 // Must be stable, not just one-off correct
    );
}

// ─── Hint ladder ──────────────────────────────────────────────────────────────
/**
 * Returns which hint level to offer based on independence score.
 * independence > 70 → no hint, let user try
 * independence 50-70 → offer hint 1 (conceptual direction)
 * independence 30-50 → offer hint 2 (method choice)
 * independence < 30 → offer hint 3 (partial setup)
 */
export function getHintLevel(signal: MasterySignal): 0 | 1 | 2 | 3 {
    if (signal.independence >= 70) return 0;
    if (signal.independence >= 50) return 1;
    if (signal.independence >= 30) return 2;
    return 3;
}

// ─── Serialize/deserialize for DB (stored as JSON strings) ───────────────────
export function serializeState(state: MasteryState): {
    currentTopicMap: string;
    strengths: string;
    weaknesses: string;
    repeatedErrors: string;
    readinessScore: number;
    confidenceCalibration: number;
    independenceLevel: number;
} {
    return {
        currentTopicMap: JSON.stringify(state.topicMap),
        strengths: JSON.stringify(state.strengths),
        weaknesses: JSON.stringify(state.weaknesses),
        repeatedErrors: JSON.stringify(state.repeatedErrors),
        readinessScore: state.readinessScore,
        confidenceCalibration: state.confidenceCalibration,
        independenceLevel: state.independenceLevel,
    };
}

export function deserializeState(db: {
    currentTopicMap: string; strengths: string; weaknesses: string;
    repeatedErrors: string; readinessScore: number;
    confidenceCalibration: number; independenceLevel: number;
}): MasteryState {
    return {
        topicMap: JSON.parse(db.currentTopicMap || "{}"),
        strengths: JSON.parse(db.strengths || "[]"),
        weaknesses: JSON.parse(db.weaknesses || "[]"),
        repeatedErrors: JSON.parse(db.repeatedErrors || "[]"),
        readinessScore: db.readinessScore,
        confidenceCalibration: db.confidenceCalibration,
        independenceLevel: db.independenceLevel,
    };
}
