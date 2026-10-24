"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function GasIdealCylinderSim() {
    const [volumeL, setVolumeL] = useState<number>(1.0); // Liter
    const [tempK, setTempK] = useState<number>(600); // Kelvin
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Array<{ x: number, y: number, vx: number, vy: number }>>([]);

    // Physics (P1 = 1 atm, V1 = 2 L, T1 = 300 K)
    // P2 = P1 * (V1 / V2) * (T2 / T1) = 1 * (2 / V2) * (T2 / 300)
    const pressureAtm = (2.0 / volumeL) * (tempK / 300.0);

    // Initialize gas particles
    useEffect(() => {
        const parts = [];
        for (let i = 0; i < 40; i++) {
            parts.push({
                x: 100 + Math.random() * 180,
                y: 120 + Math.random() * 80,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
            });
        }
        particlesRef.current = parts;
    }, []);

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
            ctx.clearRect(0, 0, width, height);

            // Lab Background
            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#090d16");
            bg.addColorStop(1, "#172554");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Cylinder bounds
            // Width represents volume (1 L = 80px, 2 L = 160px, 3 L = 240px)
            const cylLeft = 80;
            const cylTop = 80;
            const cylH = 150;
            const cylWMax = 280; // 3.5 L
            const pistonX = cylLeft + volumeL * 80;

            // Cylinder chamber wall
            ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
            ctx.fillRect(cylLeft, cylTop, cylWMax, cylH);
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cylLeft + cylWMax, cylTop);
            ctx.lineTo(cylLeft, cylTop);
            ctx.lineTo(cylLeft, cylTop + cylH);
            ctx.lineTo(cylLeft + cylWMax, cylTop + cylH);
            ctx.stroke();

            // Heater under cylinder
            const heatColor = tempK >= 500 ? "#ef4444" : tempK >= 400 ? "#f97316" : "#38bdf8";
            ctx.fillStyle = heatColor;
            ctx.fillRect(cylLeft + 20, cylTop + cylH + 10, pistonX - cylLeft - 40, 8);
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Pemanas Suhu: T = ${tempK} K`, (cylLeft + pistonX) / 2, cylTop + cylH + 32);

            // Bouncing Gas Particles
            const speedScale = Math.sqrt(tempK / 300);
            ctx.fillStyle = heatColor;

            for (const p of particlesRef.current) {
                p.x += p.vx * speedScale;
                p.y += p.vy * speedScale;

                // Bounce off left wall
                if (p.x <= cylLeft + 8) {
                    p.x = cylLeft + 8;
                    p.vx = Math.abs(p.vx);
                }
                // Bounce off piston
                if (p.x >= pistonX - 8) {
                    p.x = pistonX - 8;
                    p.vx = -Math.abs(p.vx);
                }
                // Bounce off top/bottom
                if (p.y <= cylTop + 8) {
                    p.y = cylTop + 8;
                    p.vy = Math.abs(p.vy);
                }
                if (p.y >= cylTop + cylH - 8) {
                    p.y = cylTop + cylH - 8;
                    p.vy = -Math.abs(p.vy);
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Movable Piston Head
            ctx.fillStyle = "#94a3b8";
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 2;
            ctx.fillRect(pistonX - 10, cylTop + 2, 20, cylH - 4);
            ctx.strokeRect(pistonX - 10, cylTop + 2, 20, cylH - 4);

            // Piston Rod
            ctx.fillStyle = "#64748b";
            ctx.fillRect(pistonX + 10, cylTop + cylH / 2 - 8, 80, 16);

            // Volume label on gas chamber
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText(`V = ${volumeL.toFixed(1)} Liter`, (cylLeft + pistonX) / 2, cylTop - 12);

            // Manometer Pressure Gauge attached to cylinder
            drawManometerGauge(ctx, cylLeft + 35, cylTop - 40, pressureAtm);

            // --- HUD Box (Right Side) ---
            const hudX = width - 190;
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.roundRect(hudX - 10, 25, 180, 255, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("HUKUM BOYLE-GAY LUSSAC:", hudX, 48);

            ctx.font = "10px monospace";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("Kondisi Awal (1):", hudX, 72);
            ctx.fillText("  V₁ = 2 Liter", hudX, 88);
            ctx.fillText("  T₁ = 300 Kelvin", hudX, 104);
            ctx.fillText("  P₁ = 1 atmosfer", hudX, 120);

            ctx.strokeStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(hudX, 132);
            ctx.lineTo(hudX + 155, 132);
            ctx.stroke();

            ctx.fillStyle = "#38bdf8";
            ctx.fillText("Kondisi Akhir (2):", hudX, 150);
            ctx.fillText(`  V₂ = ${volumeL.toFixed(1)} Liter`, hudX, 166);
            ctx.fillText(`  T₂ = ${tempK} Kelvin`, hudX, 182);

            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("Tekanan Akhir P₂:", hudX, 210);
            ctx.font = "bold 18px monospace";
            ctx.fillText(`${pressureAtm.toFixed(1)} atm`, hudX, 234);

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "9px sans-serif";
            ctx.fillText("P₁V₁/T₁ = P₂V₂/T₂", hudX, 258);

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [volumeL, tempK, pressureAtm]);

    function drawManometerGauge(ctx: CanvasRenderingContext2D, gx: number, gy: number, press: number) {
        // Dial Face
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(gx, gy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Needle angle: 0 atm = -135 deg, 6 atm = +135 deg
        const needleAngle = -0.75 * Math.PI + (press / 6) * 1.5 * Math.PI;
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + 18 * Math.cos(needleAngle), gy + 18 * Math.sin(needleAngle));
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BAR", gx, gy + 15);
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">💨</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Gas Ideal & Tabung Pemampatan (Boyle-Gay Lussac)
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 20 TKA 2025: V₁=2L, T₁=300K, P₁=1 atm &rarr; V₂=1L, T₂=600K
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setVolumeL(2.0); setTempK(300); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            volumeL === 2.0 && tempK === 300
                                ? 'bg-sky-600/30 border-sky-500 text-sky-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Kondisi Awal (1 atm)
                    </button>
                    <button
                        onClick={() => { setVolumeL(1.0); setTempK(600); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            volumeL === 1.0 && tempK === 600
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Soal 20: V=1L, T=600K (4 atm)
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
                        <span className="font-semibold text-slate-300">Volume Tabung Gas (V)</span>
                        <span className="font-mono text-cyan-400 font-bold">{volumeL.toFixed(1)} Liter</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={volumeL}
                        onChange={(e) => setVolumeL(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>0.5 L</span>
                        <span className="text-emerald-400 font-bold">1.0 L (Dimampatkan)</span>
                        <span>2.0 L (Awal)</span>
                        <span>3.0 L</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Suhu Gas Ideal (T)</span>
                        <span className="font-mono text-amber-400 font-bold">{tempK} Kelvin</span>
                    </div>
                    <input
                        type="range"
                        min="200"
                        max="800"
                        step="25"
                        value={tempK}
                        onChange={(e) => setTempK(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>200 K</span>
                        <span>300 K (Awal)</span>
                        <span className="text-emerald-400 font-bold">600 K (2× Semula)</span>
                        <span>800 K</span>
                    </div>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 20 TKA (Tekanan Akhir Gas Ideal):
                </strong>
                <p>
                    Sesuai Persamaan Keadaan Gas Ideal Boyle-Gay Lussac dalam tabung tertutup:
                </p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    (P1 · V1) / T1 = (P2 · V2) / T2  ⟹  P2 = P1 × (V1 / V2) × (T2 / T1)
                </div>
                <p>
                    Diketahui: P1 = 1 atm, V1 = 2 L, V2 = 1 L, T1 = 300 K, dan T2 = 2 T1 = 600 K:
                </p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    P2 = 1 × (2 / 1) × (600 / 300) = 1 × 2 × 2 = 4 atmosfer (Jawaban D)
                </div>
            </div>
        </div>
    );
}
