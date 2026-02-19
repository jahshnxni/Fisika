"use client";
import { useState } from 'react';
import { Card, Button } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { submitDrillResult } from '@/lib/actions';
import MDXContent from '@/components/MDXContent';
import { Zap, Target, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface DrillQuestion {
    id: string;
    questionMd: string;
    options: string[];
    correctIndex: number;
    explanationMd: string;
    difficulty: string;
    tags: string[];
}

export default function DrillRunner({ unitSlug, unitTitle, questions }: {
    unitSlug: string;
    unitTitle: string;
    questions: DrillQuestion[];
}) {
    const router = useRouter();
    const batchSize = 10;
    const [currentBatch, setCurrentBatch] = useState(0);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [maxDifficulty, setMaxDifficulty] = useState("EASY");

    // Get current batch of questions
    const startIdx = currentBatch * batchSize;
    const batchQuestions = questions.slice(startIdx, startIdx + batchSize);
    const question = batchQuestions[current];

    const difficultyColor: Record<string, string> = {
        EASY: "text-green-400 bg-green-400/10 border-green-400/30",
        MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
        HARD: "text-red-400 bg-red-400/10 border-red-400/30",
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelected(index);
        setIsAnswered(true);
        setTotalAnswered(t => t + 1);

        if (index === question.correctIndex) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }

        if (question.difficulty === "HARD") setMaxDifficulty("HARD");
        else if (question.difficulty === "MEDIUM" && maxDifficulty !== "HARD") setMaxDifficulty("MEDIUM");
    };

    const handleNext = async () => {
        if (current + 1 < batchQuestions.length) {
            setCurrent(c => c + 1);
            setSelected(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
            await submitDrillResult(unitSlug, score, totalAnswered, maxDifficulty);
            router.refresh();
        }
    };

    const handleNextBatch = () => {
        if (startIdx + batchSize < questions.length) {
            setCurrentBatch(b => b + 1);
            setCurrent(0);
            setSelected(null);
            setIsAnswered(false);
            setIsFinished(false);
        }
    };

    if (isFinished) {
        const percentage = Math.round((score / totalAnswered) * 100);
        const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "👏" : percentage >= 40 ? "💪" : "📚";
        return (
            <div className="text-center p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl mb-4">{emoji}</h1>
                <h2 className="text-3xl font-bold mb-2">Drill Selesai!</h2>
                <p className="text-slate-400 mb-6">{unitTitle}</p>

                <div className="grid grid-cols-2 gap-4 max-w-sm w-full mb-8">
                    <Card className="p-4 bg-cosmic-800/50 border-cosmic-700 text-center">
                        <p className="text-3xl font-bold font-mono text-accent">{score}/{totalAnswered}</p>
                        <p className="text-xs text-slate-400">Benar</p>
                    </Card>
                    <Card className="p-4 bg-cosmic-800/50 border-cosmic-700 text-center">
                        <p className="text-3xl font-bold font-mono text-primary">{percentage}%</p>
                        <p className="text-xs text-slate-400">Akurasi</p>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button onClick={() => router.push('/drill')} variant="outline" className="flex items-center gap-2 border-slate-600 text-slate-300">
                        <ArrowRight className="w-4 h-4 rotate-180" /> Menu Drill
                    </Button>
                    {startIdx + batchSize < questions.length ? (
                        <Button onClick={handleNextBatch} className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent">
                            Batch Berikutnya <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent">
                            <RotateCcw className="w-4 h-4" /> Ulangi
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (!question) return <div className="text-white p-8 text-center">Loading Soal...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 text-white min-h-screen pb-32">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-cosmic-800/50 p-4 rounded-xl backdrop-blur">
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${difficultyColor[question.difficulty] || ""}`}>
                        {question.difficulty}
                    </span>
                    {streak >= 3 && (
                        <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" /> {streak}🔥
                        </span>
                    )}
                </div>
                <span className="text-sm text-slate-400 font-mono">
                    Batch {currentBatch + 1} • Soal {current + 1}/{batchQuestions.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cosmic-900 rounded-full h-2 mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${((current + 1) / batchQuestions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <Card className="p-6 bg-cosmic-800 border-cosmic-700 mb-6 shadow-xl">
                <div className="text-lg">
                    <MDXContent source={question.questionMd} />
                </div>
            </Card>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((opt: string, idx: number) => {
                    let stateClass = "bg-cosmic-900 border-cosmic-700 hover:bg-cosmic-800";
                    if (isAnswered) {
                        if (idx === question.correctIndex) stateClass = "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                        else if (idx === selected) stateClass = "bg-red-600 border-red-500 text-white";
                        else stateClass = "opacity-40 grayscale";
                    }

                    return (
                        <div
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] font-medium ${stateClass}`}
                        >
                            <span className="font-mono text-sm mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </div>
                    );
                })}
            </div>

            {/* Explanation */}
            {isAnswered && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300 fixed bottom-0 left-0 w-full p-4 bg-cosmic-900/95 border-t border-cosmic-700 backdrop-blur">
                    <div className="max-w-2xl mx-auto">
                        <div className={`p-4 rounded-lg mb-4 ${selected === question.correctIndex ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                            <h3 className={`font-bold mb-2 ${selected === question.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                                {selected === question.correctIndex ? "✅ Benar!" : "❌ Kurang Tepat"}
                            </h3>
                            <div className="text-sm text-slate-300">
                                <MDXContent source={question.explanationMd} />
                            </div>
                        </div>
                        <Button onClick={handleNext} className="w-full py-4 text-lg font-bold shadow-lg bg-gradient-to-r from-primary to-accent">
                            LANJUT →
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
