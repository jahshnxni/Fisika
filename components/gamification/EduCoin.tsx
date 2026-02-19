import React from "react";

interface EduCoinProps {
    className?: string; // For sizing (w-8 h-8 etc)
}

export default function EduCoin({ className = "w-8 h-8" }: EduCoinProps) {
    return (
        <div className={`relative inline-block ${className} group`}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md transform transition-transform group-hover:scale-110 duration-300"
            >
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" /> {/* yellow-200 */}
                        <stop offset="30%" stopColor="#eab308" /> {/* yellow-500 */}
                        <stop offset="70%" stopColor="#ca8a04" /> {/* yellow-600 */}
                        <stop offset="100%" stopColor="#854d0e" /> {/* yellow-800 */}
                    </linearGradient>
                    <linearGradient id="shine" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Outer Ring */}
                <circle cx="32" cy="32" r="30" fill="url(#goldGradient)" stroke="#854d0e" strokeWidth="2" />
                <circle cx="32" cy="32" r="26" fill="transparent" stroke="#fef08a" strokeWidth="1" opacity="0.5" />

                {/* Inner Face */}
                <circle cx="32" cy="32" r="24" fill="#eab308" className="inner-face" />

                {/* Detail Pattern (Circuit/Tech) - Nanobanana style interpreted as Nano-Tech */}
                <path d="M32 8 V20 M32 44 V56 M8 32 H20 M44 32 H56" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="32" r="12" fill="none" stroke="#fef08a" strokeWidth="2" />

                {/* Symbol "E" (Edu) */}
                <text x="32" y="42" fontSize="24" fontWeight="900" textAnchor="middle" fill="#fef08a" style={{ fontFamily: "sans-serif", filter: "drop-shadow(1px 1px 0px #854d0e)" }}>
                    E
                </text>

                {/* Shine Animation */}
                <rect x="0" y="0" width="64" height="64" fill="url(#shine)" className="animate-shine opacity-0 group-hover:opacity-100" style={{ mixBlendMode: 'overlay' }} />
            </svg>

            {/* Sparkles */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full blur-[1px] animate-ping opacity-0 group-hover:opacity-100" />
        </div>
    );
}
