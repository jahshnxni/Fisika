import {
    AbsoluteFill,
    Sequence,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    Easing,
    spring,
} from "remotion";
import { z } from "zod";
import { SceneSchema } from "@/lib/ai/schemas";

// ─── Props Schema ──────────────────────────────────────────────────────────────
export const SolutionExplainerSchema = z.object({
    topic: z.string(),
    targetLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
    goal: z.string(),
    scenes: z.array(SceneSchema),
    commonMistakes: z.array(z.string()).default([]),
});
type Props = z.infer<typeof SolutionExplainerSchema>;

// ─── Style Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
    bg: "#0D1117",
    surface: "#161B22",
    border: "#30363D",
    accent: "#58A6FF",
    accentGlow: "#1F6FEB",
    warning: "#F0883E",
    success: "#3FB950",
    text: "#E6EDF3",
    muted: "#8B949E",
    formula: "#79C0FF",
};

const FONT = {
    heading: 72,
    body: 40,
    caption: 28,
    formula: 52,
};

// ─── Fade helper ──────────────────────────────────────────────────────────────
function useFadeIn(frame: number, delay = 0, duration = 20) {
    return interpolate(frame, [delay, delay + duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
    });
}

// ─── Scene Components ─────────────────────────────────────────────────────────

const SceneHook: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 5);
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1C2333 100%)`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 80 }}>
            <div style={{ opacity, textAlign: "center" }}>
                <div style={{ color: COLORS.accent, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", marginBottom: 24, fontWeight: 600 }}>
                    🎯 TARGET SESI
                </div>
                <div style={{ color: COLORS.text, fontSize: FONT.heading, fontWeight: 700, lineHeight: 1.2, marginBottom: 32 }}>
                    {scene.screenText[0]}
                </div>
                {scene.screenText.slice(1).map((t, i) => (
                    <div key={i} style={{ color: COLORS.muted, fontSize: FONT.body, marginTop: 12 }}>{t}</div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const SceneStep: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number; stepNum?: number }> = ({ scene, frame, stepNum }) => {
    const opacity = useFadeIn(frame, 3);
    const slideY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ opacity, transform: `translateY(${slideY}px)` }}>
                {stepNum !== undefined && (
                    <div style={{ backgroundColor: COLORS.accentGlow, color: "#fff", fontSize: 20, fontWeight: 700, padding: "8px 20px", borderRadius: 6, display: "inline-block", marginBottom: 24, letterSpacing: 2 }}>
                        LANGKAH {stepNum}
                    </div>
                )}
                <div style={{ color: COLORS.text, fontSize: FONT.body + 4, fontWeight: 600, lineHeight: 1.5, marginBottom: 32 }}>
                    {scene.screenText[0]}
                </div>
                {scene.latex?.map((l, i) => (
                    <div key={i} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 32px", marginBottom: 20, color: COLORS.formula, fontSize: FONT.formula, fontFamily: "monospace", letterSpacing: 1 }}>
                        {l}
                    </div>
                ))}
                {scene.screenText.slice(1).map((t, i) => (
                    <div key={i} style={{ color: COLORS.muted, fontSize: FONT.body - 4, marginTop: 12, lineHeight: 1.6 }}>{t}</div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const SceneConcept: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 5);
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ opacity }}>
                <div style={{ color: COLORS.success, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>📚 KONSEP KUNCI</div>
                <div style={{ color: COLORS.text, fontSize: FONT.heading - 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 36 }}>
                    {scene.screenText[0]}
                </div>
                <div style={{ width: 80, height: 4, backgroundColor: COLORS.accent, borderRadius: 2, marginBottom: 36 }} />
                {scene.screenText.slice(1).map((t, i) => (
                    <div key={i} style={{ color: COLORS.muted, fontSize: FONT.body, lineHeight: 1.7, marginBottom: 8 }}>• {t}</div>
                ))}
                {scene.latex?.map((l, i) => (
                    <div key={i} style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.accent}`, borderRadius: 12, padding: "16px 28px", marginTop: 24, color: COLORS.formula, fontSize: FONT.formula, fontFamily: "monospace" }}>
                        {l}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const SceneMistake: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 3);
    return (
        <AbsoluteFill style={{ backgroundColor: "#1A0D00", padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ opacity }}>
                <div style={{ color: COLORS.warning, fontSize: 28, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24, fontWeight: 700 }}>⚠️ KESALAHAN UMUM</div>
                {scene.screenText.map((t, i) => (
                    <div key={i} style={{ backgroundColor: "rgba(240,136,62,0.1)", border: `1px solid ${COLORS.warning}`, borderRadius: 10, padding: "16px 24px", marginBottom: 16, color: COLORS.text, fontSize: FONT.body, lineHeight: 1.6 }}>
                        ❌ {t}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const SceneVerification: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 3);
    return (
        <AbsoluteFill style={{ backgroundColor: "#0D1A12", padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ opacity }}>
                <div style={{ color: COLORS.success, fontSize: 28, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24, fontWeight: 700 }}>✅ VERIFIKASI HASIL</div>
                {scene.screenText.map((t, i) => (
                    <div key={i} style={{ color: COLORS.text, fontSize: FONT.body, lineHeight: 1.7, marginBottom: 10 }}>{t}</div>
                ))}
                {scene.latex?.map((l, i) => (
                    <div key={i} style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.success}`, borderRadius: 12, padding: "16px 28px", marginTop: 20, color: COLORS.success, fontSize: FONT.formula - 4, fontFamily: "monospace" }}>
                        {l}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

const SceneQuiz: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 5);
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1C1040 100%)`, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ opacity }}>
                <div style={{ color: COLORS.accent, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>🧠 MINI LATIHAN</div>
                <div style={{ color: COLORS.text, fontSize: FONT.body + 8, fontWeight: 600, lineHeight: 1.5 }}>
                    {scene.screenText[0]}
                </div>
                <div style={{ color: COLORS.muted, fontSize: FONT.caption + 4, marginTop: 32 }}>Pause dan coba kerjakan dulu!</div>
            </div>
        </AbsoluteFill>
    );
};

// ─── Generic fallback ─────────────────────────────────────────────────────────
const SceneGeneric: React.FC<{ scene: z.infer<typeof SceneSchema>; frame: number }> = ({ scene, frame }) => {
    const opacity = useFadeIn(frame, 3);
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ opacity }}>
                {scene.screenText.map((t, i) => (
                    <div key={i} style={{ color: i === 0 ? COLORS.text : COLORS.muted, fontSize: i === 0 ? FONT.body + 8 : FONT.body, marginBottom: 16, lineHeight: 1.6 }}>{t}</div>
                ))}
                {scene.latex?.map((l, i) => (
                    <div key={i} style={{ backgroundColor: COLORS.surface, borderRadius: 8, padding: "14px 24px", marginTop: 16, color: COLORS.formula, fontSize: FONT.formula - 4, fontFamily: "monospace" }}>{l}</div>
                ))}
            </div>
        </AbsoluteFill>
    );
};

// ─── Scene router ─────────────────────────────────────────────────────────────
function renderScene(scene: z.infer<typeof SceneSchema>, frame: number, stepNum?: number) {
    switch (scene.type) {
        case "hook": return <SceneHook scene={scene} frame={frame} />;
        case "step": return <SceneStep scene={scene} frame={frame} stepNum={stepNum} />;
        case "concept":
        case "why-method": return <SceneConcept scene={scene} frame={frame} />;
        case "mistake": return <SceneMistake scene={scene} frame={frame} />;
        case "verification": return <SceneVerification scene={scene} frame={frame} />;
        case "quiz": return <SceneQuiz scene={scene} frame={frame} />;
        default: return <SceneGeneric scene={scene} frame={frame} />;
    }
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ progress: number; topic: string }> = ({ progress, topic }) => (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: COLORS.surface, zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: COLORS.accent, transition: "width 0.3s" }} />
        <div style={{ position: "absolute", top: 8, right: 24, color: COLORS.muted, fontSize: 18, fontFamily: "system-ui" }}>{topic}</div>
    </div>
);

// ─── Main Composition ─────────────────────────────────────────────────────────
export const SolutionExplainer: React.FC<Props> = ({ scenes, topic, targetLevel, goal }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const FPS = fps;

    // Calculate cumulative start frames
    const sceneFrames: number[] = [];
    let cumulative = 0;
    for (const s of scenes) {
        sceneFrames.push(cumulative);
        cumulative += Math.round(s.durationSec * FPS);
    }

    const totalFrames = cumulative;
    const progress = frame / totalFrames;

    let stepCounter = 0;

    return (
        <AbsoluteFill style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", backgroundColor: COLORS.bg }}>
            <ProgressBar progress={progress} topic={topic} />
            {scenes.map((scene, i) => {
                const from = sceneFrames[i];
                const dur = Math.round(scene.durationSec * FPS);
                const localFrame = frame - from;
                const isStep = scene.type === "step";
                if (isStep) stepCounter++;
                const sNum = isStep ? stepCounter : undefined;

                return (
                    <Sequence key={scene.id} from={from} durationInFrames={dur}>
                        {renderScene(scene, localFrame, sNum)}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
