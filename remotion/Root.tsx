import { Composition } from "remotion";
import { SolutionExplainer, SolutionExplainerSchema } from "./compositions/SolutionExplainer";
import { ConceptCardVideo, ConceptCardVideoSchema } from "./compositions/ConceptCardVideo";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* Solution step-by-step explainer: 45-120s */}
            <Composition
                id="SolutionExplainer"
                component={SolutionExplainer}
                durationInFrames={900} // 30s @ 30fps — overridden per-render
                fps={30}
                width={1920}
                height={1080}
                schema={SolutionExplainerSchema}
                defaultProps={{
                    topic: "Contoh Topik",
                    targetLevel: "intermediate",
                    goal: "Tujuan video",
                    scenes: [
                        {
                            id: "scene_01",
                            type: "hook",
                            durationSec: 5,
                            objective: "Perkenalan",
                            narration: "Hari ini kita akan belajar...",
                            screenText: ["Target: memahami strategi pemecahan soal"],
                            latex: [],
                            transitionIn: "fade",
                            transitionOut: "fade",
                        },
                    ],
                    commonMistakes: [],
                }}
            />

            {/* Short concept card video: 15-30s */}
            <Composition
                id="ConceptCardVideo"
                component={ConceptCardVideo}
                durationInFrames={450} // 15s @ 30fps
                fps={30}
                width={1920}
                height={1080}
                schema={ConceptCardVideoSchema}
                defaultProps={{
                    title: "Konsep",
                    keyPoints: ["Poin 1", "Poin 2", "Poin 3"],
                    formula: "",
                    style: "dark_premium",
                }}
            />
        </>
    );
};
