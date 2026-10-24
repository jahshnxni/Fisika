"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function WrenchTorqueSim() {
    const [forceN, setForceN] = useState<number>(15); // N
    const [angleDeg, setAngleDeg] = useState<number>(37); // deg
    const [lengthCm, setLengthCm] = useState<number>(20); // cm
    const [massGram, setMassGram] = useState<number>(500); // grams
    const [isRotating, setIsRotating] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Physics calculations
    const lengthM = lengthCm / 100; // 0.2 m
    const massKg = massGram / 1000; // 0.5 kg
    const rad = (angleDeg * Math.PI) / 180;
    const sinVal = Math.sin(rad); // sin(37) = 0.6
    const cosVal = Math.cos(rad); // cos(37) = 0.8

    // Torque tau = r * F * sin(theta)
    const torqueNm = lengthM * forceN * sinVal;

    // Moment of inertia for rod rotating at one end: I = 1/3 * m * L^2
    const inertiaI = (1 / 3) * massKg * lengthM * lengthM; // 0.02 / 3 = 0.00667 kg*m^2 = 1/150

    // Angular acceleration alpha = tau / I
    const alphaRadS2 = inertiaI > 0 ? torqueNm / inertiaI : 0;

    useEffect(() => {
        let frame: number;
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

        const render = () => {
            if (isRotating) {
                animRef.current += (alphaRadS2 / 270) * 0.04;
            }

            ctx.clearRect(0, 0, width, height);

            // Workshop Background
            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#0b0f19");
            bg.addColorStop(1, "#172033");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Origin of Bolt / Pivot
            const pivotX = 140;
            const pivotY = 170;

            // Bolt & Nut Base Panel
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.arc(pivotX, pivotY, 48, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#64748b";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Hexagon Bolt Head
            drawHexagon(ctx, pivotX, pivotY, 26, animRef.current);

            // Wrench drawing with rotation angle
            const wrenchPixelLen = lengthCm * 8; // scale
            drawWrench(ctx, pivotX, pivotY, wrenchPixelLen, animRef.current);

            // Force vector arrow applied at the end of wrench
            const endX = pivotX + wrenchPixelLen * Math.cos(animRef.current);
            const endY = pivotY + wrenchPixelLen * Math.sin(animRef.current);

            // Force angle relative to wrench: angleDeg
            const forceAngle = animRef.current + rad;
            const fArrowLen = forceN * 3.5;
            const fxEnd = endX + fArrowLen * Math.cos(forceAngle);
            const fyEnd = endY + fArrowLen * Math.sin(forceAngle);

            drawArrow(ctx, endX, endY, fxEnd, fyEnd, "#ef4444");

            // Arc for angle theta
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(endX, endY, 25, animRef.current, animRef.current + rad);
            ctx.stroke();

            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText(`${angleDeg}°`, endX + 32 * Math.cos(animRef.current + rad / 2), endY + 32 * Math.sin(animRef.current + rad / 2));

            // Force Label
            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(`F = ${forceN} N`, fxEnd + 8, fyEnd);

            // --- HUD Box: Calculations ---
            const hudX = width - 230;
            const hudY = 30;
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.roundRect(hudX, hudY, 210, 260, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("PARAMETER DINAMIKA ROTASI", hudX + 15, hudY + 25);

            ctx.font = "11px monospace";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(`Panjang L = ${lengthM.toFixed(2)} m (${lengthCm} cm)`, hudX + 15, hudY + 50);
            ctx.fillText(`Massa m   = ${massKg.toFixed(2)} kg (${massGram} g)`, hudX + 15, hudY + 68);
            ctx.fillText(`Gaya F    = ${forceN} N`, hudX + 15, hudY + 86);
            ctx.fillText(`Sudut θ   = ${angleDeg}°`, hudX + 15, hudY + 104);

            ctx.strokeStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(hudX + 15, hudY + 118);
            ctx.lineTo(hudX + 195, hudY + 118);
            ctx.stroke();

            // Momen Inersia
            ctx.fillStyle = "#a855f7";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("Momen Inersia Batang:", hudX + 15, hudY + 138);
            ctx.font = "11px monospace";
            ctx.fillText(`I = ⅓ m L² = ${(inertiaI).toFixed(5)} kg·m²`, hudX + 15, hudY + 154);
            ctx.fillText(`   = 1/150 kg·m²`, hudX + 15, hudY + 170);

            // Torsi
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("Momen Gaya (Torsi):", hudX + 15, hudY + 194);
            ctx.font = "11px monospace";
            ctx.fillText(`τ = r·F·sinθ = ${torqueNm.toFixed(2)} N·m`, hudX + 15, hudY + 210);

            // Percepatan Sudut
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 12px monospace";
            ctx.fillText(`α = τ / I = ${alphaRadS2.toFixed(0)} rad/s²`, hudX + 15, hudY + 238);

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [forceN, angleDeg, lengthCm, massGram, isRotating, torqueNm, inertiaI, alphaRadS2, lengthM, massKg, rad]);

    function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number) {
        ctx.fillStyle = "#94a3b8";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = angle + (i * Math.PI) / 3;
            const hx = x + r * Math.cos(a);
            const hy = y + r * Math.sin(a);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner circle
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawWrench(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Open Head of Wrench (surrounding hexagon)
        ctx.fillStyle = "#cbd5e1";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0.3 * Math.PI, 1.7 * Math.PI, false);
        ctx.lineTo(length, 9);
        ctx.lineTo(length, -9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cutout for Bolt Jaw
        ctx.fillStyle = "#334155";
        ctx.fillRect(-20, -22, 28, 44);

        // Wrench Shaft
        const grad = ctx.createLinearGradient(0, -9, 0, 9);
        grad.addColorStop(0, "#f1f5f9");
        grad.addColorStop(0.5, "#cbd5e1");
        grad.addColorStop(1, "#94a3b8");
        ctx.fillStyle = grad;
        ctx.fillRect(30, -9, length - 30, 18);
        ctx.strokeRect(30, -9, length - 30, 18);

        // Label on Shaft
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`L = ${lengthCm} cm | m = ${massGram} g`, length / 2 + 10, 3);

        ctx.restore();
    }

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
                    <span className="text-xl">🔧</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Dinamika Rotasi: Momen Gaya & Momen Inersia Kunci Pas
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 11 TKA 2025: F = 15 N, θ = 37°, L = 20 cm, m = 500 g
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setAngleDeg(37); setForceN(15); setLengthCm(20); setMassGram(500); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600/30 border border-amber-500 text-amber-300 transition-all hover:bg-amber-600/50"
                    >
                        Nilai Soal 11 (37° & 15 N)
                    </button>
                    <button
                        onClick={() => setIsRotating(!isRotating)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold transition-all shadow"
                    >
                        {isRotating ? "Jeda Rotasi ⏸" : "Putar ▶"}
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
                        <span className="font-semibold text-slate-300">Gaya yang Diberikan (F)</span>
                        <span className="font-mono text-rose-400 font-bold">{forceN} N</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={forceN}
                        onChange={(e) => setForceN(parseInt(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Sudut Tarik Gaya (θ)</span>
                        <span className="font-mono text-amber-400 font-bold">{angleDeg}° (sinθ = {sinVal.toFixed(2)})</span>
                    </div>
                    <input
                        type="range"
                        min="15"
                        max="90"
                        step="1"
                        value={angleDeg}
                        onChange={(e) => setAngleDeg(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>15°</span>
                        <span className="text-amber-400 font-bold">37° (sin 37° = 0,6)</span>
                        <span>90° (Maksimal)</span>
                    </div>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-2 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 11 TKA (Percepatan Sudut Kunci Pas):
                </strong>
                <p>1. <strong>Momen Gaya (Torsi):</strong></p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    τ = r · F · sin(37°) = 0,2 m × 15 N × 0,6 = 1,8 N·m
                </div>
                <p>2. <strong>Momen Inersia Kunci Pas</strong> (batang homogen diputar pada poros ujung baut):</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    I = (1/3) m L² = (1/3)(0,5 kg)(0,2 m)² = 0,02 / 3 = 1/150 kg·m²
                </div>
                <p>3. <strong>Percepatan Sudut (α):</strong></p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    α = τ / I = 1,8 / (1/150) = 1,8 × 150 = 270 rad/s² (Jawaban B)
                </div>
            </div>
        </div>
    );
}
