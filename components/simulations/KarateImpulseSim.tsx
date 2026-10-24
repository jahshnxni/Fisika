"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function KarateImpulseSim() {
    const [contactTimeMs, setContactTimeMs] = useState<number>(5); // ms (0.005 s)
    const [handMassKg, setHandMassKg] = useState<number>(1.2); // kg
    const [strikeSpeedMs, setStrikeSpeedMs] = useState<number>(12); // m/s
    const [isStriking, setIsStriking] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Physics
    const deltaT = contactTimeMs / 1000; // seconds
    const deltaP = handMassKg * strikeSpeedMs; // kg*m/s = N*s
    const avgForce = deltaP / deltaT; // Newton
    const peakForce = avgForce * 1.8; // Peak force in triangle impulse curve
    const breakThresholdN = 1800; // Force threshold to shatter hebel brick
    const isBroken = peakForce >= breakThresholdN;

    const strikeNow = () => {
        animRef.current = 0;
        setIsStriking(true);
    };

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
            if (isStriking) {
                animRef.current += 0.05;
                if (animRef.current > 1.2) {
                    setIsStriking(false);
                }
            }

            ctx.clearRect(0, 0, width, height);

            // Dojo Gym Background
            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#0f172a");
            bg.addColorStop(1, "#1e1b4b");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Tatami Floor / Pedestal
            ctx.fillStyle = "#334155";
            ctx.fillRect(40, 260, 240, 45);
            ctx.strokeStyle = "#64748b";
            ctx.lineWidth = 2;
            ctx.strokeRect(40, 260, 240, 45);

            // Hebel Bricks Stack
            const brickY = 240;
            const progress = animRef.current;
            const hasHit = progress >= 0.5;

            if (!hasHit || !isBroken) {
                // Intact Bricks
                ctx.fillStyle = "#cbd5e1";
                ctx.strokeStyle = "#475569";
                ctx.lineWidth = 1.5;
                for (let b = 0; b < 3; b++) {
                    ctx.fillRect(70, brickY - b * 22, 180, 20);
                    ctx.strokeRect(70, brickY - b * 22, 180, 20);
                }
            } else {
                // Shattered Bricks (Cracked and displaced)
                ctx.fillStyle = "#94a3b8";
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 2;

                // Left halves falling
                ctx.fillRect(60, brickY - 35, 80, 18);
                ctx.fillRect(55, brickY - 10, 85, 18);
                ctx.fillRect(50, brickY + 10, 90, 18);

                // Right halves falling
                ctx.fillRect(175, brickY - 30, 85, 18);
                ctx.fillRect(180, brickY - 5, 80, 18);
                ctx.fillRect(185, brickY + 15, 75, 18);

                // Shockwave & dust particles
                ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
                for (let i = 0; i < 12; i++) {
                    const px = 160 + (i % 2 === 0 ? 1 : -1) * (i * 8);
                    const py = 200 + Math.sin(i * 3) * 20;
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Karate Fist Animation
            // Idle position: y = 50, Impact: y = 175
            let fistY = 70;
            if (isStriking) {
                if (progress < 0.5) {
                    fistY = 70 + (progress / 0.5) * 105;
                } else if (progress < 0.7) {
                    fistY = 175; // contact
                } else {
                    fistY = 175 - ((progress - 0.7) / 0.5) * 85;
                }
            }

            drawKarateHand(ctx, 160, fistY);

            // --- RIGHT HALF: Impulse Curve Graph F vs t ---
            const gX = 350;
            const gY = 270;
            const gW = 250;
            const gH = 180;

            // Graph Background Panel
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 1;
            ctx.roundRect(gX - 30, 30, gW + 50, 260, 10);
            ctx.fill();
            ctx.stroke();

            // Graph Axes
            ctx.strokeStyle = "#64748b";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(gX, gY - gH);
            ctx.lineTo(gX, gY);
            ctx.lineTo(gX + gW, gY);
            ctx.stroke();

            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("Gaya Impuls F (N)", gX - 8, gY - gH + 10);
            ctx.textAlign = "center";
            ctx.fillText("Waktu Kontak Δt (ms)", gX + gW / 2, gY + 18);

            // Breaking Threshold Line
            const maxF = 4500;
            const threshY = gY - (breakThresholdN / maxF) * gH;
            ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(gX, threshY);
            ctx.lineTo(gX + gW, threshY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#ef4444";
            ctx.font = "9px monospace";
            ctx.textAlign = "left";
            ctx.fillText("Batas Pecah: 1800 N", gX + 10, threshY - 4);

            // Impulse Curve (Triangle/Gaussian Spike)
            const pulseWidthPx = Math.max(15, (contactTimeMs / 25) * gW);
            const peakY = gY - Math.min((peakForce / maxF) * gH, gH - 10);
            const midX = gX + pulseWidthPx / 2;

            // Fill area under curve
            const curveGrad = ctx.createLinearGradient(0, peakY, 0, gY);
            curveGrad.addColorStop(0, isBroken ? "rgba(239, 68, 68, 0.7)" : "rgba(56, 189, 248, 0.7)");
            curveGrad.addColorStop(1, "rgba(15, 23, 42, 0.1)");
            ctx.fillStyle = curveGrad;

            ctx.beginPath();
            ctx.moveTo(gX, gY);
            ctx.quadraticCurveTo(midX, peakY, gX + pulseWidthPx, gY);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = isBroken ? "#ef4444" : "#38bdf8";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(gX, gY);
            ctx.quadraticCurveTo(midX, peakY, gX + pulseWidthPx, gY);
            ctx.stroke();

            // Stats
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`Δt = ${contactTimeMs} ms (${(deltaT).toFixed(3)} s)`, gX, 60);

            ctx.fillStyle = isBroken ? "#ef4444" : "#38bdf8";
            ctx.font = "bold 14px monospace";
            ctx.fillText(`Gaya Puncak: ${Math.round(peakForce)} N`, gX, 85);

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "10px sans-serif";
            ctx.fillText(`Perubahan Momentum Δp = ${deltaP.toFixed(1)} N·s`, gX, 105);

            if (isBroken) {
                ctx.fillStyle = "#22c55e";
                ctx.font = "bold 11px sans-serif";
                ctx.fillText("💥 BATU BATA PECAH!", gX, 125);
            } else {
                ctx.fillStyle = "#f59e0b";
                ctx.font = "bold 11px sans-serif";
                ctx.fillText("⚠️ Gagal Pecah (Gaya Kurang)", gX, 125);
            }

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [contactTimeMs, handMassKg, strikeSpeedMs, isStriking, isBroken, deltaT, deltaP, peakForce]);

    function drawKarateHand(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.save();
        ctx.translate(x, y);

        // Arm sleeve (white gi)
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.fillRect(-15, -60, 30, 45);
        ctx.strokeRect(-15, -60, 30, 45);

        // Wrist
        ctx.fillStyle = "#fed7aa";
        ctx.fillRect(-12, -15, 24, 15);

        // Fist (Shuto / Knife Hand or Hammer fist)
        ctx.fillStyle = "#fbcfe8";
        ctx.beginPath();
        ctx.roundRect(-16, 0, 32, 25, 8);
        ctx.fill();
        ctx.strokeStyle = "#db2777";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🥋</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Momentum, Impuls & Pukulan Karate Pemecah Batu Bata Hebel
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 10 TKA 2025: F = Δp / Δt
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setContactTimeMs(5); strikeNow(); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/30 border border-rose-500 text-rose-300 transition-all hover:bg-rose-600/50"
                    >
                        Pukulan Kilat (5 ms - Pecah!)
                    </button>
                    <button
                        onClick={() => { setContactTimeMs(25); strikeNow(); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 transition-all hover:bg-slate-700"
                    >
                        Pukulan Lambat (25 ms)
                    </button>
                    <button
                        onClick={strikeNow}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold transition-all shadow"
                    >
                        Pukul! 👊
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
                        <span className="font-semibold text-slate-300">Waktu Sentuh Kontak (Δt)</span>
                        <span className="font-mono text-rose-400 font-bold">{contactTimeMs} milidetik ({deltaT.toFixed(3)} s)</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={contactTimeMs}
                        onChange={(e) => {
                            setContactTimeMs(parseInt(e.target.value));
                        }}
                        className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span className="text-rose-400 font-bold">2 ms (Gaya Raksasa)</span>
                        <span>10 ms</span>
                        <span>30 ms (Gaya Kecil)</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Kecepatan Pukulan Tangan (v)</span>
                        <span className="font-mono text-cyan-400 font-bold">{strikeSpeedMs} m/s</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="20"
                        step="1"
                        value={strikeSpeedMs}
                        onChange={(e) => setStrikeSpeedMs(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Analisis Ilmiah Soal No. 10 TKA (Mengapa Hebel Pecah Meski Waktu Sentuh Singkat):
                </strong>
                <p>Berdasarkan Teorema Impuls-Momentum:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    I = F · Δt = Δp  ⟹  F = Δp / Δt
                </div>
                <p>
                    Ketika atlet memukul cepat dan langsung menarik tangannya, perubahan momentum $(\\Delta p)$ terjadi dalam selang waktu sentuh $(\\Delta t)$ yang <strong>sangat amat singkat</strong> (beberapa milidetik).
                    Karena penyebut $\\Delta t$ sangat kecil, maka <strong>gaya kontak $F$ menjadi sangat besar</strong> (mencapai ribuan Newton), yang melampaui batas elastisitas hebel sehingga batu bata pecah seketika!
                </p>
                <p className="text-emerald-300 font-semibold pt-1">
                    👉 Jawaban TKA: Gaya menjadi sangat besar karena perubahan momentum terjadi dalam waktu yang sangat singkat (Opsi B).
                </p>
            </div>
        </div>
    );
}
