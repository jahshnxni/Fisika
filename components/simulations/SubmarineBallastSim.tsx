"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function SubmarineBallastSim() {
    const [ballastAirM3, setBallastAirM3] = useState<number>(40); // m^3 air blown into ballast
    const [seaDensity, setSeaDensity] = useState<number>(1000); // kg/m^3
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics
    const totalMassKg = 200000; // 200,000 kg
    const baseVolumeM3 = 160; // m^3
    const totalVolumeM3 = baseVolumeM3 + ballastAirM3; // m^3
    const effectiveDensity = totalMassKg / totalVolumeM3; // kg/m^3

    // Buoyancy vs Weight
    const weightForceN = totalMassKg * 10; // 2,000,000 N
    const buoyantForceN = seaDensity * 10 * totalVolumeM3; // rho * g * V

    const netForceN = buoyantForceN - weightForceN;
    // Normalized depth (0 = surface, 1 = seabed)
    const isSurfacing = netForceN >= 0;
    const depthRatio = Math.max(0.1, Math.min(0.85, 0.5 - (netForceN / 500000) * 0.4));

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

        // Deep Ocean Gradient
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
        oceanGrad.addColorStop(0, "#0284c7");
        oceanGrad.addColorStop(0.2, "#0369a1");
        oceanGrad.addColorStop(0.7, "#0c4a6e");
        oceanGrad.addColorStop(1, "#082f49");
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Surface water line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(width, 25);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("Permukaan Laut (Surface)", 15, 20);

        // Seabed at bottom
        ctx.fillStyle = "#78350f";
        ctx.fillRect(0, height - 30, width, 30);
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, height - 30, width, 30);
        ctx.fillStyle = "#fef3c7";
        ctx.fillText("Dasar Laut (Seabed)", 15, height - 12);

        // Submarine position
        const subX = 220;
        const subY = 40 + depthRatio * (height - 120);

        // Draw Submarine
        drawSubmarine(ctx, subX, subY, ballastAirM3);

        // Force Vectors
        // Buoyant Force (Up)
        const bArrowLen = Math.min((buoyantForceN / 2000000) * 50, 75);
        drawArrow(ctx, subX, subY - 20, subX, subY - 20 - bArrowLen, "#22c55e");
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`F_A = ${(buoyantForceN / 1000).toFixed(0)} kN`, subX, subY - 25 - bArrowLen);

        // Weight Force (Down)
        const wArrowLen = 50;
        drawArrow(ctx, subX, subY + 20, subX, subY + 20 + wArrowLen, "#ef4444");
        ctx.fillStyle = "#ef4444";
        ctx.fillText(`W = ${(weightForceN / 1000).toFixed(0)} kN`, subX, subY + 35 + wArrowLen);

        // --- HUD Stats Box (Right Side) ---
        const hudX = width - 190;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = isSurfacing ? "#22c55e" : "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(hudX - 10, 35, 180, 245, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("STATUS KAPAL SELAM:", hudX, 55);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Massa m = 200.000 kg`, hudX, 80);
        ctx.fillText(`Vol Awal = 160 m³`, hudX, 100);
        ctx.fillText(`ΔV Tangki = ${ballastAirM3} m³`, hudX, 120);
        ctx.fillText(`Vol Total = ${totalVolumeM3} m³`, hudX, 140);

        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Massa Jenis Kapal:`, hudX, 165);
        ctx.font = "bold 12px monospace";
        ctx.fillText(`${effectiveDensity.toFixed(0)} kg/m³`, hudX, 182);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Air Laut = ${seaDensity} kg/m³`, hudX, 202);

        // Surfacing status indicator
        if (effectiveDensity <= seaDensity) {
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("🟢 TERAPUNG / NAIK!", hudX, 230);
            ctx.font = "9px sans-serif";
            ctx.fillText("Gaya Apung F_A ≥ Berat W", hudX, 246);
        } else {
            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("🔴 TENGGELAM DI DASAR", hudX, 230);
            ctx.font = "9px sans-serif";
            ctx.fillText("ρ_kapal > ρ_air", hudX, 246);
        }
    }, [ballastAirM3, seaDensity, totalVolumeM3, effectiveDensity, buoyantForceN, weightForceN, netForceN, depthRatio, isSurfacing]);

    function drawSubmarine(ctx: CanvasRenderingContext2D, x: number, y: number, airVol: number) {
        ctx.save();
        ctx.translate(x, y);

        // Submarine Hull (Elongated Capsule)
        ctx.fillStyle = "#334155";
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-80, -22, 160, 44, 22);
        ctx.fill();
        ctx.stroke();

        // Conning Tower / Sail (Top fin)
        ctx.fillRect(-15, -42, 30, 22);
        ctx.strokeRect(-15, -42, 30, 22);

        // Periscope
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -42);
        ctx.lineTo(0, -55);
        ctx.lineTo(8, -55);
        ctx.stroke();

        // Ballast Tanks Section (Cross section view)
        // Ratio of air in ballast: 0 to 60 m^3
        const airPercent = Math.min(1, airVol / 60);

        // Left Tank
        drawTank(ctx, -65, -12, 32, 24, airPercent);
        // Right Tank
        drawTank(ctx, 33, -12, 32, 24, airPercent);

        // Propeller
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.ellipse(-84, 0, 4, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawTank(ctx: CanvasRenderingContext2D, tx: number, ty: number, tw: number, th: number, airRatio: number) {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(tx, ty, tw, th);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.strokeRect(tx, ty, tw, th);

        // Air portion (top)
        const airHeight = th * airRatio;
        ctx.fillStyle = "#38bdf8"; // air
        ctx.fillRect(tx + 1, ty + 1, tw - 2, airHeight);

        // Water portion (bottom)
        ctx.fillStyle = "#0369a1"; // water
        ctx.fillRect(tx + 1, ty + 1 + airHeight, tw - 2, th - airHeight - 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = "8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Ballast", tx + tw / 2, ty - 3);
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 6;
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
                    <span className="text-xl">🚢</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Hukum Archimedes & Tangki Ballast Kapal Selam
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 13 TKA 2025: m = 200.000 kg, ρ = 1.250 kg/m³ &rarr; 1.000 kg/m³
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setBallastAirM3(0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            ballastAirM3 === 0
                                ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Di Dasar Laut (0 m³)
                    </button>
                    <button
                        onClick={() => setBallastAirM3(40)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            ballastAirM3 === 40
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Tiup Ballast (40 m³ - Soal 13)
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="mt-5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-300">Volume Udara yang Ditiup ke Tangki Ballast (ΔV):</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">{ballastAirM3} m³</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={ballastAirM3}
                    onChange={(e) => setBallastAirM3(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0 m³ (Tenggelam di dasar, ρ = 1250 kg/m³)</span>
                    <span className="text-emerald-400 font-bold">40 m³ (Terapung, ρ = 1000 kg/m³)</span>
                    <span>60 m³</span>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-2 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 13 TKA (Perubahan Volume Tangki Ballast):
                </strong>
                <p>1. Saat berada di dasar laut:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    V1 = m / rho_kapal = 200.000 kg / 1.250 kg/m³ = 160 m³
                </div>
                <p>2. Agar dapat terapung mendekati permukaan laut (rho_air = 1.000 kg/m³), syarat melayang/terapung adalah rho_kapal_efektif = rho_air:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    V2 = m / rho_air = 200.000 kg / 1.000 kg/m³ = 200 m³
                </div>
                <p>3. Perubahan volume tangki ballast yang harus diekspansi (ditiup udara mengeluarkan air):</p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    ΔV = V2 - V1 = 200 m³ - 160 m³ = 40 m³ (Jawaban A)
                </div>
            </div>
        </div>
    );
}
