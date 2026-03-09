"use client";

import React, { useRef, useEffect, use } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, BookOpen, Layers, CheckCircle, Video, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useChat } from "@ai-sdk/react";
import ConceptVideoPlayer from "@/components/features/ConceptVideoPlayer";

const mdComponents = {
    p: ({ children, ...props }: any) => <p className="mb-3 leading-relaxed text-slate-200 text-[15px]" {...props}>{children}</p>,
    ul: ({ children, ...props }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-200 ml-2" {...props}>{children}</ul>,
    ol: ({ children, ...props }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-200 ml-2" {...props}>{children}</ol>,
    li: ({ children, ...props }: any) => <li className="text-[15px]" {...props}>{children}</li>,
    strong: ({ children, ...props }: any) => <strong className="text-white font-bold" {...props}>{children}</strong>,
    code: ({ inline, className, children, ...props }: any) => (
        inline ? <code className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code> :
            <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700 text-xs"><code className={className} {...props}>{children}</code></pre>
    ),
};

export default function SpaceChatPage({
    params
}: {
    params: Promise<{ spaceId: string }>
}) {
    const resolvedParams = use(params);
    const spaceId = resolvedParams.spaceId;
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/ai/chat",
        body: {
            mode: "QA",
            topic: `PDF_SPACE_${spaceId}`,
            courseId: spaceId,
        },
    } as any) as any;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const fakeEvent = new Event("submit", { bubbles: true, cancelable: true }) as any;
            handleSubmit(fakeEvent);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen w-full bg-black/20 relative">

            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10 flex items-center gap-4">
                <div className="p-2.5 bg-violet-500/20 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">AI PDF Tutor</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Tutor interaktif dengan akses penuh ke dokumen PDF Anda.</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-70">
                        <Bot className="w-16 h-16 text-violet-400 mb-6 opacity-50" />
                        <h3 className="text-white text-lg rounded-xl mb-2 font-bold">Saya siap membantu!</h3>
                        <p className="text-slate-400 text-sm">Anda bisa meminta saya menjelaskan bagian PDF yang spesifik, membuat _quiz_ latihan, atau memberikan rekomendasi video.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((m: any) => (
                            <div key={m.id} className={`flex gap-3 max-w-[95%] md:max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                                <div className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-blue-600" : "bg-violet-600"}`}>
                                    {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>
                                <div className="flex flex-col gap-2 max-w-full">
                                    {m.content && (
                                        <div className={`px-4 py-3 rounded-2xl ${m.role === "user" ? "bg-blue-600/50 text-white rounded-tr-sm" : "bg-white/10 border border-white/5 rounded-tl-sm text-slate-200"}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={mdComponents as any}>
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {/* TOOL INVOCATIONS UI */}
                                    {m.toolInvocations?.map((toolInvocation: any) => {
                                        const { toolName, toolCallId, state } = toolInvocation;

                                        if (toolName === "getDocumentChunk") {
                                            return (
                                                <div key={toolCallId} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 w-fit text-xs text-slate-300">
                                                    {state === "result" ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                                                    {state === "result" ? `Memeriksa ${toolInvocation.result?.chunks?.length || 0} halaman PDF relevan` : "Mencari halaman di PDF..."}
                                                </div>
                                            );
                                        }

                                        if (toolName === "saveMasteryProfile") {
                                            return (
                                                <div key={toolCallId} className="flex items-center gap-2 px-3 py-2 bg-green-900/20 rounded-lg border border-green-500/20 w-fit text-xs text-green-300">
                                                    {state === "result" ? <CheckCircle className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                    Mengupdate profil pemahaman Anda
                                                </div>
                                            );
                                        }

                                        if (toolName === "generateQuiz" && state === "result") {
                                            const quizData = toolInvocation.result?.quiz?.items || [];
                                            return (
                                                <div key={toolCallId} className="bg-slate-900 border border-slate-700 rounded-xl p-4 my-2">
                                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                                        <Layers className="w-4 h-4 text-orange-400" />
                                                        <span className="text-sm font-bold text-white">Quiz AI Khusus Untuk Anda</span>
                                                    </div>
                                                    {quizData.map((q: any, i: number) => (
                                                        <div key={i} className="mb-4 last:mb-0">
                                                            <p className="text-sm text-slate-200 mb-2 font-medium">{i + 1}. {q.question}</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {q.options.map((opt: string, j: number) => (
                                                                    <button key={j} className="text-left px-3 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors">
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        if (toolName === "proposeMedia" && state === "result") {
                                            if (toolInvocation.result?.shouldGenerate) {
                                                return (
                                                    <div key={toolCallId} className="my-2 p-1 border border-blue-500/30 rounded-2xl bg-black/40 overflow-hidden w-full max-w-lg">
                                                        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 mb-1">
                                                            <Video className="w-4 h-4 text-blue-400" />
                                                            <span className="text-xs font-bold text-white tracking-wide">VIDEO REKOMENDASI AI</span>
                                                        </div>
                                                        <ConceptVideoPlayer courseId={spaceId} topic={toolInvocation.args.concept || "Materi AI"} />
                                                    </div>
                                                );
                                            }
                                        }

                                        if (toolName === "proposeUiPatch") {
                                            return (
                                                <div key={toolCallId} className="flex items-center gap-2 px-3 py-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20 w-fit text-xs text-yellow-300">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                    Sistem mencatat potensi perbaikan UI (Usulan Patch AI dibuat)
                                                </div>
                                            );
                                        }

                                        // Fallback rendering for pending tools
                                        if (state !== "result") {
                                            return (
                                                <div key={toolCallId} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 w-fit text-xs text-slate-300">
                                                    <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                                                    AI sedang bekerja ({toolName})...
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 mt-1 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </>
                )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 bg-black/60 backdrop-blur-xl">
                <div className="flex gap-2 max-w-3xl mx-auto items-end relative">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            handleInputChange(e);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder="Tanyakan materi, minta dibuatkan soal cerita, dll..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-violet-500/50 resize-none"
                        style={{ minHeight: "48px" }}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:bg-violet-600 text-white rounded-xl transition-colors shrink-0 mb-0.5"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>

        </div>
    );
}
