"use client";

import React, { useState, useEffect } from "react";
import type { CharacterAction } from "./JuniorPhysicist";

interface StudyCompanionProps {
    topic?: string;
    action?: CharacterAction;
    size?: "small" | "medium" | "large";
    skin?: string;
    petType?: string;
    showBubble?: boolean;
    message?: string;
}

const MESSAGES: Record<string, string[]> = {
    idle: [
        "Ayo eksplorasi fisika bersama! 🔬",
        "Pahami konsep lewat simulasinya! 💡",
        "Kamu pasti bisa taklukkan TKA! ⚡",
    ],
    cheer: [
        "BENAR! Keren banget! 🎉",
        "Jawaban tepat! Lanjut! 🥳",
        "Hebat! Terus semangat! 🌟",
    ],
    think: [
        "Hmm, perhatikan arah vektor gayanya... 🤔",
        "Ingat rumus dan satuannya ya! 📖",
        "Analisis langkah-demi-langkah! 🧐",
    ],
    celebrate: [
        "SELESAI! Kamu luar biasa! 🏆",
        "Misi tercapai sempurna! 🚀",
        "100% Menguasai materi! 💯",
    ],
    wave: [
        "Halo Fisikawan Hebat! 👋",
    ],
};

export default function StudyCompanion({
    action = "idle",
    size = "small",
    showBubble = true,
    message,
}: StudyCompanionProps) {
    const [bubbleIndex, setBubbleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBubbleIndex((prev) => (prev + 1) % 3);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const bubbleMessage = message || MESSAGES[action]?.[bubbleIndex] || MESSAGES.idle[0];

    const sizeClasses = {
        small: "w-20 h-24",
        medium: "w-28 h-32",
        large: "w-36 h-40",
    }[size];

    return (
        <div className="relative flex flex-col items-center select-none pointer-events-auto">
            {/* Speech Bubble */}
            {showBubble && (
                <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-cyan-200 text-[11px] px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl animate-bounce"
                    style={{ animationDuration: "3s" }}
                >
                    <span className="font-medium">{bubbleMessage}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-900" />
                </div>
            )}

            {/* Animated SVG Physicist Avatar */}
            <div className={`${sizeClasses} relative flex items-center justify-center filter drop-shadow-[0_4px_16px_rgba(6,182,212,0.3)]`}>
                <svg viewBox="0 0 100 120" className="w-full h-full">
                    {/* Glowing Aura */}
                    <circle cx="50" cy="60" r="45" fill="rgba(6, 182, 212, 0.08)" />

                    {/* Body / Lab Coat */}
                    <path
                        d="M30 65 L20 110 L80 110 L70 65 Z"
                        fill="#1e293b"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M40 65 L50 90 L60 65"
                        fill="#0f172a"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                    />

                    {/* Tie / Badge */}
                    <polygon points="50,70 53,82 50,86 47,82" fill="#f59e0b" />

                    {/* Head */}
                    <circle cx="50" cy="40" r="22" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />

                    {/* Hair */}
                    <path
                        d="M28 35 Q50 12 72 35 Q60 22 40 25 Z"
                        fill="#475569"
                    />

                    {/* Glasses */}
                    <circle cx="42" cy="38" r="7" fill="none" stroke="#06b6d4" strokeWidth="2" />
                    <circle cx="58" cy="38" r="7" fill="none" stroke="#06b6d4" strokeWidth="2" />
                    <line x1="49" y1="38" x2="51" y2="38" stroke="#06b6d4" strokeWidth="2" />

                    {/* Eyes */}
                    <circle cx="42" cy="38" r="2.5" fill="#0f172a" />
                    <circle cx="58" cy="38" r="2.5" fill="#0f172a" />
                    <circle cx="43" cy="37" r="0.8" fill="#ffffff" />
                    <circle cx="59" cy="37" r="0.8" fill="#ffffff" />

                    {/* Smile */}
                    <path d="M45 46 Q50 51 55 46" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

                    {/* Floating Atom Mini Mascot */}
                    <g className="animate-spin" style={{ transformOrigin: "82px 35px", animationDuration: "6s" }}>
                        <ellipse cx="82" cy="35" rx="10" ry="4" fill="none" stroke="#a855f7" strokeWidth="1.2" transform="rotate(30 82 35)" />
                        <ellipse cx="82" cy="35" rx="10" ry="4" fill="none" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(-30 82 35)" />
                        <circle cx="82" cy="35" r="2.5" fill="#facc15" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
