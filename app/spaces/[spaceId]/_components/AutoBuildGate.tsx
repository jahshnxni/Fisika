"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle, RefreshCw, BookOpen, Layers, Brain, Sparkles, Cpu } from "lucide-react";

type BuildStatus = "NEVER_BUILT" | "QUEUED" | "PROCESSING" | "READY" | "ERROR";

interface StatusRes {
    buildStatus: BuildStatus;
    buildStep?: string | null;
    buildProgress: number;
    buildError?: string | null;
}

const STEP_CONFIG: Record<string, { label: string; icon: typeof Brain }> = {
    PARSING: { label: "Membaca & mengekstrak teks PDF...", icon: BookOpen },
    SEGMENTING: { label: "Memisahkan soal & mendeteksi jenis dokumen...", icon: Layers },
    CLASSIFYING: { label: "Mengklasifikasi topik & mata pelajaran...", icon: Brain },
    GENERATING: { label: "AI sedang membangun materi & soal bertingkat...", icon: Sparkles },
    FINALIZING: { label: "Menyimpan & memfinalisasi kursus...", icon: Cpu },
};

export default function AutoBuildGate({
    spaceId,
    children
}: {
    spaceId: string;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [status, setStatus] = useState<StatusRes | null>(null);
    const [showChildren, setShowChildren] = useState(false);
    const startedRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    async function fetchStatus(): Promise<StatusRes | null> {
        try {
            const r = await fetch(`/api/spaces/${spaceId}/status`, { cache: "no-store" });
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    async function triggerBuild() {
        if (startedRef.current) return;
        startedRef.current = true;
        try { await fetch(`/api/spaces/${spaceId}/build`, { method: "POST" }); } catch { /* ignore */ }
    }

    useEffect(() => {
        let mounted = true;

        async function init() {
            const s = await fetchStatus();
            if (!mounted) return;
            setStatus(s);

            if (s?.buildStatus === "READY") {
                setShowChildren(true);
                return;
            }

            // Auto-start if not already building
            if (!s || s.buildStatus === "NEVER_BUILT" || s.buildStatus === "ERROR") {
                await triggerBuild();
            }

            // Start polling every 2s
            timerRef.current = setInterval(async () => {
                const next = await fetchStatus();
                if (!mounted) return;
                setStatus(next);

                if (next?.buildStatus === "READY") {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    // Refresh server components to get fresh data, then show children
                    router.refresh();
                    setTimeout(() => setShowChildren(true), 600);
                } else if (next?.buildStatus === "ERROR") {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                }
            }, 2000);
        }

        init();
        return () => {
            mounted = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [spaceId]);

    // Ready state
    if (showChildren) return <>{children}</>;

    // Error state
    if (status?.buildStatus === "ERROR") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center max-w-md mx-auto p-8 bg-red-900/20 border border-red-500/30 rounded-2xl">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">Gagal Membangun Kursus</h3>
                    <p className="text-red-200 text-sm mb-6 font-mono">{status.buildError || "Terjadi kesalahan tidak diketahui"}</p>
                    <button
                        onClick={async () => {
                            startedRef.current = false;
                            setStatus({ buildStatus: "QUEUED", buildProgress: 0 });
                            await triggerBuild();
                            // Re-start polling
                            timerRef.current = setInterval(async () => {
                                const next = await fetchStatus();
                                setStatus(next);
                                if (next?.buildStatus === "READY") {
                                    clearInterval(timerRef.current!);
                                    router.refresh();
                                    setTimeout(() => setShowChildren(true), 600);
                                } else if (next?.buildStatus === "ERROR") {
                                    clearInterval(timerRef.current!);
                                }
                            }, 2000);
                        }}
                        className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Coba Lagi Otomatis
                    </button>
                </div>
            </div>
        );
    }

    // Loading / building state
    const step = status?.buildStep || "PARSING";
    const progress = status?.buildProgress || 0;
    const stepInfo = STEP_CONFIG[step] || STEP_CONFIG.PARSING;
    const StepIcon = stepInfo.icon;
    const allSteps = Object.keys(STEP_CONFIG);
    const currentIdx = allSteps.indexOf(step);

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                        <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
                        <div className="relative bg-violet-600/30 rounded-full p-5 border border-violet-500/40">
                            <StepIcon className="w-10 h-10 text-violet-400 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">AI Sedang Membangun Kursus</h2>
                    <p className="text-slate-400 text-sm">Tidak perlu klik apapun — halaman akan update otomatis ✨</p>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span className="text-slate-300">{stepInfo.label}</span>
                        <span className="font-mono text-violet-400 font-bold">{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.max(6, progress)}%` }}
                        />
                    </div>
                </div>

                {/* Step list */}
                <div className="space-y-1.5">
                    {allSteps.map((s, i) => {
                        const cfg = STEP_CONFIG[s];
                        const Icon = cfg.icon;
                        const isDone = i < currentIdx;
                        const isActive = i === currentIdx;
                        return (
                            <div key={s} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-violet-500/10 border border-violet-500/20" : isDone ? "opacity-60" : "opacity-20"}`}>
                                <div className={`shrink-0 ${isDone ? "text-green-400" : isActive ? "text-violet-400" : "text-slate-600"}`}>
                                    {isDone
                                        ? <CheckCircle2 className="w-4 h-4" />
                                        : isActive
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={`text-sm ${isActive ? "text-white font-medium" : isDone ? "text-green-300" : "text-slate-600"}`}>
                                    {cfg.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Kamu boleh meninggalkan halaman ini. Kembali setelah beberapa saat dan materi sudah siap.
                </p>
            </div>
        </div>
    );
}
