"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Compass, ArrowRight } from "lucide-react";

export default function MagneticLorentzSim() {
    const [chargeType, setChargeType] = useState<"positive" | "negative">("positive");
    const [fieldB, setFieldB] = useState<number>(1.5); // Tesla
    const [velocityVal, setVelocityVal] = useState<number>(4.0); // 10^5 m/s
    const [fieldDirection, setFieldDirection] = useState<"into" | "out">("into"); // 'into' (x) or 'out' (.)
    const [isRunning, setIsRunning] = useState<boolean>(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Physics calculations
    // q = 1.6e-19, m = 1.67e-27 (proton) or 9.1e-31 (electron)
    // Scale for visual simulation:
    // Radius R = v / (q/m * B)
    const qSign = chargeType === "positive" ? 1 : -1;
    const dirSign = fieldDirection === "into" ? 1 : -1;
    const orbitRadiusPx = Math.min(140, Math.max(35, (velocityVal / fieldB) * 35));

    // Orbital angle
    const [angle, setAngle] = useState<number>(0);

    // Animation Loop
    useEffect(() => {
        if (!isRunning) return;

        let frameId: number;
        let lastTime = performance.now();

        const loop = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.05);
            lastTime = time;

            // Angular velocity omega = v / R
            // Direction of rotation: sign determined by q * dir
            const rotDir = qSign * dirSign;
            const omega = (fieldB * 1.8) * rotDir;

            setAngle(prev => (prev + omega * dt) % (Math.PI * 2));
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [isRunning, fieldB, qSign, dirSign]);

    // Canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Dark background
        ctx.fillStyle = "#070b16";
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        // Draw Magnetic Field Grid Symbols
        const step = 45;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1.5;

        for (let x = 30; x < width - 20; x += step) {
            for (let y = 30; y < height - 20; y += step) {
                if (fieldDirection === "into") {
                    // Cross symbol (x) for into the page
                    ctx.beginPath();
                    ctx.moveTo(x - 5, y - 5);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.moveTo(x + 5, y - 5);
                    ctx.lineTo(x - 5, y + 5);
                    ctx.stroke();
                } else {
                    // Dot symbol (.) for out of page
                    ctx.beginPath();
                    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        // Circular Orbit Track (dashed)
        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitRadiusPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit Center Point
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle Coordinates
        const px = centerX + orbitRadiusPx * Math.cos(angle);
        const py = centerY + orbitRadiusPx * Math.sin(angle);

        // Particle Glow
        const pColor = chargeType === "positive" ? "#ef4444" : "#38bdf8";
        ctx.save();
        ctx.shadowColor = pColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Particle Sign Label (+ or -)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px ui-monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(chargeType === "positive" ? "+" : "\u2212", px, py);

        // Helper Arrow
        const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
            const headlen = 7;
            const a = Math.atan2(y2 - y1, x2 - x1);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(a - Math.PI / 6), y2 - headlen * Math.sin(a - Math.PI / 6));
            ctx.lineTo(x2 - headlen * Math.cos(a + Math.PI / 6), y2 - headlen * Math.sin(a + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = color;
            ctx.font = "bold 11px ui-monospace, sans-serif";
            ctx.fillText(label, x2 + 6, y2 + 4);
        };

        // Velocity Vector v (Tangent to circle)
        // Tangent angle = angle + (qSign * dirSign > 0 ? +PI/2 : -PI/2)
        const rotDir = qSign * dirSign;
        const tangentAngle = angle + (rotDir > 0 ? Math.PI / 2 : -Math.PI / 2);
        const vLen = 42;
        const vx = px + vLen * Math.cos(tangentAngle);
        const vy = py + vLen * Math.sin(tangentAngle);
        drawArrow(px, py, vx, vy, "#22c55e", "v");

        // Lorentz Force Vector F (Points towards center of curvature)
        const fLen = 38;
        const fx = px - fLen * Math.cos(angle);
        const fy = py - fLen * Math.sin(angle);
        drawArrow(px, py, fx, fy, "#e11d48", "F_L");

    }, [chargeType, fieldB, velocityVal, fieldDirection, angle, orbitRadiusPx, qSign, dirSign]);

    return (
        <div className="w-full bg-[#080d19] border border-cyan-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            Simulasi Gaya Magnet Lorentz
                        </span>
                        <span className="text-xs text-slate-400">Gerak Melingkar Partikel dalam Medan Magnet</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Lintasan Melingkar Partikel Bermuatan &amp; Kaidah Tangan Kanan
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                            isRunning ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                        }`}
                    >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "Jeda" : "Tembak Partikel"}
                    </button>
                    <button
                        onClick={() => setAngle(0)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                        title="Reset Orbit"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stage: Canvas + Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Canvas */}
                <div className="lg:col-span-7 relative aspect-[16/11] bg-[#070b16] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-inner flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full block" />

                    {/* Overlay Field Indicator */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-cyan-300">
                        Medan Magnet B: {fieldDirection === "into" ? "\u2297 Masuk Bidang" : "\u2299 Keluar Bidang"} ({fieldB} T)
                    </div>
                </div>

                {/* Right-Hand Rule and Physics Insights */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                            <Compass className="w-4 h-4 text-cyan-400" /> Kaidah Tangan Kanan (Right Hand Rule)
                        </h4>

                        <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 space-y-2 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                                <span><strong>Ibu Jari:</strong> Arah Kecepatan Partikel (v)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
                                <span><strong>Empat Jari:</strong> Arah Medan Magnet (B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                                <span><strong>Telapak Tangan:</strong> Arah Gaya Lorentz (F_L) untuk muatan positif</span>
                            </div>
                            <div className="text-[11px] text-amber-300 italic pt-1">
                                *Untuk muatan negatif (elektron), arah gaya berlawanan arah telapak (arah punggung tangan).
                            </div>
                        </div>

                        {/* Calculations */}
                        <div className="bg-[#0b0f19] p-3 rounded-xl border border-cyan-500/30 font-mono text-xs space-y-1.5">
                            <div className="text-yellow-400 font-bold border-b border-white/10 pb-1">
                                Jari-Jari Lintasan Melingkar (R):
                            </div>
                            <div className="text-slate-300">
                                R = (m &times; v) / (|q| &times; B)
                            </div>
                            <div className="text-emerald-400 font-bold">
                                Jari-jari relatif: {orbitRadiusPx.toFixed(1)} px
                            </div>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                        {/* Charge Type */}
                        <div>
                            <span className="text-xs text-slate-400 block mb-1.5 font-bold">Jenis Partikel:</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    onClick={() => setChargeType("positive")}
                                    className={`py-1.5 rounded-xl border font-bold transition-all ${
                                        chargeType === "positive" ? "bg-red-500/20 border-red-500 text-red-200" : "bg-slate-800 border-white/5 text-slate-400"
                                    }`}
                                >
                                    Muatan Positif (+q, Proton)
                                </button>
                                <button
                                    onClick={() => setChargeType("negative")}
                                    className={`py-1.5 rounded-xl border font-bold transition-all ${
                                        chargeType === "negative" ? "bg-cyan-500/20 border-cyan-500 text-cyan-200" : "bg-slate-800 border-white/5 text-slate-400"
                                    }`}
                                >
                                    Muatan Negatif (&minus;q, Elektron)
                                </button>
                            </div>
                        </div>

                        {/* Field Direction */}
                        <div>
                            <span className="text-xs text-slate-400 block mb-1.5 font-bold">Arah Medan Magnet (B):</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    onClick={() => setFieldDirection("into")}
                                    className={`py-1.5 rounded-xl border font-bold transition-all ${
                                        fieldDirection === "into" ? "bg-purple-500/20 border-purple-500 text-purple-200" : "bg-slate-800 border-white/5 text-slate-400"
                                    }`}
                                >
                                    &otimes; Masuk Bidang
                                </button>
                                <button
                                    onClick={() => setFieldDirection("out")}
                                    className={`py-1.5 rounded-xl border font-bold transition-all ${
                                        fieldDirection === "out" ? "bg-purple-500/20 border-purple-500 text-purple-200" : "bg-slate-800 border-white/5 text-slate-400"
                                    }`}
                                >
                                    &odot; Keluar Bidang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-xs">
                {/* Kuat Medan Magnet */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-purple-300 font-bold">Kuat Medan Magnet (B):</span>
                        <span className="font-mono text-white font-bold">{fieldB} Tesla</span>
                    </div>
                    <input
                        type="range"
                        min={0.5}
                        max={3.0}
                        step={0.25}
                        value={fieldB}
                        onChange={(e) => setFieldB(Number(e.target.value))}
                        className="w-full accent-purple-400"
                    />
                </div>

                {/* Kecepatan Partikel */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-emerald-300 font-bold">Kecepatan Partikel (v):</span>
                        <span className="font-mono text-white font-bold">{velocityVal} &times; 10&#8309; m/s</span>
                    </div>
                    <input
                        type="range"
                        min={1.0}
                        max={8.0}
                        step={0.5}
                        value={velocityVal}
                        onChange={(e) => setVelocityVal(Number(e.target.value))}
                        className="w-full accent-emerald-400"
                    />
                </div>
            </div>
        </div>
    );
}
