"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coins, AlertTriangle } from "lucide-react";
import { rewardFocusSession } from "@/app/actions/economy";

export default function FocusTimer() {
    const FOCUS_TIME = 25 * 60; // 25 minutes
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [streak, setStreak] = useState(0);

    // Anti-cheat: Tab visibility
    useEffect(() => {
        if (!isActive || isFinished) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsActive(false);
                setIsPaused(true);
                alert("⚠️ Dilarang pindah tab saat Focus Session! Timer dipause.");
            }
        };

        const timer = setInterval(() => {
            if (!isPaused) {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishSession();
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isActive, isPaused, isFinished]);

    const finishSession = async () => {
        setIsActive(false);
        setIsFinished(true);
        const res = await rewardFocusSession();
        if (res.success) {
            setStreak(s => s + 1);
            alert("🎉 Sesi Selesai! +50 Edu-Coins");
        } else {
            alert(res.error || "Gagal mengklaim reward.");
        }
    };

    const toggleTimer = () => {
        if (timeLeft === 0) setTimeLeft(FOCUS_TIME);
        setIsActive(!isActive);
        setIsPaused(false);
        setIsFinished(false);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(FOCUS_TIME);
        setIsPaused(false);
        setIsFinished(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-cosmic-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" /> Focus Mode
            </h3>

            <div className="text-5xl font-mono font-bold mb-6 tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={`p-4 rounded-full transition-all ${isActive
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
                >
                    {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-white/5 text-slate-400 hover:bg-white/10"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

            <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" /> Reward: 50 Coins
            </div>
        </div>
    );
}
