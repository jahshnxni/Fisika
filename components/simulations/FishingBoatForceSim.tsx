"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function FishingBoatForceSim() {
    const [forceN, setForceN] = useState<number>(300); // N
    const [massKg, setMassKg] = useState<number>(150); // kg
    const [durationSec, setDurationSec] = useState<number>(4); // s
    const [currentTime, setCurrentTime] = useState<number>(4); // s
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics
    const vy = 6; // constant northward speed m/s
    const ax = currentTime <= durationSec ? forceN / massKg : 0;
    const effectiveTime = Math.min(currentTime, durationSec);
    const vx = (forceN / massKg) * effectiveTime;
    const vResultant = Math.sqrt(vx * vx + vy * vy);
    const angleRad = Math.atan2(vx, vy);
    const angleDeg = (angleRad * 180) / Math.PI;

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            timer = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= 8) {
                        setIsPlaying(false);
                        return 8;
                    }
                    return parseFloat((prev + 0.1).toFixed(2));
                });
            }, 100);
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
        const height = 320;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        // Ocean Background
        const seaGrad = ctx.createLinearGradient(0, 0, 0, height);
        seaGrad.addColorStop(0, "#082f49");
        seaGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = seaGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid lines (ocean coordinates)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Compass rose
        drawCompass(ctx, 60, 60);

        // Boat trajectory visualization
        const originX = 160;
        const originY = 240;

        // Current boat position
        // s_y = vy * t; s_x = 0.5 * a * t^2 (if t<=4) or s_x4 + vx*(t-4)
        let sx = 0;
        if (currentTime <= durationSec) {
            sx = 0.5 * (forceN / massKg) * currentTime * currentTime;
        } else {
            const sx4 = 0.5 * (forceN / massKg) * durationSec * durationSec;
            sx = sx4 + vx * (currentTime - durationSec);
        }
        const sy = vy * currentTime;

        // Pixel scaling
        const pScale = 5;
        const bX = originX + sx * pScale;
        const bY = originY - sy * pScale;

        // Trace line
        ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bX, bY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Force vector from West to East (if within duration)
        if (currentTime < durationSec) {
            ctx.fillStyle = "#ef4444";
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 3;
            drawArrow(ctx, bX - 70, bY, bX - 15, bY, "#ef4444");
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(`F_arus = ${forceN} N (Timur)`, bX - 80, bY - 12);
        }

        // Draw boat at (bX, bY) rotated according to resultant angle
        drawBoat(ctx, bX, bY, angleRad);

        // Vector Resolution Diagram (Bottom Right HUD)
        const vhudX = width - 190;
        const vhudY = height - 130;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(vhudX - 10, vhudY - 30, 180, 150, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("DIAGRAM RESULTAN VEKTOR:", vhudX, vhudY - 12);

        // vx arrow (East)
        drawArrow(ctx, vhudX + 20, vhudY + 80, vhudX + 20 + vx * 8, vhudY + 80, "#38bdf8");
        ctx.fillStyle = "#38bdf8";
        ctx.font = "10px monospace";
        ctx.fillText(`v_x = ${vx.toFixed(1)} m/s`, vhudX + 20, vhudY + 100);

        // vy arrow (North)
        drawArrow(ctx, vhudX + 20, vhudY + 80, vhudX + 20, vhudY + 80 - vy * 8, "#22c55e");
        ctx.fillStyle = "#22c55e";
        ctx.fillText(`v_y = ${vy.toFixed(1)} m/s`, vhudX + 25, vhudY + 35);

        // Resultant arrow (diagonal)
        drawArrow(ctx, vhudX + 20, vhudY + 80, vhudX + 20 + vx * 8, vhudY + 80 - vy * 8, "#f59e0b");
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 10px monospace";
        ctx.fillText(`v_res = ${vResultant.toFixed(1)} m/s`, vhudX + 75, vhudY + 45);
        ctx.fillText(`θ = ${angleDeg.toFixed(1)}°`, vhudX + 45, vhudY + 70);
    }, [forceN, massKg, durationSec, currentTime, vy, vx, vResultant, angleRad, angleDeg]);

    function drawBoat(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Hull
        ctx.fillStyle = "#f97316";
        ctx.strokeStyle = "#431407";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(8, -6);
        ctx.lineTo(8, 14);
        ctx.lineTo(-8, 14);
        ctx.lineTo(-8, -6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Deck
        ctx.fillStyle = "#fed7aa";
        ctx.fillRect(-5, -4, 10, 12);

        // Fisherman
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(0, 2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 6;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
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

    function drawCompass(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("U", cx, cy - 12);
        ctx.fillText("S", cx, cy + 19);
        ctx.fillText("T", cx + 16, cy + 3);
        ctx.fillText("B", cx - 16, cy + 3);

        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - 9);
        ctx.stroke();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🛥️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Hukum Newton & Vektor Gaya Arus Laut Perahu Nelayan
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 9 TKA 2025: F_arus = 300 N, m = 150 kg, t = 4 s
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentTime(4)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            currentTime === 4
                                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Tepat 4 Detik (Soal 9)
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold transition-all shadow"
                    >
                        {isPlaying ? "Jeda ⏸" : "Jalankan Simulasi ▶"}
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Waktu Simulasi (t)</span>
                        <span className="font-mono text-amber-400 font-bold">{currentTime.toFixed(1)} detik</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>t = 0</span>
                        <span className="text-amber-400 font-bold">t = 4s (Arus Berhenti)</span>
                        <span>t = 8s</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Gaya Arus Horizontal (F)</span>
                        <span className="font-mono text-rose-400 font-bold">{forceN} N</span>
                    </div>
                    <input
                        type="range"
                        min="100"
                        max="500"
                        step="50"
                        value={forceN}
                        onChange={(e) => setForceN(parseInt(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Massa Total Perahu (m)</span>
                        <span className="font-mono text-cyan-400 font-bold">{massKg} kg</span>
                    </div>
                    <input
                        type="range"
                        min="100"
                        max="300"
                        step="25"
                        value={massKg}
                        onChange={(e) => setMassKg(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Analisis Soal No. 9 TKA (Kondisi Gerak Perahu Setelah 4 Detik):
                </strong>
                <p>1. Percepatan horizontal ke timur akibat gaya arus:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    ax = F / m = 300 N / 150 kg = 2 m/s²
                </div>
                <p>2. Kecepatan ke timur pada detik ke-4: vx = ax · t = 2 × 4 = 8 m/s.</p>
                <p>3. Kecepatan ke utara tetap konstan: vy = 6 m/s.</p>
                <p>4. Kecepatan resultan & arah:</p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    v = √(8² + 6²) = 10 m/s  |  tan(θ) = 8 / 6 = 4/3  ⟹  θ = 53° ke timur dari utara
                </div>
                <p className="text-emerald-300 font-semibold pt-1">
                    👉 Jawaban TKA: Kecepatan resultannya 10 m/s dengan arah 53° ke timur dari utara, kemudian bergerak lurus dengan kecepatan konstan (Opsi A).
                </p>
            </div>
        </div>
    );
}
