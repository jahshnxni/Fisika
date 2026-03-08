"use client";

import { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { ConceptCardVideo } from "@/remotion/compositions/ConceptCardVideo";
import { Sparkles, Loader2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConceptVideoPlayerProps {
    courseId: string;
    topic: string;
}

export default function ConceptVideoPlayer({ courseId, topic }: ConceptVideoPlayerProps) {
    const [status, setStatus] = useState<"idle" | "planning" | "ready" | "error">("idle");
    const [videoData, setVideoData] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;

        async function generateVideo() {
            if (status !== "idle") return;
            setStatus("planning");

            try {
                // Call our existing media/plan endpoint to generate the storyboard!
                const res = await fetch("/api/media/plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        topic,
                        courseId,
                        pedagogicalNeed: "concept_visualization",
                        formulaDensity: 0.1,
                    }),
                });

                if (!res.ok) throw new Error("Gagal merencanakan video");
                const data = await res.json();

                if (!isMounted) return;

                // The media/plan endpoint returns either an imageBrief or generic video info.
                // Since ConceptCardVideo is simple, we can construct its props from the response.
                const props = {
                    title: data.imageBrief?.title || topic,
                    keyPoints: data.imageBrief?.keyPoints || [
                        "Memahami konsep dasar",
                        "Menganalisis pola",
                        "Penerapan dalam soal",
                    ],
                    formula: "",
                    style: "dark_premium",
                };

                setVideoData(props);
                setStatus("ready");
            } catch (err) {
                console.error("Video generation failed:", err);
                if (isMounted) setStatus("error");
            }
        }

        generateVideo();
        return () => { isMounted = false; };
    }, [courseId, topic, status]);

    if (status === "error") return null; // Hide silently on error to not ruin the UX

    return (
        <div className="w-full relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl group">
            <AnimatePresence mode="wait">
                {status !== "ready" ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black p-8 text-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                            <Sparkles className="w-10 h-10 text-accent animate-bounce relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mt-6 mb-2">
                            AI sedang meracik Video Konsep...
                        </h3>
                        <p className="text-slate-400 max-w-sm mx-auto text-sm">
                            Membuat visualisasi khusus untuk materi "{topic}". Ini biasanya memakan waktu beberapa detik.
                        </p>
                        <Loader2 className="w-5 h-5 text-accent animate-spin mt-6" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="player"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="aspect-video w-full relative bg-black"
                    >
                        {/* Live Remotion Player! Generates the video entirely in the browser using React */}
                        <Player
                            component={ConceptCardVideo}
                            durationInFrames={450} // 15 seconds
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
                )}
            </AnimatePresence>
        </div>
    );
}
