"use client";

import dynamic from "next/dynamic";

const StudyCompanion = dynamic(() => import("@/components/3d/StudyCompanion"), { ssr: false });

interface LessonCompanionProps {
    topic: string;
    skillTitle: string;
}

export default function LessonCompanion({ topic, skillTitle }: LessonCompanionProps) {
    return (
        <div className="fixed bottom-28 right-4 z-30 hidden md:block">
            <StudyCompanion
                topic={topic}
                action="idle"
                size="small"
                showBubble
                message={`Semangat belajar ${skillTitle}! 📚`}
            />
        </div>
    );
}
