"use client";
import { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { submitDrillResult } from '@/lib/actions';
import MDXContent from '@/components/MDXContent';
import { Zap, Target, Trophy, ArrowRight, RotateCcw, Scissors, Snowflake, Shield, Flame, Clock } from 'lucide-react';

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

    // Core game stats
    const [score, setScore] = useState(0); // This is EXP
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [streak, setStreak] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [maxDifficulty, setMaxDifficulty] = useState("EASY");

    // UI states
    const [selected, setSelected] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Gamification states
    const [timeLeft, setTimeLeft] = useState(30);
    const [powerUps, setPowerUps] = useState({ shield: 1, fiftyFifty: 1, freeze: 1 });
    const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
    const [isFrozen, setIsFrozen] = useState(false);
    const [hasShield, setHasShield] = useState(false);
    const [shake, setShake] = useState(false);
    const [floatTexts, setFloatTexts] = useState<{ id: number, text: string, x: number, y: number, color: string }[]>([]);

    const startIdx = currentBatch * batchSize;
    const batchQuestions = questions.slice(startIdx, startIdx + batchSize);
    const question = batchQuestions[current];

    const difficultyColor: Record<string, string> = {
        EASY: "text-green-400 bg-green-400/10 border-green-400/30",
        MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
        HARD: "text-red-400 bg-red-400/10 border-red-400/30",
    };

    // ─── Timer Logic ───
    useEffect(() => {
        if (isAnswered || isFinished || isFrozen) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAnswered, isFinished, isFrozen, current]);

    // Reset loop
    useEffect(() => {
        setTimeLeft(30);
        setEliminatedOptions([]);
        setIsFrozen(false);
        setHasShield(false);
    }, [current, currentBatch]);

    const showFloatText = (text: string, color: string = "text-accent", x: number = typeof window !== 'undefined' ? window.innerWidth / 2 : 200, y: number = typeof window !== 'undefined' ? window.innerHeight / 2 : 300) => {
        const id = Date.now() + Math.random();
        setFloatTexts(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => setFloatTexts(prev => prev.filter(f => f.id !== id)), 1500);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleTimeUp = () => {
        setIsAnswered(true);
        setSelected(-1);
        setTotalAnswered(t => t + 1);

        if (hasShield) {
            setHasShield(false);
            showFloatText("🛡️ Ditangkis!", "text-blue-400");
        } else {
            setStreak(0);
            setMultiplier(1);
            triggerShake();
        }
    };

    const handleAnswer = (index: number, e?: React.MouseEvent) => {
        if (isAnswered || eliminatedOptions.includes(index)) return;
        setSelected(index);
        setIsAnswered(true);
        setTotalAnswered(t => t + 1);

        const cx = e ? e.clientX : (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
        const cy = e ? e.clientY : (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

        if (index === question.correctIndex) {
            setCorrectCount(c => c + 1);
            const newStreak = streak + 1;
            setStreak(newStreak);

            let newMulti = 1;
            if (newStreak >= 3 && newStreak < 5) newMulti = 1.2;
            else if (newStreak >= 5 && newStreak < 10) newMulti = 1.5;
            else if (newStreak >= 10) newMulti = 2.0;

            if (newMulti > multiplier) showFloatText(`Multi x${newMulti}!`, "text-orange-400", cx, cy - 80);
            setMultiplier(newMulti);

            const timeBonus = Math.floor((timeLeft / 30) * 50);
            const earnedExp = Math.floor((100 + timeBonus) * newMulti);
            setScore(s => s + earnedExp);

            showFloatText(`+${earnedExp} EXP!`, "text-green-400", cx, cy - 40);
        } else {
            if (hasShield) {
                setHasShield(false);
                showFloatText("🛡️ Shield Aktif!", "text-blue-400", cx, cy - 40);
            } else {
                setStreak(0);
                setMultiplier(1);
                triggerShake();
            }
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
            await submitDrillResult(unitSlug, correctCount, totalAnswered, maxDifficulty);
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

    // Power Ups Handlers
    const useFiftyFifty = () => {
        if (powerUps.fiftyFifty <= 0 || isAnswered || eliminatedOptions.length > 0) return;
        setPowerUps(p => ({ ...p, fiftyFifty: p.fiftyFifty - 1 }));

        const wrongIndices = question.options
            .map((_: any, i: number) => i)
            .filter((i: number) => i !== question.correctIndex);

        const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
        setEliminatedOptions(shuffled.slice(0, 2));
        showFloatText("✂️ 50/50 Aktif!", "text-violet-400");
    };

    const useFreeze = () => {
        if (powerUps.freeze <= 0 || isAnswered || isFrozen) return;
        setPowerUps(p => ({ ...p, freeze: p.freeze - 1 }));
        setIsFrozen(true);
        showFloatText("❄️ Waktu Dibekukan!", "text-cyan-400");
    };

    const useShield = () => {
        if (powerUps.shield <= 0 || isAnswered || hasShield) return;
        setPowerUps(p => ({ ...p, shield: p.shield - 1 }));
        setHasShield(true);
        showFloatText("🛡️ Shield Siap!", "text-blue-400");
    };

    if (isFinished) {
        const percentage = Math.round((correctCount / batchQuestions.length) * 100);
        const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "👏" : percentage >= 40 ? "💪" : "📚";
        return (
            <div className="text-center p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl mb-4">{emoji}</h1>
                <h2 className="text-3xl font-bold mb-2">Drill Selesai!</h2>
                <p className="text-slate-400 mb-6">{unitTitle}</p>

                <div className="grid grid-cols-2 gap-4 max-w-sm w-full mb-8">
                    <Card className="p-4 bg-cosmic-800/50 border-cosmic-700 text-center">
                        <p className="text-3xl font-bold font-mono text-accent">{correctCount}/{totalAnswered}</p>
                        <p className="text-xs text-slate-400">Total Benar</p>
                    </Card>
                    <Card className="p-4 bg-cosmic-800/50 border-cosmic-700 text-center">
                        <p className="text-3xl font-bold font-mono text-yellow-400">✨ {score}</p>
                        <p className="text-xs text-slate-400">Total EXP</p>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
        <div className={`max-w-2xl mx-auto p-4 text-white min-h-screen pb-32 transition-transform duration-100 ${shake ? 'translate-x-[-10px] animate-shake' : ''}`}>

            {/* Floating Texts */}
            {floatTexts.map(ft => (
                <div key={ft.id} className={`fixed pointer-events-none z-[100] animate-float-up text-xl font-bold ${ft.color}`} style={{ left: ft.x, top: ft.y }}>
                    {ft.text}
                </div>
            ))}

            {/* Top Status Bar */}
            <div className="flex justify-between items-center bg-cosmic-900/80 p-3 rounded-2xl border border-cosmic-700 mb-4 backdrop-blur shadow-lg">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border hidden sm:block ${difficultyColor[question.difficulty] || ""}`}>
                        {question.difficulty}
                    </span>
                    <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-mono font-bold text-yellow-400">{score} EXP</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {streak >= 3 && (
                        <div className="flex items-center bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 animate-pulse">
                            <Flame className="w-4 h-4 fill-orange-400" />
                            <span className="font-bold text-sm hidden sm:inline">{streak}x Streak!</span>
                            <span className="font-bold text-sm sm:hidden">{streak}x</span>
                        </div>
                    )}
                    {multiplier > 1 && (
                        <div className="font-bold text-sm bg-accent/20 text-accent px-2 py-1 rounded-lg border border-accent/30">
                            x{multiplier}
                        </div>
                    )}
                </div>
            </div>

            {/* Timer & Progress Bar */}
            <div className="mb-6 relative">
                <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeLeft}s</span>
                    <span>Batch {currentBatch + 1} • {current + 1}/{batchQuestions.length}</span>
                </div>
                <div className="w-full bg-cosmic-900 rounded-full h-3 overflow-hidden border border-cosmic-800">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${isFrozen ? 'bg-cyan-400' : timeLeft > 10 ? 'bg-gradient-to-r from-primary to-accent' : 'bg-red-500'} ${timeLeft <= 5 && !isFrozen ? 'animate-pulse' : ''}`}
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                </div>
                {isFrozen && <div className="absolute top-0 w-full h-full bg-cyan-400/20 rounded-full animate-pulse pointer-events-none"></div>}
            </div>

            {/* Question Card */}
            <Card className={`p-6 bg-cosmic-800 border-cosmic-700 mb-6 shadow-xl relative overflow-hidden transition-all ${hasShield ? 'ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}`}>
                {hasShield && <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none"></div>}
                <div className="text-lg">
                    <MDXContent source={question.questionMd} />
                </div>
            </Card>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((opt: string, idx: number) => {
                    const isEliminated = eliminatedOptions.includes(idx);
                    let stateClass = "bg-cosmic-900 border-cosmic-700 hover:bg-cosmic-800";

                    if (isEliminated) {
                        stateClass = "opacity-20 grayscale cursor-not-allowed bg-transparent border-slate-800";
                    } else if (isAnswered) {
                        if (idx === question.correctIndex) stateClass = "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                        else if (idx === selected) stateClass = "bg-red-600 border-red-500 text-white";
                        else stateClass = "opacity-40 grayscale";
                    } else if (selected === idx) {
                        stateClass = "bg-primary border-primary";
                    }

                    return (
                        <div
                            key={idx}
                            onClick={(e) => handleAnswer(idx, e)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all font-medium flex items-center ${stateClass} ${!isAnswered && !isEliminated ? 'active:scale-[0.98]' : ''}`}
                        >
                            <span className="font-mono text-sm mr-4 opacity-50 bg-slate-900 px-2 py-1 rounded">{String.fromCharCode(65 + idx)}</span>
                            {opt}
                        </div>
                    );
                })}
            </div>

            {/* Power-ups Row */}
            {!isAnswered && (
                <div className="flex justify-center gap-4 mt-8 bg-cosmic-900/50 p-4 rounded-2xl border border-cosmic-800">
                    <button
                        onClick={useFiftyFifty}
                        disabled={powerUps.fiftyFifty <= 0 || eliminatedOptions.length > 0}
                        className="flex flex-col items-center gap-1 group disabled:opacity-30"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-violet-900 group-hover:border-violet-500 transition-all shadow-lg active:scale-90">
                            <Scissors className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider">50/50 <span className="text-white font-mono ml-1">{powerUps.fiftyFifty}</span></span>
                    </button>

                    <button
                        onClick={useFreeze}
                        disabled={powerUps.freeze <= 0 || isFrozen}
                        className="flex flex-col items-center gap-1 group disabled:opacity-30"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-cyan-900 group-hover:border-cyan-500 transition-all shadow-lg active:scale-90">
                            <Snowflake className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider">FREEZE <span className="text-white font-mono ml-1">{powerUps.freeze}</span></span>
                    </button>

                    <button
                        onClick={useShield}
                        disabled={powerUps.shield <= 0 || hasShield}
                        className="flex flex-col items-center gap-1 group disabled:opacity-30"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-blue-900 group-hover:border-blue-500 transition-all shadow-lg active:scale-90">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider">SHIELD <span className="text-white font-mono ml-1">{powerUps.shield}</span></span>
                    </button>
                </div>
            )}

            {/* Explanation & Next Box */}
            {isAnswered && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300 fixed bottom-0 left-0 w-full p-4 pb-24 md:pb-4 bg-cosmic-900/95 border-t border-cosmic-700 backdrop-blur z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="max-w-3xl mx-auto">
                        <div className={`p-4 rounded-xl mb-4 flex gap-4 items-start ${selected === question.correctIndex ? 'bg-green-900/30 border border-green-500/50' : selected === -1 ? 'bg-orange-900/30 border border-orange-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
                            <div className="hidden sm:flex text-4xl shrink-0 h-12 w-12 items-center justify-center bg-black/20 rounded-full">
                                {selected === question.correctIndex ? "🎯" : "💥"}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold mb-2 flex items-center gap-2 text-lg ${selected === question.correctIndex ? 'text-green-400' : selected === -1 ? 'text-orange-400' : 'text-red-400'}`}>
                                    {selected === question.correctIndex ? "✅ Tepat Sasaran!" : selected === -1 ? "⏱️ Waktu Terbuang!" : "❌ Sayang Sekali!"}
                                </h3>
                                <div className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                                    <MDXContent source={question.explanationMd} />
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleNext} className="w-full py-5 text-lg font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform">
                            LANJUT <span className="ml-2">→</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

