"use client";

import { useState } from "react";
import { FileText, Play, Brain, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ConceptVideoPlayer from "@/components/features/ConceptVideoPlayer";
import { useCompletion } from "@ai-sdk/react";

export default function DrillItem({ lesson, spaceId }: { lesson: any, spaceId: string }) {
    const [started, setStarted] = useState(false);

    // Using ai-sdk useCompletion
    const { completion, isLoading, complete } = useCompletion({
        api: "/api/ai/solve",
        body: {
            lessonId: lesson.id,
        }
    });

    const hasSavedWalkthrough = lesson.pdfWalkthrough && lesson.pdfWalkthrough.trim() !== "";
    const activeText = hasSavedWalkthrough ? lesson.pdfWalkthrough : completion;
    const isReady = hasSavedWalkthrough || (!isLoading && started && completion.length > 50);

    const handleStartSolve = () => {
        setStarted(true);
        complete(lesson.contentMdx);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-400" />
                {lesson.title || "Studi Kasus"}
            </h2>

            {/* Raw Question */}
            <div className="mt-4 p-5 bg-black/40 rounded-xl border border-white/5 text-slate-200 leading-relaxed font-medium text-[15px]">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {lesson.contentMdx}
                </ReactMarkdown>
            </div>

            {/* Solve Action / Stream Result */}
            {!hasSavedWalkthrough && !started ? (
                <button
                    onClick={handleStartSolve}
                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                >
                    <Brain className="w-5 h-5" />
                    Bahas Soal Ini dengan AI Tutor
                </button>
            ) : (
                <div className="mt-8 bg-black/20 p-6 rounded-2xl border border-white/5">
                    {/* The Output Stream / Saved Result */}
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            p: ({ children, ...props }: any) => <p className="mb-4 leading-relaxed text-slate-300 text-[15px]" {...props}>{children}</p>,
                            ul: ({ children, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-300 ml-4" {...props}>{children}</ul>,
                            ol: ({ children, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-300 ml-4" {...props}>{children}</ol>,
                            li: ({ children, ...props }: any) => <li className="text-[15px]" {...props}>{children}</li>,
                            strong: ({ children, ...props }: any) => <strong className="text-white font-bold" {...props}>{children}</strong>,
                            h2: ({ children, ...props }: any) => <h2 className="text-xl font-bold text-orange-400 mt-8 mb-4 border-b border-orange-500/20 pb-2 flex items-center gap-2" {...props}>{children}</h2>,
                            h3: ({ children, ...props }: any) => <h3 className="text-lg font-bold text-white mt-6 mb-3" {...props}>{children}</h3>,
                            code: ({ inline, className, children, ...props }: any) => (
                                inline ? <code className="bg-slate-800 text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code> :
                                    <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto my-4 border border-slate-800 shadow-inner text-sm"><code className={className} {...props}>{children}</code></pre>
                            ),
                        }}
                    >
                        {activeText}
                    </ReactMarkdown>

                    {isLoading && (
                        <div className="flex items-center gap-3 text-orange-400 text-sm animate-pulse mt-8 py-3 px-4 bg-orange-500/10 rounded-lg w-fit border border-orange-500/20">
                            <Brain className="w-4 h-4 animate-spin" /> <span>Mengurai logika soal selangkah demi selangkah...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Video Component for the Storyboard */}
            {isReady && (
                <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Play className="w-5 h-5 text-orange-400 fill-orange-400" />
                        Video Pembahasan Interaktif
                    </h3>
                    <ConceptVideoPlayer
                        courseId={spaceId}
                        topic={lesson.title}
                        customStoryboardText={activeText}
                    />
                </div>
            )}
        </div>
    );
}
