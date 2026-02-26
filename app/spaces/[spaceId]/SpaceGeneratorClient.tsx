"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Brain, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export default function SpaceGeneratorClient({ spaceId }: { spaceId: string }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const steps = [
        { icon: Brain, title: "Engine 1: Membaca PDF", desc: "Mengekstrak teks, rumus, dan mengenali topik." },
        { icon: BookOpen, title: "Engine 2: Ekstraksi Topik", desc: "Membangun Peta Konsep (Concept Graph) dari PDF." },
        { icon: Layers, title: "Engine 2: Menyusun Silabus", desc: "Merancang kerangka materi dari dasar hingga kompleks." },
        { icon: CheckCircle2, title: "Engine 3: Finalisasi UI", desc: "Memilih tema dan menyusun gaya antarmuka kursus." },
    ];

    useEffect(() => {
        // Trigger the generation API
        const generateCourse = async () => {
            try {
                // Mocking step progression for MVP frontend feel
                // In production, this would be a real SSE stream or polling
                const interval = setInterval(() => {
                    setStep(s => {
                        if (s >= 3) {
                            clearInterval(interval);
                            return 3;
                        }
                        return s + 1;
                    });
                }, 3000);

                const res = await fetch(`/api/ai/generate-space`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ spaceId })
                });

                clearInterval(interval);

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Gagal membangun kursus dari PDF ini");
                }

                setStep(4); // Fully done

                // Redirect to refresh the layout
                setTimeout(() => {
                    router.refresh();
                }, 1000);

            } catch (e: any) {
                console.error(e);
                setError(e.message);
            }
        };

        generateCourse();
    }, [spaceId, router]);

    return (
        <div className="max-w-xl w-full mx-auto bg-cosmic-900 border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                AI Sedang Membangun Kursus...
            </h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-200 mb-8 text-center text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {steps.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = step === i;
                    const isDone = step > i;

                    return (
                        <div key={i} className={`flex items-start gap-4 transition-all duration-500 ${!isActive && !isDone ? "opacity-30 grayscale" : "opacity-100"}`}>
                            <div className={`p-3 rounded-full shrink-0 ${isDone ? "bg-green-500/20 text-green-400" : isActive ? "bg-accent/20 text-accent animate-pulse" : "bg-slate-800 text-slate-400"}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDone ? "text-green-400" : isActive ? "text-white" : "text-slate-400"}`}>
                                    {s.title}
                                </h3>
                                <p className="text-sm text-slate-400">{s.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">Proses ini dapat memakan waktu hingga satu menit. Mohon jangan tutup halaman ini.</p>
            </div>
        </div>
    );
}
