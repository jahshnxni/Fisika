"use client";

import { useState, useEffect, useCallback } from "react";
import { Player } from "@remotion/player";
import { ConceptCardVideo } from "@/remotion/compositions/ConceptCardVideo";
import { Sparkles, Loader2, Play, RefreshCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConceptVideoPlayerProps {
    courseId: string;
    topic: string;
}

/**
 * Generates video props for ConceptCardVideo purely on the client side.
 * This avoids any dependency on OpenAI API keys or external services.
 * The Remotion Player renders the video entirely in the browser using React.
 */
function generateLocalVideoProps(topic: string) {
    // Smart key points based on topic
    const genericPoints = [
        `Memahami konsep dasar ${topic}`,
        `Menganalisis fenomena ${topic}`,
        `Penerapan ${topic} dalam kehidupan nyata`,
        `Menyelesaikan soal dengan strategi efektif`,
    ];

    return {
        title: topic || "Konsep Fisika",
        keyPoints: genericPoints.slice(0, 4),
        formula: "",
        style: "dark_premium" as const,
    };
}

type VideoStatus = "loading" | "ready" | "error" | "enriching";

export default function ConceptVideoPlayer({ courseId, topic }: ConceptVideoPlayerProps) {
    const [status, setStatus] = useState<VideoStatus>("loading");
    const [videoData, setVideoData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const initVideo = useCallback(() => {
        // STEP 1: Immediately generate local props so the video plays instantly
        const localProps = generateLocalVideoProps(topic);
        setVideoData(localProps);
        setStatus("ready");

        // STEP 2: In the background, try to enrich with AI-generated content (optional, non-blocking)
        fetch("/api/media/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                topic,
                courseId,
                pedagogicalNeed: "concept_visualization",
                formulaDensity: 0.1,
                outputType: "image",
            }),
        })
            .then(res => {
                if (!res.ok) return null; // Silently fail — local props are already showing
                return res.json();
            })
            .then(data => {
                if (!data) return;

                // The API returns { type, engine, data } — extract the brief from data
                const brief = data?.data || data?.imageBrief || data;
                const enrichedProps = {
                    title: brief?.title || localProps.title,
                    keyPoints: brief?.keyPoints || brief?.bulletPoints || localProps.keyPoints,
                    formula: brief?.formula || "",
                    style: "dark_premium" as const,
                };

                // Only update if we got meaningful data
                if (enrichedProps.title && enrichedProps.keyPoints?.length > 0) {
                    setVideoData(enrichedProps);
                }
            })
            .catch(() => {
                // Silently ignore — local video is already playing fine
                console.log("[ConceptVideoPlayer] AI enrichment failed, using local props");
            });
    }, [topic, courseId]);

    useEffect(() => {
        initVideo();
    }, [initVideo]);

    if (status === "error") {
        return (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-red-500/20 bg-red-950/20 flex flex-col items-center justify-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-red-300 text-sm">{errorMsg || "Gagal memuat video"}</p>
                <button
                    onClick={() => { setStatus("loading"); initVideo(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5" /> Coba Lagi
                </button>
            </div>
        );
    }

    if (status === "loading" || !videoData) {
        return (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                    <Sparkles className="w-10 h-10 text-violet-400 animate-bounce relative z-10" />
                </div>
                <h3 className="text-lg font-bold text-white mt-4 mb-1">Mempersiapkan Video...</h3>
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin mt-3" />
            </div>
        );
    }

    return (
        <div className="w-full relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl group">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="aspect-video w-full relative bg-black"
            >
                {/* Live Remotion Player — renders entirely in the browser using React */}
                <Player
                    component={ConceptCardVideo}
                    durationInFrames={450}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{ width: "100%", height: "100%" }}
                    controls
                    autoPlay
                    loop
                    inputProps={videoData}
                />

                {/* Overlay label */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs font-bold text-white tracking-wide uppercase">AI Concept Video</span>
                </div>
            </motion.div>
        </div>
    );
}
