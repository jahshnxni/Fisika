"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function MotionGraphRaceSim() {
    const [timeSec, setTimeSec] = useState<number>(5);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics parameters matching TKA Soal 3 & 4
    // Car A: v0 = 0 m/s, at t=5s v=25 m/s -> aA = 5 m/s^2
    const aA = 5;
    const vA = aA * timeSec;
    const sA = 0.5 * aA * timeSec * timeSec;

    // Car B: v0 = 15 m/s, at t=5s v=25 m/s -> aB = 2 m/s^2
    const v0B = 15;
    const aB = 2;
    const vB = v0B + aB * timeSec;
    const sB = v0B * timeSec + 0.5 * aB * timeSec * timeSec;

    // Overtake condition: sA = sB -> 2.5 t^2 = 15 t + t^2 -> 1.5 t^2 - 15 t = 0 -> t = 10 s, s = 250 m
    const isOvertake = Math.abs(timeSec - 10) < 0.15;
    const isSameSpeed = Math.abs(timeSec - 5) < 0.15;

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            timer = setInterval(() => {
                setTimeSec(prev => {
                    if (prev >= 12) {
                        setIsPlaying(false);
                        return 12;
                    }
                    return parseFloat((prev + 0.05).toFixed(2));
                });
            }, 50);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 640;
        const height = 330;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);

        // --- SECTION 1: Dual Lane Race Track (Top 120px) ---
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(20, 20, width - 40, 100);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, width - 40, 100);

        // Lane divider dashed line
        ctx.strokeStyle = "#94a3b8";
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(20, 70);
        ctx.lineTo(width - 20, 70);
        ctx.stroke();
        ctx.setLineDash([]);

        // Distance markers
        ctx.fillStyle = "#64748b";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        const maxDistM = 320;
        for (let m = 0; m <= maxDistM; m += 50) {
            const rx = 30 + (m / maxDistM) * (width - 80);
            ctx.fillText(`${m}m`, rx, 115);
            ctx.strokeStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(rx, 22);
            ctx.lineTo(rx, 106);
            ctx.stroke();
        }

        // Draw Finish / 250m line
        const x250 = 30 + (250 / maxDistM) * (width - 80);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x250, 20);
        ctx.lineTo(x250, 120);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("250m (Titik Salip)", x250, 15);

        // Car A (Cyan - Top Lane)
        const carAX = Math.min(30 + (sA / maxDistM) * (width - 80), width - 50);
        drawCar(ctx, carAX, 45, "#38bdf8", "A (Rafi)");

        // Car B (Orange - Bottom Lane)
        const carBX = Math.min(30 + (sB / maxDistM) * (width - 80), width - 50);
        drawCar(ctx, carBX, 90, "#fb923c", "B (Dion)");

        // --- SECTION 2: Dynamic v-t Graph (Bottom 180px) ---
        const gX = 70;
        const gY = 300;
        const gW = 260;
        const gH = 140;

        // Graph Axes
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
        ctx.fillText("v (m/s)", gX - 10, gY - gH + 10);
        ctx.textAlign = "center";
        ctx.fillText("t (detik)", gX + gW / 2, gY + 22);

        // Ticks on Graph
        const maxV = 40;
        const maxT = 12;

        ctx.font = "9px monospace";
        ctx.fillStyle = "#94a3b8";
        // v = 15, 25
        const y15 = gY - (15 / maxV) * gH;
        const y25 = gY - (25 / maxV) * gH;
        ctx.fillText("15", gX - 8, y15 + 3);
        ctx.fillText("25", gX - 8, y25 + 3);

        ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(gX, y25);
        ctx.lineTo(gX + gW, y25);
        ctx.stroke();

        // t = 5, 10
        const x5 = gX + (5 / maxT) * gW;
        const x10 = gX + (10 / maxT) * gW;
        ctx.fillText("5", x5, gY + 12);
        ctx.fillText("10", x10, gY + 12);

        ctx.beginPath();
        ctx.moveTo(x5, gY);
        ctx.lineTo(x5, y25);
        ctx.stroke();
        ctx.setLineDash([]);

        // Plot Line Car A (v = 5t)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(gX, gY);
        const curLineAX = gX + (Math.min(timeSec, maxT) / maxT) * gW;
        const curLineAY = gY - (Math.min(vA, maxV) / maxV) * gH;
        ctx.lineTo(curLineAX, curLineAY);
        ctx.stroke();

        // Plot Line Car B (v = 15 + 2t)
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(gX, y15);
        const curLineBX = gX + (Math.min(timeSec, maxT) / maxT) * gW;
        const curLineBY = gY - (Math.min(vB, maxV) / maxV) * gH;
        ctx.lineTo(curLineBX, curLineBY);
        ctx.stroke();

        // Intersection Point at t=5s
        if (timeSec >= 5) {
            ctx.fillStyle = "#ec4899";
            ctx.beginPath();
            ctx.arc(x5, y25, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Live point dot Car A
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(curLineAX, curLineAY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Live point dot Car B
        ctx.fillStyle = "#fb923c";
        ctx.beginPath();
        ctx.arc(curLineBX, curLineBY, 4, 0, Math.PI * 2);
        ctx.fill();

        // --- SECTION 3: Live Stats Table (Right side of graph) ---
        const statX = gX + gW + 25;
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1;
        ctx.roundRect(statX, 150, width - statX - 20, 160, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`Waktu: t = ${timeSec.toFixed(1)} detik`, statX + 15, 175);

        // Car A stats
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("Mobil A (Rafi):", statX + 15, 200);
        ctx.font = "11px monospace";
        ctx.fillText(`v_A = ${vA.toFixed(1)} m/s`, statX + 20, 218);
        ctx.fillText(`s_A = ${sA.toFixed(1)} m`, statX + 20, 234);

        // Car B stats
        ctx.fillStyle = "#fb923c";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("Mobil B (Dion):", statX + 15, 260);
        ctx.font = "11px monospace";
        ctx.fillText(`v_B = ${vB.toFixed(1)} m/s`, statX + 20, 278);
        ctx.fillText(`s_B = ${sB.toFixed(1)} m`, statX + 20, 294);
    }, [timeSec, sA, sB, vA, vB]);

    function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
        ctx.save();
        ctx.translate(x, y);

        // Car Body
        ctx.fillStyle = color;
        ctx.roundRect(-20, -10, 40, 20, 5);
        ctx.fill();

        // Roof / Windows
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(-8, -8, 16, 16);

        // Headlights
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(18, -8, 3, 5);
        ctx.fillRect(18, 3, 3, 5);

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, 0, -14);

        ctx.restore();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🏎️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Uji Coba Mobil & Interpretasi Grafik v-t
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 3 & 4 TKA 2025: Mobil A & Mobil B
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTimeSec(5)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSameSpeed
                                ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Detik ke-5 (Soal 3)
                    </button>
                    <button
                        onClick={() => setTimeSec(10)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isOvertake
                                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Menyusul di 250m (Soal 4)
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold transition-all shadow"
                    >
                        {isPlaying ? "Jeda ⏸" : "Putar Balapan ▶"}
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Time Slider */}
            <div className="mt-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-300">Geser Garis Waktu Balapan:</span>
                    <span className="font-mono text-violet-400 font-bold text-sm">{timeSec.toFixed(1)} detik</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.1"
                    value={timeSec}
                    onChange={(e) => setTimeSec(parseFloat(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>t = 0 (Start bersamaan)</span>
                    <span className="text-pink-400 font-bold">t = 5s (v_A = v_B = 25 m/s)</span>
                    <span className="text-amber-400 font-bold">t = 10s (Salip di 250m)</span>
                    <span>t = 12s</span>
                </div>
            </div>

            {/* TKA Answers Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                <div className={`p-3.5 rounded-xl border ${
                    isSameSpeed ? 'bg-pink-950/40 border-pink-700/50 text-pink-200' : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                }`}>
                    <strong className="block text-pink-400 mb-1 font-bold">🎯 Analisis Soal No. 3 TKA (Kondisi di Detik ke-5):</strong>
                    <p className="leading-relaxed">
                        Grafik garis mobil A dan B berpotongan tepat di titik (t = 5 s, v = 25 m/s).
                        Artinya: <strong>Pada detik ke-5, kecepatan kedua mobil tepat sama (Jawaban D)</strong>! Posisi keduanya belum sama karena luas area di bawah grafik mobil B (125 m) masih lebih besar dari mobil A (100 m).
                    </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                    isOvertake ? 'bg-amber-950/40 border-amber-700/50 text-amber-200' : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                }`}>
                    <strong className="block text-amber-400 mb-1 font-bold">🎯 Analisis Soal No. 4 TKA (Jarak Mobil A Menyusul Mobil B):</strong>
                    <p className="leading-relaxed">
                        Mobil A menyusul saat jarak tempuh keduanya sama (sA = sB):
                    </p>
                    <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700 my-1">
                        15t + t² = 25t  ⟹  t² - 10t = 0  ⟹  t = 10 detik
                    </div>
                    <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                        s = 25 m/s × 10 s = 250 meter (Jawaban C)
                    </div>
                </div>
            </div>
        </div>
    );
}
