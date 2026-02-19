"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { CharacterAction } from "./JuniorPhysicist";

// Dynamic imports — ssr:false is valid here because this IS a client component
const CanvasWrapper = dynamic(() => import("./CanvasWrapper"), { ssr: false });
const SceneLights = dynamic(() => import("./SceneLights"), { ssr: false });
const JuniorPhysicist = dynamic(() => import("./JuniorPhysicist"), { ssr: false });
const PetRenderer = dynamic(() => import("./PetRenderer"), { ssr: false });

// ─── Speech Bubble Messages ───
const MESSAGES: Record<CharacterAction, string[]> = {
    idle: [
        "Ayo belajar fisika! 🔬",
        "Siap-siap yuk! 📚",
        "Kamu pasti bisa! 💪",
        "Halo, temukan hal baru! ✨",
    ],
    cheer: [
        "BENAR! Keren banget! 🎉",
        "Jawaban tepat! Lanjut! 🥳",
        "Hebat! XP +10! ⚡",
        "Mantap! Terus semangat! 🌟",
    ],
    think: [
        "Hmm, pikirkan baik-baik... 🤔",
        "Baca soalnya teliti ya! 📖",
        "Coba ingat rumusnya... 💭",
        "Pelan-pelan, pasti bisa! 🧐",
    ],
    celebrate: [
        "SELESAI! Kamu luar biasa! 🏆",
        "Misi tercapai! 🎊",
        "Level up! Kamu hebat! 🚀",
        "Sempurna! 100%! 💯",
    ],
    wave: [
        "Hai! Selamat datang! 👋",
        "Senang ketemu kamu lagi! 😊",
        "Ayo mulai petualangan! 🌈",
    ],
    sad: [
        "Jangan menyerah ya... 😢",
        "Coba lagi, pasti bisa! 💙",
        "Salah gapapa, namanya belajar! 📝",
        "Semangat, kamu hebat! 🤗",
    ],
};

// ─── Topic to Pet type ───
function topicToPet(topic?: string): string {
    if (!topic) return "aqua_cat";
    const lower = topic.toLowerCase();
    if (lower.includes("fluida") || lower.includes("tekanan") || lower.includes("archimedes") || lower.includes("pascal")) return "aqua_cat";
    if (lower.includes("kalor") || lower.includes("suhu") || lower.includes("perpindahan")) return "flame_fox";
    if (lower.includes("thermo") || lower.includes("gas") || lower.includes("termodinamika")) return "spark_owl";
    return "aqua_cat";
}

// ─── Types ───
interface StudyCompanionProps {
    topic?: string;
    action?: CharacterAction;
    size?: "small" | "medium" | "large";
    skin?: string;
    petType?: string;
    showBubble?: boolean;
    message?: string;
}

export default function StudyCompanion({
    topic,
    action = "idle",
    size = "medium",
    skin,
    petType,
    showBubble = true,
    message,
}: StudyCompanionProps) {
    const resolvedPet = petType || topicToPet(topic);

    const dimensions = (() => {
        switch (size) {
            case "small": return { width: "8rem", height: "10rem", cameraZ: 5.5, fov: 45 };
            case "large": return { width: "18rem", height: "22rem", cameraZ: 4, fov: 50 };
            default: return { width: "12rem", height: "15rem", cameraZ: 4.5, fov: 48 };
        }
    })();

    const bubbleMessage = (() => {
        if (message) return message;
        const pool = MESSAGES[action] || MESSAGES.idle;
        return pool[Math.floor(Math.random() * pool.length)];
    })();

    return (
        <div className="relative flex flex-col items-center select-none pointer-events-auto">
            {/* Speech Bubble */}
            {showBubble && (
                <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 bg-cosmic-800/90 backdrop-blur-sm border border-cosmic-600 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ maxWidth: "14rem" }}
                >
                    <span className="truncate block">{bubbleMessage}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-cosmic-700" />
                </div>
            )}

            {/* 3D Scene */}
            <div style={{ width: dimensions.width, height: dimensions.height }} className="relative">
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    }
                >
                    <CanvasWrapper cameraPosition={[0, 0.5, dimensions.cameraZ]} fov={dimensions.fov}>
                        <SceneLights />
                        <JuniorPhysicist skin={skin} topic={topic} action={action} />
                        <group position={[1.0, -0.3, 0.4]}>
                            <PetRenderer type={resolvedPet} action={action} />
                        </group>
                    </CanvasWrapper>
                </Suspense>
            </div>
        </div>
    );
}
