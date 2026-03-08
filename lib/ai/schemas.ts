import { z } from "zod";

// ─── Scene Schema — matches blueprint exactly ─────────────────────────────────
export const SceneSchema = z.object({
    id: z.string(),
    type: z.enum([
        "hook", "question", "given", "target",
        "concept", "why-method",
        "step", "verification",
        "mistake", "quiz", "outro",
    ]),
    durationSec: z.number().min(2).max(30),
    objective: z.string(),
    narration: z.string(),
    screenText: z.array(z.string()),
    latex: z.array(z.string()).default([]),
    transitionIn: z.string().default("fade"),
    transitionOut: z.string().default("fade"),
    focusCue: z.string().optional(),
});
export type Scene = z.infer<typeof SceneSchema>;

// ─── Video Storyboard Schema — voiceover/subtitles at TOP LEVEL ───────────────
export const VideoStoryboardSchema = z.object({
    videoType: z.enum(["solution_explainer", "concept_explainer", "weakness_recap"]),
    enginePreference: z.enum(["remotion", "manim", "sora"]),
    topic: z.string(),
    targetLevel: z.enum(["beginner", "intermediate", "advanced"]),
    durationSec: z.number().min(15).max(240),
    goal: z.string(),
    voiceover: z.boolean().default(true),
    subtitles: z.boolean().default(true),
    scenes: z.array(SceneSchema).min(3),
    commonMistakes: z.array(z.string()).default([]),
    microQuiz: z.object({
        question: z.string(),
        choices: z.array(z.string()).min(2),
        answerIndex: z.number(),
    }).optional(),
});
export type VideoStoryboard = z.infer<typeof VideoStoryboardSchema>;

// ─── Image Brief Schema ───────────────────────────────────────────────────────
export const ImageBriefSchema = z.object({
    imageType: z.enum(["concept_card", "diagram", "topic_map", "error_infographic", "formula_card", "thumbnail"]),
    topic: z.string(),
    title: z.string(),
    keyPoints: z.array(z.string()).max(8),
    style: z.enum(["clean_minimal", "dark_premium", "educational_colorful"]).default("dark_premium"),
    includeFormula: z.string().optional(),
    prompt: z.string(),
});
export type ImageBrief = z.infer<typeof ImageBriefSchema>;

// ─── Quiz Item Schema ─────────────────────────────────────────────────────────
export const QuizItemSchema = z.object({
    id: z.string(),
    level: z.enum(["EASY", "MEDIUM", "HARD", "EXTREME"]),
    topic: z.string(),
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().min(0).max(3),
    explanation: z.string(),
    errorDiagnosis: z.record(z.string(), z.string()).optional(),
    hint1: z.string().optional(),
    hint2: z.string().optional(),
    hint3: z.string().optional(),
});
export type QuizItem = z.infer<typeof QuizItemSchema>;

// ─── Mastery Signal Schema ────────────────────────────────────────────────────
export const MasterySignalSchema = z.object({
    subtopic: z.string(),
    concept: z.number().min(0).max(100),
    logic: z.number().min(0).max(100),
    accuracy: z.number().min(0).max(100),
    independence: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    speed: z.number().min(0).max(100),
    stability: z.number().min(0).max(100),
});
export type MasterySignal = z.infer<typeof MasterySignalSchema>;

// ─── Derived Mastery Fields ───────────────────────────────────────────────────
export type WeaknessLabel = "concept" | "logic" | "interpretation" | "calculation" | "notation" | "strategy";

export function deriveWeakness(signal: MasterySignal): {
    label: WeaknessLabel;
    needsMedia: "image" | "video" | "none";
    needsRemedial: boolean;
    readinessScore: number;
} {
    // Readiness = weighted average of key signals
    const readinessScore = Math.round(
        signal.concept * 0.25 + signal.logic * 0.20 + signal.accuracy * 0.20 +
        signal.independence * 0.20 + signal.stability * 0.15
    );

    let label: WeaknessLabel = "concept";
    if (signal.concept < 60) label = "concept";
    else if (signal.logic < 60) label = "logic";
    else if (signal.accuracy < 60) label = "calculation";
    else if (signal.independence < 50) label = "strategy";
    else if (signal.stability < 50) label = "concept"; // unstable → reteach

    return {
        label,
        needsMedia: signal.concept < 60 ? "video" : signal.logic < 70 ? "image" : "none",
        needsRemedial: readinessScore < 65 || signal.stability < 50,
        readinessScore,
    };
}

// ─── UI Patch Proposal Schema ─────────────────────────────────────────────────
export const UiPatchProposalSchema = z.object({
    area: z.enum(["chat", "lesson", "media-panel", "quiz-panel", "dashboard"]),
    diagnosis: z.string(),
    goal: z.string(),
    patchSummary: z.string(),
    implementationPlan: z.array(z.string()),
    pedagogicalReason: z.string(),
    riskLevel: z.enum(["low", "medium", "high"]),
    rollbackPlan: z.string(),
    successMetrics: z.array(z.string()),
});
export type UiPatchProposal = z.infer<typeof UiPatchProposalSchema>;

// ─── Generate Quiz Tool Output ────────────────────────────────────────────────
export const GenerateQuizOutputSchema = z.object({
    questions: z.array(QuizItemSchema).min(1).max(5),
    topicCovered: z.string(),
    recommendedAfterScore: z.number().min(0).max(100),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

// ─── Media Proposal (tool output) ─────────────────────────────────────────────
export const ProposeMediaOutputSchema = z.object({
    shouldGenerate: z.boolean(),
    outputType: z.enum(["image", "video"]).optional(),
    engine: z.enum(["gpt-image", "remotion", "manim", "sora", "tts"]).optional(),
    pedagogicalReason: z.string(),
    topic: z.string(),
    imageBrief: ImageBriefSchema.optional(),
    storyboardOutline: z.string().optional(),
});
export type ProposeMediaOutput = z.infer<typeof ProposeMediaOutputSchema>;

// ─── Media Job Schema ─────────────────────────────────────────────────────────
export const MediaJobSchema = z.object({
    id: z.string(),
    sessionId: z.string(),
    sourceType: z.enum(["concept", "question", "weakness", "recap"]),
    mediaType: z.enum(["image", "video", "audio"]),
    engine: z.enum(["gpt-image", "remotion", "manim", "sora", "tts"]),
    inputJson: z.record(z.string(), z.unknown()),
    status: z.enum(["queued", "running", "completed", "failed", "retryable_failed"]),
    outputUrl: z.string().optional(),
    dedupeKey: z.string().optional(),
});
export type MediaJob = z.infer<typeof MediaJobSchema>;
