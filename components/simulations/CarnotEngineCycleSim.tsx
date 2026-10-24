"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function CarnotEngineCycleSim() {
    const [efficiencyPercent, setEfficiencyPercent] = useState<number>(50); // %
    const [workJoules, setWorkJoules] = useState<number>(600); // J
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Physics
    const eta = efficiencyPercent / 100;
    const q1In = eta > 0 ? workJoules / eta : 0; // Heat in (J)
    const q2Out = Math.max(0, q1In - workJoules); // Heat wasted to environment (J)

    // Baseline at 30%
    const q1Initial = workJoules / 0.3; // 2000 J
    const q1SavedPercent = ((q1Initial - q1In) / q1Initial) * 100;

    useEffect(() => {
        let frame: number;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 640;
        const height = 310;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const render = () => {
            animRef.current += 0.03;
            ctx.clearRect(0, 0, width, height);

            // Background
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, width, height);

            // --- LEFT HALF: PV Indicator Diagram ---
            const gX = 60;
            const gY = 240;
            const gW = 220;
            const gH = 170;

            // Axes
            ctx.strokeStyle = "#64748b";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(gX, gY - gH);
            ctx.lineTo(gX, gY);
            ctx.lineTo(gX + gW, gY);
            ctx.stroke();

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("Tekanan P", gX - 6, gY - gH + 10);
            ctx.textAlign = "center";
            ctx.fillText("Volume V", gX + gW / 2, gY + 18);

            // 4 Points of Carnot Cycle (A, B, C, D)
            const pA = { x: gX + 35, y: gY - 140 }; // High P, low V
            const pB = { x: gX + 110, y: gY - 100 }; // Isothermal expansion
            const pC = { x: gX + 185, y: gY - 45 }; // Adiabatic expansion
            const pD = { x: gX + 100, y: gY - 65 }; // Isothermal compression

            // Cycle Area (Work W = 600 J) Shading
            ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.quadraticCurveTo((pA.x + pB.x) / 2, pA.y + 12, pB.x, pB.y);
            ctx.quadraticCurveTo((pB.x + pC.x) / 2, pB.y + 22, pC.x, pC.y);
            ctx.quadraticCurveTo((pC.x + pD.x) / 2, pC.y - 8, pD.x, pD.y);
            ctx.quadraticCurveTo((pD.x + pA.x) / 2, pD.y - 25, pA.x, pA.y);
            ctx.closePath();
            ctx.fill();

            // Cycle Outline with Arrows
            ctx.strokeStyle = "#a855f7";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Cycle Labels
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px monospace";
            ctx.fillText("A", pA.x - 10, pA.y - 2);
            ctx.fillText("B", pB.x + 8, pB.y - 6);
            ctx.fillText("C", pC.x + 10, pC.y + 4);
            ctx.fillText("D", pD.x - 10, pD.y + 8);

            ctx.fillStyle = "#facc15";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("Usaha W = 600 J", (pA.x + pC.x) / 2, (pA.y + pC.y) / 2 + 6);

            // --- RIGHT HALF: Sankey Heat Flow Energy Balance ---
            const sX = 350;
            const sY = 50;

            // Hot Reservoir T1 (Top)
            ctx.fillStyle = "#ef4444";
            ctx.roundRect(sX, sY, 230, 36, 6);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Reservoir Panas (T₁) | Q₁ Masuk = ${Math.round(q1In)} J`, sX + 115, sY + 22);

            // Heat In Arrow (Downward)
            drawArrow(ctx, sX + 115, sY + 36, sX + 115, sY + 95, "#ef4444");

            // Heat Engine Cylinder (Center)
            ctx.fillStyle = "#1e293b";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sX + 115, sY + 125, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("MESIN", sX + 115, sY + 122);
            ctx.fillText(`η = ${efficiencyPercent}%`, sX + 115, sY + 136);

            // Work Arrow Out (Right)
            drawArrow(ctx, sX + 145, sY + 125, sX + 225, sY + 125, "#22c55e");
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`W = ${workJoules} J`, sX + 230, sY + 130);

            // Waste Heat Arrow Out (Down)
            drawArrow(ctx, sX + 115, sY + 155, sX + 115, sY + 205, "#38bdf8");

            // Cold Reservoir T2 (Bottom)
            ctx.fillStyle = "#0284c7";
            ctx.roundRect(sX, sY + 205, 230, 36, 6);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Reservoir Dingin (T₂) | Q₂ Lepas = ${Math.round(q2Out)} J`, sX + 115, sY + 227);

            // Live Efficiency comparison badge
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = efficiencyPercent === 50 ? "#22c55e" : "#eab308";
            ctx.lineWidth = 1;
            ctx.roundRect(sX, sY + 250, 230, 28, 6);
            ctx.fill();
            ctx.stroke();

            ctx.font = "bold 10px sans-serif";
            ctx.fillStyle = efficiencyPercent === 50 ? "#4ade80" : "#facc15";
            ctx.fillText(
                efficiencyPercent === 50
                    ? `🎉 Hemat Kalor Masuk: 40% LEBIH SEDIKIT!`
                    : `Efisiensi Awal: Butuh Q₁ = 2000 J`,
                sX + 115,
                sY + 268
            );

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [efficiencyPercent, workJoules, q1In, q2Out]);

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 7;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚙️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Mesin Kalor Carnot & Analisis Penghematan Kalor
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 21 TKA 2025: W = 600 J, Efisiensi 30% &rarr; 50%
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setEfficiencyPercent(30)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            efficiencyPercent === 30
                                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Tahap Awal (η = 30%)
                    </button>
                    <button
                        onClick={() => setEfficiencyPercent(50)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            efficiencyPercent === 50
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Setelah Diperbaiki (η = 50%)
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Efisiensi Mesin (η)</span>
                        <span className="font-mono text-cyan-400 font-bold">{efficiencyPercent}%</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="70"
                        step="5"
                        value={efficiencyPercent}
                        onChange={(e) => setEfficiencyPercent(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>20%</span>
                        <span className="text-amber-400 font-bold">30% (Awal)</span>
                        <span className="text-emerald-400 font-bold">50% (Hasil Perbaikan)</span>
                        <span>70%</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Usaha yang Dihasilkan Tiap Siklus (W)</span>
                        <span className="font-mono text-green-400 font-bold">{workJoules} Joule</span>
                    </div>
                    <input
                        type="range"
                        min="300"
                        max="1200"
                        step="100"
                        value={workJoules}
                        onChange={(e) => setWorkJoules(parseInt(e.target.value))}
                        className="w-full accent-green-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                        Usaha konstan W = 600 Joule sesuai ketentuan soal TKA.
                    </div>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 21 TKA (Kebutuhan Kalor Masuk Mesin Kalor):
                </strong>
                <p>Efisiensi mesin kalor didefinisikan sebagai:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    η = W / Q1  ⟹  Q1 = W / η
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-1">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-amber-300 font-bold">1. Tahap Awal (η₁ = 30% = 0,3):</span>
                        <p className="mt-1 font-mono text-[11px]">
                            Q₁ = 600 / 0,3 = <strong>2.000 Joule</strong>
                        </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-emerald-300 font-bold">2. Setelah Diperbaiki (η₂ = 50% = 0,5):</span>
                        <p className="mt-1 font-mono text-[11px]">
                            Q₁&apos; = 600 / 0,5 = <strong>1.200 Joule</strong>
                        </p>
                    </div>
                </div>
                <p>Pengurangan kebutuhan kalor masuk:</p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    ΔQ1 = 2.000 - 1.200 = 800 J  ⟹  % = (800 / 2.000) × 100% = 40% lebih sedikit (Jawaban B)
                </div>
            </div>
        </div>
    );
}
