import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { z } from "zod";

export const ConceptCardVideoSchema = z.object({
    title: z.string(),
    keyPoints: z.array(z.string()).max(6),
    formula: z.string().optional(),
    style: z.enum(["dark_premium", "clean_minimal", "educational_colorful"]).default("dark_premium"),
});
type Props = z.infer<typeof ConceptCardVideoSchema>;

const PALETTE = {
    dark_premium: { bg: "#0D1117", surface: "#161B22", accent: "#58A6FF", text: "#E6EDF3", muted: "#8B949E" },
    clean_minimal: { bg: "#FFFFFF", surface: "#F6F8FA", accent: "#0969DA", text: "#24292F", muted: "#57606A" },
    educational_colorful: { bg: "#1E1B4B", surface: "#312E81", accent: "#A78BFA", text: "#EDE9FE", muted: "#C4B5FD" },
};

export const ConceptCardVideo: React.FC<Props> = ({ title, keyPoints, formula, style }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const colors = PALETTE[style || "dark_premium"];

    const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const titleY = interpolate(frame, [0, 15], [-30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const dividerScale = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", padding: 100 }}>
            {/* Title */}
            <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 32 }}>
                <div style={{ color: colors.accent, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
                    📚 KONSEP
                </div>
                <div style={{ color: colors.text, fontSize: 80, fontWeight: 800, lineHeight: 1.2 }}>
                    {title}
                </div>
            </div>

            {/* Divider */}
            <div style={{ width: `${dividerScale * 100}px`, height: 4, backgroundColor: colors.accent, borderRadius: 2, marginBottom: 48, transition: "width 0.3s" }} />

            {/* Formula */}
            {formula && (
                <Sequence from={30} durationInFrames={9999}>
                    <div style={{ backgroundColor: colors.surface, border: `2px solid ${colors.accent}`, borderRadius: 12, padding: "20px 32px", marginBottom: 40, color: colors.accent, fontSize: 56, fontFamily: "monospace", letterSpacing: 1 }}>
                        {formula}
                    </div>
                </Sequence>
            )}

            {/* Key Points */}
            {keyPoints.map((point, i) => {
                const startFrame = 35 + i * 12;
                const pointOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const pointX = interpolate(frame, [startFrame, startFrame + 10], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
                return (
                    <div key={i} style={{ opacity: pointOpacity, transform: `translateX(${pointX}px)`, display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colors.accent, marginTop: 16, marginRight: 20, flexShrink: 0 }} />
                        <div style={{ color: colors.muted, fontSize: 40, lineHeight: 1.6 }}>{point}</div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
