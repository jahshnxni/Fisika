"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";

export default function RebuildButton({ spaceId }: { spaceId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleRebuild = async () => {
        if (!confirm("Bangun ulang kursus ini? Data lama akan diganti dengan hasil AI terbaru.")) return;
        setLoading(true);
        try {
            // First reset isGenerated so the generator loading screen shows
            await fetch(`/api/ai/generate-space`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spaceId, force: true }),
            });
            setDone(true);
            router.refresh();
        } catch (e) {
            alert("Gagal membangun ulang. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRebuild}
            disabled={loading || done}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {done ? "Selesai! Memuat ulang..." : loading ? "Membangun ulang..." : "Bangun Ulang Kursus"}
        </button>
    );
}
