"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    MessageSquare, Send, Plus, Trash2, ChevronLeft,
    BookOpen, HelpCircle, Target, Sparkles, Bot, User,
    Lightbulb, ListChecks, ClipboardList, Loader2, Menu, X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ─── Types ───
type Mode = "TUTOR" | "QA" | "PRACTICE";

interface ChatMsg {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

interface Session {
    id: string;
    title: string;
    mode: string;
    topic: string | null;
    updatedAt: string;
    _count: { messages: number };
}

const MODES: { key: Mode; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { key: "TUTOR", label: "Tutor", icon: <BookOpen className="w-4 h-4" />, desc: "Belajar terstruktur", color: "from-violet-500 to-purple-600" },
    { key: "QA", label: "Tanya Jawab", icon: <HelpCircle className="w-4 h-4" />, desc: "Tanya bebas", color: "from-blue-500 to-cyan-500" },
    { key: "PRACTICE", label: "Latihan", icon: <Target className="w-4 h-4" />, desc: "Soal adaptif", color: "from-amber-500 to-orange-500" },
];

const TOPICS = [
    { slug: "fluida-statis", label: "🌊 Fluida Statis" },
    { slug: "fluida-dinamis", label: "💨 Fluida Dinamis" },
    { slug: "gelombang", label: "〰️ Gelombang" },
    { slug: "suhu-kalor", label: "🌡️ Suhu & Kalor" },
    { slug: "termodinamika", label: "⚙️ Termodinamika" },
];

// ─── Markdown components for chat ───
const mdComponents = {
    h1: ({ children, ...props }: any) => <h1 className="text-xl font-bold text-white mb-3 mt-5" {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 className="text-lg font-bold text-violet-300 mb-2 mt-4" {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 className="text-base font-bold text-blue-300 mb-1.5 mt-3" {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p className="mb-3 leading-relaxed text-slate-200 text-[15px]" {...props}>{children}</p>,
    ul: ({ children, ...props }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-200 ml-2" {...props}>{children}</ul>,
    ol: ({ children, ...props }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-200 ml-2" {...props}>{children}</ol>,
    li: ({ children, ...props }: any) => <li className="text-[15px]" {...props}>{children}</li>,
    strong: ({ children, ...props }: any) => <strong className="text-white font-bold" {...props}>{children}</strong>,
    em: ({ children, ...props }: any) => <em className="text-blue-300 italic" {...props}>{children}</em>,
    blockquote: ({ children, ...props }: any) => <blockquote className="border-l-3 border-violet-500 pl-3 italic text-slate-400 my-3 bg-violet-950/30 p-3 rounded-r-lg text-sm" {...props}>{children}</blockquote>,
    code: ({ inline, className, children, ...props }: any) => (
        inline ?
            <code className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code> :
            <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700 text-sm"><code className={className} {...props}>{children}</code></pre>
    ),
    table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto my-3">
            <table className="w-full border-collapse text-sm text-slate-200" {...props}>{children}</table>
        </div>
    ),
    th: ({ children, ...props }: any) => <th className="border border-slate-600 bg-slate-800 px-3 py-2 text-left font-bold text-white" {...props}>{children}</th>,
    td: ({ children, ...props }: any) => <td className="border border-slate-700 px-3 py-2" {...props}>{children}</td>,
    hr: (props: any) => <hr className="border-slate-700 my-4" {...props} />,
};

// ─── Message Bubble ───
function MessageBubble({ msg }: { msg: ChatMsg }) {
    const isUser = msg.role === "user";
    return (
        <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-violet-500 to-purple-600"
                }`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                ? "bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white rounded-tr-sm"
                : "bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-tl-sm"
                }`}>
                {isUser ? (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                    <div className="prose-sm prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={mdComponents as any}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Typing Indicator ───
function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-slate-500 ml-2">Physica AI sedang mengetik...</span>
                </div>
            </div>
        </div>
    );
}

// ─── Streaming Response ───
function StreamingMessage({ content }: { content: string }) {
    return (
        <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[85%] bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="prose-sm prose-invert max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={mdComponents as any}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
                <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                    <span className="text-xs text-violet-400">Sedang menulis...</span>
                </div>
            </div>
        </div>
    );
}

// ─── Welcome Screen ───
function WelcomeScreen({ onQuickAction }: { onQuickAction: (msg: string) => void }) {
    const suggestions = [
        { icon: "🌊", text: "Jelaskan tekanan hidrostatis dengan analogi", topic: "fluida-statis" },
        { icon: "🔧", text: "Bagaimana cara kerja dongkrak hidrolik?", topic: "fluida-statis" },
        { icon: "⚓", text: "Kenapa kapal baja bisa terapung?", topic: "fluida-statis" },
        { icon: "💨", text: "Jelaskan persamaan Bernoulli", topic: "fluida-dinamis" },
        { icon: "🌡️", text: "Apa bedanya kalor dan suhu?", topic: "suhu-kalor" },
        { icon: "⚙️", text: "Buatkan soal termodinamika level mudah", topic: "termodinamika" },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full px-4 py-12">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Halo! Aku Physica AI 🧠</h2>
            <p className="text-slate-400 text-center max-w-md mb-8">
                Guru fisika pribadimu yang siap membantu belajar, menjawab pertanyaan, dan melatihmu dengan soal-soal adaptif.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onQuickAction(s.text)}
                        className="text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 hover:border-violet-500/30 transition-all group"
                    >
                        <span className="text-lg mr-2">{s.icon}</span>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{s.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ───
export default function AITutorPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const [mode, setMode] = useState<Mode>("QA");
    const [topic, setTopic] = useState<string>("fluida-statis");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingContent]);

    // Load sessions on mount
    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const res = await fetch("/api/ai/chat");
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (e) {
            console.error("Failed to load sessions:", e);
        } finally {
            setLoadingSessions(false);
        }
    };

    const loadSession = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/ai/chat?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content,
                    createdAt: m.createdAt,
                })));
                setActiveSessionId(sessionId);
                setMode(data.mode as Mode);
                if (data.topic) setTopic(data.topic);
                setSidebarOpen(false);
            }
        } catch (e) {
            console.error("Failed to load session:", e);
        }
    };

    const deleteSession = async (sessionId: string) => {
        try {
            await fetch(`/api/ai/chat?sessionId=${sessionId}`, { method: "DELETE" });
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (activeSessionId === sessionId) {
                setActiveSessionId(null);
                setMessages([]);
            }
        } catch (e) {
            console.error("Failed to delete session:", e);
        }
    };

    const newChat = () => {
        setActiveSessionId(null);
        setMessages([]);
        setInput("");
        setStreamingContent("");
        setSidebarOpen(false);
    };

    const sendMessage = useCallback(async (overrideMsg?: string) => {
        const msg = overrideMsg || input.trim();
        if (!msg || isStreaming) return;

        const userMsg: ChatMsg = {
            id: `temp-${Date.now()}`,
            role: "user",
            content: msg,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsStreaming(true);
        setStreamingContent("");

        // Auto-resize textarea
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
        }

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: msg,
                    sessionId: activeSessionId,
                    mode,
                    topic,
                }),
            });

            // Handle non-streaming error responses (401, 404, 500, etc)
            if (!res.ok && !res.headers.get("content-type")?.includes("text/event-stream")) {
                let errorText = "Gagal mengirim pesan.";
                try {
                    const errData = await res.json();
                    errorText = errData.error || errorText;
                } catch {
                    errorText = `Server error (${res.status})`;
                }
                throw new Error(errorText);
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("Tidak bisa membaca respons dari server");

            const decoder = new TextDecoder();
            let fullContent = "";
            let newSessionId = activeSessionId;
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // keep incomplete line

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) {
                                fullContent += `\n\n⚠️ **${data.error}**`;
                                setStreamingContent(fullContent);
                            } else if (data.done) {
                                newSessionId = data.sessionId;
                            } else if (data.text) {
                                fullContent += data.text;
                                setStreamingContent(fullContent);
                                if (data.sessionId && !activeSessionId) {
                                    newSessionId = data.sessionId;
                                }
                            }
                        } catch { }
                    }
                }
            }

            // Add completed message
            if (fullContent) {
                const assistantMsg: ChatMsg = {
                    id: `ai-${Date.now()}`,
                    role: "assistant",
                    content: fullContent,
                    createdAt: new Date().toISOString(),
                };
                setMessages(prev => [...prev, assistantMsg]);
            }

            // Update session ID
            if (newSessionId && newSessionId !== activeSessionId) {
                setActiveSessionId(newSessionId);
            }

            // Refresh sessions list
            loadSessions();
        } catch (e: any) {
            const errorMsg: ChatMsg = {
                id: `err-${Date.now()}`,
                role: "assistant",
                content: `⚠️ **Error:** ${e.message || "Gagal mengirim pesan. Coba lagi."}`,
                createdAt: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsStreaming(false);
            setStreamingContent("");
        }
    }, [input, isStreaming, activeSessionId, mode, topic]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
    };

    const currentModeInfo = MODES.find(m => m.key === mode)!;

    return (
        <div className="flex h-[calc(100dvh-10rem)] lg:h-[calc(100dvh-6rem)] overflow-hidden -mx-4 -my-4 md:-mx-8">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50
        w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50
        flex flex-col transition-transform duration-300
      `}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">Physica AI</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={newChat}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-600/20"
                    >
                        <Plus className="w-4 h-4" /> Chat Baru
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {loadingSessions ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">Belum ada percakapan</p>
                    ) : (
                        sessions.map(s => (
                            <div
                                key={s.id}
                                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${activeSessionId === s.id
                                    ? "bg-violet-600/20 border border-violet-500/30"
                                    : "hover:bg-slate-800/60 border border-transparent"
                                    }`}
                                onClick={() => loadSession(s.id)}
                            >
                                <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-300 truncate">{s.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {s.mode === "TUTOR" ? "🎓" : s.mode === "PRACTICE" ? "🎯" : "💬"}{" "}
                                        {s._count.messages} pesan
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Mode Tabs */}
                        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
                            {MODES.map(m => (
                                <button
                                    key={m.key}
                                    onClick={() => setMode(m.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === m.key
                                        ? `bg-gradient-to-r ${m.color} text-white shadow-md`
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                        }`}
                                >
                                    {m.icon}
                                    <span className="hidden sm:inline">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Topic Selector */}
                        <select
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                        >
                            {TOPICS.map(t => (
                                <option key={t.slug} value={t.slug}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {messages.length === 0 && !streamingContent ? (
                        <WelcomeScreen onQuickAction={(msg) => sendMessage(msg)} />
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))}
                            {isStreaming && streamingContent && <StreamingMessage content={streamingContent} />}
                            {isStreaming && !streamingContent && <TypingIndicator />}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-4 py-3">
                    <div className="max-w-3xl mx-auto">
                        {/* Quick actions */}
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                            <button
                                onClick={() => sendMessage("Berikan saya hint untuk soal ini")}
                                disabled={isStreaming}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-yellow-300 hover:border-yellow-500/30 transition-all whitespace-nowrap disabled:opacity-50"
                            >
                                <Lightbulb className="w-3.5 h-3.5" /> Hint
                            </button>
                            <button
                                onClick={() => sendMessage("Tunjukkan langkah-langkah penyelesaiannya")}
                                disabled={isStreaming}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-blue-300 hover:border-blue-500/30 transition-all whitespace-nowrap disabled:opacity-50"
                            >
                                <ListChecks className="w-3.5 h-3.5" /> Langkah
                            </button>
                            <button
                                onClick={() => sendMessage("Buatkan soal latihan untuk topik ini")}
                                disabled={isStreaming}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-orange-300 hover:border-orange-500/30 transition-all whitespace-nowrap disabled:opacity-50"
                            >
                                <ClipboardList className="w-3.5 h-3.5" /> Soal
                            </button>
                        </div>

                        {/* Input box */}
                        <div className="flex gap-2 items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleTextareaInput}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Tanya Physica AI tentang ${TOPICS.find(t => t.slug === topic)?.label || "fisika"}...`}
                                    rows={1}
                                    disabled={isStreaming}
                                    className="w-full resize-none bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all disabled:opacity-50"
                                    style={{ minHeight: "44px", maxHeight: "160px" }}
                                />
                            </div>
                            <button
                                onClick={() => sendMessage()}
                                disabled={isStreaming || !input.trim()}
                                className="p-3 mb-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-600/20"
                            >
                                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-2 text-center">
                            Physica AI bisa membuat kesalahan. Verifikasi informasi penting secara mandiri.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
