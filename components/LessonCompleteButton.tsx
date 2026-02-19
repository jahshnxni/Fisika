"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { markLessonComplete } from "@/lib/actions";
import { Button } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";

export default function LessonCompleteButton({ lessonId }: { lessonId: string }) {
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleComplete = async () => {
        setLoading(true);
        await markLessonComplete(lessonId);
        setDone(true);
        setLoading(false);
        router.refresh();
    };

    if (done) {
        return (
            <div className="flex items-center gap-2 text-green-400 font-bold animate-in fade-in">
                <CheckCircle className="w-5 h-5" />
                <span>Materi Selesai! +10 XP</span>
            </div>
        );
    }

    return (
        <Button
            onClick={handleComplete}
            disabled={loading}
            variant="secondary"
            className="flex items-center gap-2 px-6 py-3"
        >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? "Menyimpan..." : "Tandai Selesai"}</span>
        </Button>
    );
}
