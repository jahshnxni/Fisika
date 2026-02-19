"use client";

import { motion } from "framer-motion";
import { getVerifiedColor, League } from "@/lib/gamification";

interface LeagueBadgeProps {
    league: League;
    size?: "sm" | "md" | "lg" | "xl";
    showLabel?: boolean;
}

export default function LeagueBadge({ league, size = "md", showLabel = false }: LeagueBadgeProps) {
    const isLegend = league.name === "Legend Fisika";
    const isMultiverse = league.name === "Multiverse";

    // Scale mapping
    const sizeMap = {
        sm: "w-8 h-8 text-[10px]",
        md: "w-16 h-16 text-xs",
        lg: "w-32 h-32 text-sm",
        xl: "w-48 h-48 text-base"
    };

    const containerSize = sizeMap[size].split(" ")[0]; // Extract w-xx

    return (
        <div className={`flex flex-col items-center justify-center ${showLabel ? 'gap-2' : ''}`}>
            <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
                {/* Glow Effect for High Tiers */}
                {(isLegend || isMultiverse) && (
                    <motion.div
                        className="absolute inset-0 rounded-full blur-xl opacity-50"
                        style={{ background: league.color }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                )}

                {/* Main Badge Body */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
                    <defs>
                        <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffd700" />
                            <stop offset="50%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#ffd700" />
                        </linearGradient>
                        <linearGradient id="multiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <mask id="badgeMask">
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                        </mask>
                    </defs>

                    {/* Outer Ring */}
                    <motion.circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={isLegend ? "url(#legendGrad)" : isMultiverse ? "url(#multiGrad)" : league.color}
                        strokeWidth="3"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Hexagon/Shape base */}
                    <path
                        d="M50 5 L95 27.5 V72.5 L50 95 L5 72.5 V27.5 Z"
                        fill={isLegend ? "url(#legendGrad)" : isMultiverse ? "url(#multiGrad)" : league.color}
                        opacity="0.2"
                    />

                    {/* Center Icon/Content */}
                    <text x="50" y="55" textAnchor="middle" fontSize="40" className="drop-shadow-md">
                        {league.icon}
                    </text>

                    {/* Legendary Shine */}
                    {isLegend && (
                        <motion.rect
                            x="-20" y="-20" width="140" height="10"
                            fill="white"
                            opacity="0.5"
                            initial={{ y: -50, rotate: 45 }}
                            animate={{ y: 150 }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    )}
                </svg>

                {/* Particle Effects for Legend */}
                {isLegend && (
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full"
                            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full"
                            animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        />
                    </div>
                )}
            </div>

            {showLabel && (
                <div className="text-center">
                    <div className={`font-bold uppercase tracking-wider ${isLegend ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-500 animate-pulse' : 'text-white'}`} style={{ color: isLegend ? undefined : league.color }}>
                        {league.name}
                    </div>
                    {isLegend && <div className="text-[10px] text-yellow-500 font-serif italic">The God Tier</div>}
                </div>
            )}
        </div>
    );
}
