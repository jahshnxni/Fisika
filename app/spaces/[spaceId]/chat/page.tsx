"use client";

import React, { useState, useRef, useEffect, useCallback, use } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, Key } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const mdComponents = {
    p: ({ children, ...props }: any) => <p className="mb-3 leading-relaxed text-slate-200 text-sm md:text-[15px]" {...props}>{children}</p>,
    ul: ({ children, ...props }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-200 ml-2 text-sm" {...props}>{children}</ul>,
    ol: ({ children, ...props }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-200 ml-2 text-sm" {...props}>{children}</ol>,
    li: ({ children, ...props }: any) => <li className="text-sm md:text-[15px]" {...props}>{children}</li>,
    strong: ({ children, ...props }: any) => <strong className="text-white font-bold" {...props}>{children}</strong>,
    code: ({ inline, className, children, ...props }: any) => (
        inline ? <code className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code> :
            <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700 text-xs"><code className={className} {...props}>{children}</code></pre>
    ),
};

interface ChatMsg {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function SpaceChatPage({
    params
}: {
    params: Promise<{ spaceId: string }>
}) {
    // Unwrap params in Next.js 16
    const resolvedParams = use(params);
    const spaceId = resolvedParams.spaceId;

    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingContent]);

    const sendMessage = useCallback(async (overrideMsg?: string) => {
        const msg = overrideMsg || input.trim();
        if (!msg || isStreaming) return;

        const userMsg: ChatMsg = {
            id: `temp-${Date.now()}`,
            role: "user",
            content: msg,
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsStreaming(true);
        setStreamingContent("");

        if (inputRef.current) inputRef.current.style.height = "auto";

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: msg,
                    sessionId: activeSessionId,
                    mode: "QA",
                    topic: `PDF_SPACE_${spaceId}` // Signal to the backend to use the specific space context if needed
                }),
            });

            if (!res.ok && !res.headers.get("content-type")?.includes("text/event-stream")) {
                throw new Error("Gagal merespons");
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("Stream gagals");

            const decoder = new TextDecoder();
            let fullContent = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.text) {
                                fullContent += data.text;
                                setStreamingContent(fullContent);
                            } else if (data.done && data.sessionId) {
                                setActiveSessionId(data.sessionId);
                            }
                        } catch { }
                    }
                }
            }

            if (fullContent) {
                setMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: fullContent }]);
            }

        } catch (e: any) {
            setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: "assistant", content: `⚠️ **Error:** ${e.message}` }]);
        } finally {
            setIsStreaming(false);
            setStreamingContent("");
        }
    }, [input, isStreaming, activeSessionId, spaceId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
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
                    <p className="text-slate-400 text-xs md:text-sm">Tanyakan apapun terkait modul hasil ektraksi ini.</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 && !streamingContent ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-70">
                        <Bot className="w-16 h-16 text-violet-400 mb-6 opacity-50" />
                        <h3 className="text-white text-lg rounded-xl mb-2 font-bold">Saya siap membantu!</h3>
                        <p className="text-slate-400 text-sm">Anda bisa meminta saya menjelaskan lebih detil bagian materi yang belum dipahami, atau minta dibuatkan soal tambahan.</p>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-violet-600"}`}>
                                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-blue-600/50 text-white rounded-tr-sm" : "bg-white/10 border border-white/5 rounded-tl-sm text-slate-200"}`}>
                                    {msg.role === "user" ? (
                                        <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={mdComponents as any}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isStreaming && streamingContent && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                                <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm text-slate-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={mdComponents as any}>{streamingContent}</ReactMarkdown>
                                    <div className="flex items-center gap-1 mt-2"><Sparkles className="w-3 h-3 text-violet-400 animate-pulse" /><span className="text-xs text-violet-400">Menulis...</span></div>
                                </div>
                            </div>
                        )}
                        {isStreaming && !streamingContent && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                                <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </>
                )}
            </div>

            {/* Input Box */}
            <div className="border-t border-white/10 p-4 bg-black/60 backdrop-blur-xl">
                <div className="flex gap-2 max-w-3xl mx-auto items-end relative">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming}
                        placeholder="Ketik pertanyaan terkait PDF di sini..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-violet-500/50 resize-none"
                        style={{ minHeight: "48px" }}
                        rows={1}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isStreaming}
                        className="p-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:bg-violet-600 text-white rounded-xl transition-colors shrink-0 mb-0.5"
                    >
                        {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>

        </div>
    );
}
