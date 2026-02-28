"use client";

import { useState } from "react";
import { PenTool, CheckCircle, HelpCircle, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import AutoBuildGate from "../_components/AutoBuildGate";

interface Example {
    level: string;
    question: string;
    options?: string[];
    correctIndex?: number;
    answer: string;
}

interface Lesson {
    id: string;
    title: string;
    scaffoldedMdx: string;
}

const LEVEL_STYLE: Record<string, string> = {
    EASY: "bg-green-500/10 border-green-500/20 text-green-400",
    MEDIUM: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    HARD: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    EXTREME: "bg-red-500/10 border-red-500/20 text-red-400",
};

function ExampleCard({ ex, idx }: { ex: Example; idx: number }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const hasOptions = Array.isArray(ex.options) && ex.options.length > 0;
    const levelStyle = LEVEL_STYLE[ex.level] || LEVEL_STYLE.HARD;

    const handleSelect = (i: number) => {
        if (showAnswer) return;
        setSelected(i);
        setShowAnswer(true);
    };

    const isCorrect = selected === ex.correctIndex;

    return (
        <div className={`p-5 rounded-xl border ${levelStyle.split(" ").slice(0, 2).join(" ")}`}>
            {/* Level badge */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded bg-black/50 uppercase tracking-widest ${levelStyle.split(" ")[2]}`}>
                    Soal {idx + 1} · Level: {ex.level}
                </span>
            </div>

            {/* Question */}
            <div className="text-slate-100 font-medium mb-4 flex gap-3">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                <p className="leading-relaxed">{ex.question}</p>
            </div>

            {/* ABCD Options */}
            {hasOptions ? (
                <div className="space-y-2 mb-4">
                    {ex.options!.map((opt, i) => {
                        const isChosen = selected === i;
                        const isRight = i === ex.correctIndex;
                        let optStyle = "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer";
                        if (showAnswer) {
                            if (isRight) optStyle = "bg-green-500/20 border-green-400/50";
                            else if (isChosen && !isRight) optStyle = "bg-red-500/20 border-red-400/50";
                            else optStyle = "bg-white/5 border-white/5 opacity-50";
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={showAnswer}
                                className={`w-full text-left p-3 rounded-lg border text-sm text-slate-200 transition-all duration-200 flex items-center gap-3 ${optStyle}`}
                            >
                                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${showAnswer && isRight ? "bg-green-500 border-green-400 text-white" : showAnswer && isChosen ? "bg-red-500 border-red-400 text-white" : "border-white/30 text-slate-400"}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                {opt.replace(/^[A-D]\.\s*/i, "")}
                                {showAnswer && isRight && <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
                                {showAnswer && isChosen && !isRight && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            ) : (
                !showAnswer && (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="text-sm text-violet-400 underline mb-4 hover:text-violet-300"
                    >
                        Lihat Jawaban
                    </button>
                )
            )}

            {/* Result + Answer */}
            {showAnswer && (
                <div className="mt-3">
                    {hasOptions && (
                        <div className={`text-sm font-bold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "✅ Benar!" : `❌ Salah. Jawaban benar: ${String.fromCharCode(65 + (ex.correctIndex ?? 0))}`}
                        </div>
                    )}
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-slate-300 text-sm">
                        <span className="font-bold text-white not-italic mb-1 block">Pembahasan:</span>
                        <p className="whitespace-pre-line leading-relaxed">{ex.answer}</p>
                    </div>
                    {hasOptions && (
                        <button
                            onClick={() => { setSelected(null); setShowAnswer(false); }}
                            className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline"
                        >
                            Coba lagi
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function LessonSection({ lesson }: { lesson: Lesson }) {
    const [open, setOpen] = useState(true);
    let examples: Example[] = [];
    try { examples = JSON.parse(lesson.scaffoldedMdx || "[]"); } catch { }
    if (examples.length === 0) return null;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-fuchsia-400 shrink-0" />
                    {lesson.title}
                    <span className="text-sm font-normal text-slate-400">({examples.length} soal)</span>
                </h2>
                {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {open && (
                <div className="px-6 pb-6 space-y-4">
                    {examples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} />)}
                </div>
            )}
        </div>
    );
}

export default function PracticeClient({ spaceId, lessons }: { spaceId: string; lessons: Lesson[] }) {
    return (
        <AutoBuildGate spaceId={spaceId}>
            <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto">
                <div className="mb-12 flex items-center gap-4">
                    <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                        <PenTool className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Latihan Bertingkat</h1>
                        <p className="text-slate-400">Soal pilihan ganda A/B/C/D bertingkat (EASY → EXTREME). Klik pilihan untuk langsung tahu jawabannya.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {lessons.length === 0 ? (
                        <p className="text-slate-500 italic">Belum ada soal latihan.</p>
                    ) : (
                        lessons.map(l => <LessonSection key={l.id} lesson={l} />)
                    )}
                </div>
            </div>
        </AutoBuildGate>
    );
}
