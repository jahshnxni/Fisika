"use client";
import { useState, useMemo } from 'react';
import { Card, Button } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { submitQuizResult } from '@/lib/actions';
import MDXContent from '@/components/MDXContent';
import dynamic from 'next/dynamic';
import type { CharacterAction } from '@/components/3d/JuniorPhysicist';

const StudyCompanion = dynamic(() => import('@/components/3d/StudyCompanion'), { ssr: false });

export default function QuizRunner({ skillId, questions, topic }: { skillId: string, questions: any[], topic?: string }) {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [selected, setSelected] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const question = questions[current];

    // ─── Companion Action Logic ───
    const companionAction: CharacterAction = useMemo(() => {
        if (isFinished) return "celebrate";
        if (hearts === 0) return "sad";
        if (!isAnswered) return "think";
        if (selected === question?.correctIndex) return "cheer";
        return "sad";
    }, [isFinished, hearts, isAnswered, selected, question?.correctIndex]);

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelected(index);
        setIsAnswered(true);

        if (index === question.correctIndex) {
            setScore(s => s + 1);
        } else {
            setHearts(h => Math.max(0, h - 1));
        }
    };

    const handleNext = async () => {
        if (current + 1 < questions.length && hearts > 0) {
            setCurrent(c => c + 1);
            setSelected(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
            await submitQuizResult(skillId, score, questions.length);
        }
    };

    if (hearts === 0) {
        return (
            <div className="text-center p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl mb-4">💔</h1>
                <h2 className="text-3xl font-bold mb-2">Game Over</h2>
                <p className="text-slate-400">Jangan menyerah! Coba lagi.</p>

                {/* Sad companion */}
                <div className="mt-4">
                    <StudyCompanion topic={topic} action="sad" size="medium" showBubble />
                </div>

                <Button onClick={() => window.location.reload()} className="mt-8 bg-red-600 hover:bg-red-700 px-8 py-3">
                    Coba Lagi
                </Button>
                <Button onClick={() => router.push('/learn')} variant="outline" className="mt-4">
                    Kembali ke Menu
                </Button>
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="text-center p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl mb-4">🎉</h1>
                <h2 className="text-3xl font-bold mb-2">Latihan Selesai!</h2>
                <div className="text-xl font-mono bg-cosmic-800 px-6 py-4 rounded-xl border border-cosmic-700 mt-4">
                    Skor: <span className="text-accent">{score}</span> / {questions.length}
                </div>

                {/* Celebrating companion */}
                <div className="mt-6">
                    <StudyCompanion topic={topic} action="celebrate" size="large" showBubble />
                </div>

                <div className="mt-8 gap-4 flex justify-center">
                    <Button onClick={() => router.push('/learn')} variant="outline">
                        Menu Utama
                    </Button>
                    <Button onClick={() => router.refresh()} variant="primary">
                        Ulangi
                    </Button>
                </div>
            </div>
        )
    }

    if (!question) return <div className="text-white p-8">Loading Soal...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 text-white min-h-screen pb-24">
            <div className="flex justify-between mb-6 text-xl font-mono items-center bg-cosmic-800/50 p-4 rounded-lg backdrop-blur">
                <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < hearts ? "opacity-100" : "opacity-20 grayscale"}>❤️</span>
                    ))}
                </div>
                <span className="text-sm text-slate-400">Soal {current + 1} dari {questions.length}</span>
            </div>

            {/* Companion floating in top-right */}
            <div className="fixed bottom-28 right-4 z-30 hidden md:block">
                <StudyCompanion topic={topic} action={companionAction} size="small" showBubble />
            </div>

            <Card className="p-6 bg-cosmic-800 border-cosmic-700 mb-6 shadow-xl">
                <div className="text-lg">
                    <MDXContent source={question.questionMd} />
                </div>
            </Card>

            <div className="space-y-3">
                {question.options.map((opt: string, idx: number) => {
                    let stateClass = "bg-cosmic-900 border-cosmic-700 hover:bg-cosmic-800";
                    if (isAnswered) {
                        if (idx === question.correctIndex) stateClass = "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                        else if (idx === selected) stateClass = "bg-red-600 border-red-500 text-white";
                        else stateClass = "opacity-40 grayscale";
                    } else if (selected === idx) {
                        stateClass = "bg-primary border-primary";
                    }

                    return (
                        <div
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-98 font-medium ${stateClass}`}
                        >
                            {opt}
                        </div>
                    )
                })}
            </div>

            {isAnswered && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300 fixed bottom-0 left-0 w-full p-4 bg-cosmic-900 border-t border-cosmic-700">
                    <div className="max-w-2xl mx-auto">
                        <div className={`p-4 rounded-lg mb-4 ${selected === question.correctIndex ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                            <h3 className={`font-bold mb-2 flex items-center gap-2 ${selected === question.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                                {selected === question.correctIndex ? "✅ Benar!" : "❌ Kurang Tepat"}
                            </h3>
                            <div className="text-sm text-slate-300">
                                <MDXContent source={question.explanationMd} />
                            </div>
                        </div>
                        <Button onClick={handleNext} className="w-full py-4 text-lg font-bold shadow-lg">
                            LANJUT →
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
