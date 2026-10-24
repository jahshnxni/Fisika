"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sliders, CheckSquare, Square, Zap, Info } from "lucide-react";

export default function InclinedPlaneSim() {
    // Parameters
    const [theta, setTheta] = useState<number>(30); // Sudut kemiringan (derajat)
    const [mass, setMass] = useState<number>(5); // Massa (kg)
    const [hasFriction, setHasFriction] = useState<boolean>(true); // Mode Gesekan
    const [muS, setMuS] = useState<number>(0.4); // Koefisien gesek statis
    const [muK, setMuK] = useState<number>(0.25); // Koefisien gesek kinetis

    // Vector visibility toggles
    const [showW, setShowW] = useState<boolean>(true);
    const [showComponents, setShowComponents] = useState<boolean>(true); // W_parallel & W_perp
    const [showNormal, setShowNormal] = useState<boolean>(true);
    const [showFriction, setShowFriction] = useState<boolean>(true);

    // Simulation state
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [blockDistance, setBlockDistance] = useState<number>(0); // Jarak tempuh (m)
    const [velocity, setVelocity] = useState<number>(0); // Kecepatan (m/s)
    const [simTime, setSimTime] = useState<number>(0); // Waktu (s)

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    const g = 9.8; // m/s^2
    const rampLength = 8.0; // Panjang bidang miring (meter)

    // Physics calculations
    const rad = (theta * Math.PI) / 180;
    const sinTheta = Math.sin(rad);
    const cosTheta = Math.cos(rad);
    const tanTheta = Math.tan(rad);

    const W = mass * g; // Gaya berat total (N)
    const W_parallel = mass * g * sinTheta; // Komponen sejajar bidang (N)
    const W_perp = mass * g * cosTheta; // Komponen tegak lurus bidang (N)
    const N = W_perp; // Gaya normal (N)

    // Friction logic
    const fs_max = hasFriction ? muS * N : 0;
    const fk = hasFriction ? muK * N : 0;

    let willSlide = false;
    let actualFriction = 0;
    let acceleration = 0;
    let stateMessage = "";

    if (!hasFriction) {
        willSlide = theta > 0;
        actualFriction = 0;
        acceleration = g * sinTheta;
        stateMessage = "Bidang Licin (\u03bc = 0): Meluncur Bebas";
    } else {
        if (tanTheta <= muS) {
            willSlide = false;
            actualFriction = W_parallel; // f_s menyeimbangkan W_parallel
            acceleration = 0;
            stateMessage = "Benda Diam (Keseimbangan Statis: W\u2225 \u2264 f_s,max)";
        } else {
            willSlide = true;
            actualFriction = fk;
            acceleration = (W_parallel - fk) / mass; // a = g(sin\theta - \mu_k cos\theta)
            stateMessage = "Benda Meluncur Turun (W\u2225 > f_s,max)";
        }
    }

    // Animation loop
    useEffect(() => {
        if (!isRunning) {
            lastTimestampRef.current = null;
            return;
        }

        const step = (timestamp: number) => {
            if (!lastTimestampRef.current) {
                lastTimestampRef.current = timestamp;
            }
            const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
            lastTimestampRef.current = timestamp;

            if (willSlide && acceleration > 0) {
                setSimTime((prev) => prev + dt);
                setVelocity((prevV) => {
                    const newV = prevV + acceleration * dt;
                    setBlockDistance((prevS) => {
                        const newS = prevS + prevV * dt + 0.5 * acceleration * dt * dt;
                        if (newS >= rampLength) {
                            setIsRunning(false);
                            return rampLength;
                        }
                        return newS;
                    });
                    return newV;
                });
            } else {
                // If static, does not slide
                setIsRunning(false);
            }

            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRunning, willSlide, acceleration]);

    const handleReset = () => {
        setIsRunning(false);
        setBlockDistance(0);
        setVelocity(0);
        setSimTime(0);
        lastTimestampRef.current = null;
    };

    // Canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // High DPI Support
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Background
        ctx.fillStyle = "#0c0f1d";
        ctx.fillRect(0, 0, width, height);

        // Draw coordinate grid lines (subtle)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
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

        // Ramp Geometry
        const startX = 60;
        const groundY = height - 50;
        const maxRampPx = width - 120;
        const rampBasePx = maxRampPx * Math.cos(rad);
        const rampHeightPx = maxRampPx * Math.sin(rad);

        const endX = startX + rampBasePx;
        const topY = groundY - rampHeightPx;

        // Ground Floor Line
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, groundY);
        ctx.lineTo(width - 20, groundY);
        ctx.stroke();

        // Ground Hash Marks
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1.5;
        for (let hx = 20; hx < width - 20; hx += 16) {
            ctx.beginPath();
            ctx.moveTo(hx, groundY);
            ctx.lineTo(hx - 8, groundY + 10);
            ctx.stroke();
        }

        // Draw Incline Wedge
        ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, groundY);
        ctx.lineTo(endX, groundY);
        ctx.lineTo(startX, topY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Incline Surface Highlight
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, topY);
        ctx.lineTo(endX, groundY);
        ctx.stroke();

        // Angle Arc at bottom right (endX, groundY)
        const arcRadius = 45;
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(endX, groundY, arcRadius, Math.PI, Math.PI + rad);
        ctx.stroke();

        // Angle Label
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`\u03b8 = ${theta}\u00b0`, endX - arcRadius - 38, groundY - 10);

        // Block Position along the ramp (from top to bottom)
        const fraction = Math.min(blockDistance / rampLength, 1.0);
        // Position at fraction: top is fraction = 0, bottom is fraction = 1
        const blockRampDistancePx = fraction * (maxRampPx - 70) + 35;
        const blockCenterX = startX + blockRampDistancePx * Math.cos(rad);
        const blockCenterY = topY + blockRampDistancePx * Math.sin(rad);

        // Helper to draw an arrow with glowing head
        const drawArrow = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            color: string,
            label: string,
            labelOffsetX = 0,
            labelOffsetY = 0
        ) => {
            const headlen = 10;
            const angle = Math.atan2(y2 - y1, x2 - x1);

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(
                x2 - headlen * Math.cos(angle - Math.PI / 6),
                y2 - headlen * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                x2 - headlen * Math.cos(angle + Math.PI / 6),
                y2 - headlen * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();

            // Label
            ctx.fillStyle = color;
            ctx.font = "bold 12px ui-monospace, SFMono-Regular, monospace";
            ctx.fillText(label, x2 + labelOffsetX, y2 + labelOffsetY);
        };

        // Save context and rotate around blockCenter
        ctx.save();
        ctx.translate(blockCenterX, blockCenterY);
        ctx.rotate(rad);

        // Draw Block resting on surface (block sits with bottom edge on surface y=0, top at y=-36)
        const blockW = 54;
        const blockH = 36;
        ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-blockW / 2, -blockH, blockW, blockH, 6);
        ctx.fill();
        ctx.stroke();

        // Block Mass Label inside
        ctx.fillStyle = "#1e1b4b";
        ctx.font = "bold 13px ui-monospace, SFMono-Regular, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`m = ${mass}kg`, 0, -blockH / 2);

        // Center of mass point
        const cmX = 0;
        const cmY = -blockH / 2;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cmX, cmY, 3, 0, Math.PI * 2);
        ctx.fill();

        // VECTORS DRAWN IN ROTATED INCLINE FRAME (X parallel down, Y perpendicular down into ramp)
        // Vector Scale Factor (pixels per Newton)
        const scale = 1.3;

        // Normal Force N (points up out of the ramp, -Y direction)
        if (showNormal) {
            const normalLen = Math.min(N * scale, 90);
            drawArrow(cmX, cmY, cmX, cmY - normalLen, "#38bdf8", `N = ${N.toFixed(1)}N`, -40, -10);
        }

        // Perpendicular Weight W_perp (points into ramp, +Y direction)
        if (showComponents) {
            const wPerpLen = Math.min(W_perp * scale, 90);
            drawArrow(cmX, cmY, cmX, cmY + wPerpLen, "#a855f7", `W\u22a5 = ${W_perp.toFixed(1)}N`, 10, 15);
        }

        // Parallel Weight W_parallel (points down incline, +X direction)
        if (showComponents) {
            const wParLen = Math.min(W_parallel * scale, 90);
            drawArrow(cmX, cmY, cmX + wParLen, cmY, "#fb923c", `W\u2225 = ${W_parallel.toFixed(1)}N`, 10, -5);
        }

        // Friction Force f (points up incline, -X direction)
        if (showFriction && hasFriction && actualFriction > 0) {
            const fLen = Math.min(actualFriction * scale, 90);
            const fLabel = willSlide ? `f_k = ${fk.toFixed(1)}N` : `f_s = ${actualFriction.toFixed(1)}N`;
            drawArrow(cmX, cmY, cmX - fLen, cmY, "#eab308", fLabel, -85, -6);
        }

        ctx.restore();

        // Vertical Gravity Force W (in global unrotated frame, straight down)
        if (showW) {
            // cm in global coords:
            // Rotate (0, -blockH/2) by rad
            const cmGlobalX = blockCenterX + (blockH / 2) * Math.sin(rad);
            const cmGlobalY = blockCenterY - (blockH / 2) * Math.cos(rad);
            const wLen = Math.min(W * scale, 110);
            drawArrow(
                cmGlobalX,
                cmGlobalY,
                cmGlobalX,
                cmGlobalY + wLen,
                "#ef4444",
                `W = mg = ${W.toFixed(1)}N`,
                10,
                0
            );
        }
    }, [
        theta,
        mass,
        hasFriction,
        muS,
        muK,
        showW,
        showComponents,
        showNormal,
        showFriction,
        blockDistance,
        rad,
        W,
        W_parallel,
        W_perp,
        N,
        actualFriction,
        fk,
        willSlide,
    ]);

    return (
        <div className="w-full bg-[#0a0d18] border border-sky-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            Simulasi Interaktif Dinamika
                        </span>
                        <span className="text-xs text-slate-400">Hukum II Newton & Gaya Gesek</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Gerak Benda pada Bidang Miring & Diagram Gaya Bebas (FBD)
                    </h3>
                </div>

                {/* Status Badge */}
                <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono tracking-wide ${
                        !willSlide
                            ? "bg-emerald-500/10 border-emerald-400 text-emerald-300"
                            : "bg-amber-500/10 border-amber-400 text-amber-300 animate-pulse"
                    }`}
                >
                    {stateMessage}
                </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#0c0f1d] rounded-2xl border border-sky-500/20 overflow-hidden shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Telemetry HUD (Overlaid on top-left) */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono text-xs space-y-1 shadow-lg pointer-events-none">
                    <div className="text-slate-400 font-bold border-b border-white/10 pb-1 mb-1 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Telemetri Kinematika
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Percepatan (a):</span>
                        <span className="text-sky-300 font-bold">{acceleration.toFixed(2)} m/s&sup2;</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Kecepatan (v):</span>
                        <span className="text-emerald-300 font-bold">{velocity.toFixed(2)} m/s</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Jarak Tempuh (s):</span>
                        <span className="text-amber-300 font-bold">{blockDistance.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Waktu (t):</span>
                        <span className="text-purple-300 font-bold">{simTime.toFixed(2)} s</span>
                    </div>
                </div>

                {/* Playback Controls (Overlaid on bottom-right) */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                            isRunning
                                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                                : "bg-sky-500 hover:bg-sky-400 text-slate-950"
                        }`}
                    >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "Jeda" : "Mulai Luncurkan"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        title="Reset Simulasi"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Customization Controls Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                {/* 1. Kemiringan Sudut */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-amber-300 font-bold">Sudut Kemiringan (&theta;):</span>
                        <span className="font-mono text-white font-bold">{theta}&deg;</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={70}
                        step={1}
                        value={theta}
                        onChange={(e) => {
                            setTheta(Number(e.target.value));
                            handleReset();
                        }}
                        className="w-full accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0&deg; (Mendatar)</span>
                        <span>30&deg;</span>
                        <span>70&deg; (Curam)</span>
                    </div>
                </div>

                {/* 2. Massa Benda */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-sky-300 font-bold">Massa Benda (m):</span>
                        <span className="font-mono text-white font-bold">{mass} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={20}
                        step={0.5}
                        value={mass}
                        onChange={(e) => {
                            setMass(Number(e.target.value));
                            handleReset();
                        }}
                        className="w-full accent-sky-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>1 kg</span>
                        <span>10 kg</span>
                        <span>20 kg</span>
                    </div>
                </div>

                {/* 3. Gaya Gesek Toggle & Sliders */}
                <div className="space-y-2 lg:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-400 font-bold">Permukaan Bidang:</span>
                        <button
                            onClick={() => {
                                setHasFriction(!hasFriction);
                                handleReset();
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                                hasFriction
                                    ? "bg-amber-500/20 text-amber-300 border-amber-400"
                                    : "bg-sky-500/20 text-sky-300 border-sky-400"
                            }`}
                        >
                            {hasFriction ? "Kasar (Ada Gesekan)" : "Licin Sempurna (\u03bc = 0)"}
                        </button>
                    </div>

                    {hasFriction && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-slate-400">&mu;<sub>s</sub> (Statis):</span>
                                    <span className="font-mono text-white font-bold">{muS.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.1}
                                    max={0.9}
                                    step={0.05}
                                    value={muS}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setMuS(val);
                                        if (muK > val) setMuK(val);
                                        handleReset();
                                    }}
                                    className="w-full accent-yellow-400"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-slate-400">&mu;<sub>k</sub> (Kinetis):</span>
                                    <span className="font-mono text-white font-bold">{muK.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.05}
                                    max={muS}
                                    step={0.05}
                                    value={muK}
                                    onChange={(e) => {
                                        setMuK(Number(e.target.value));
                                        handleReset();
                                    }}
                                    className="w-full accent-yellow-400"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Vector Toggles & Physics Formulas */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs">
                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-slate-400 font-bold">Tampilkan Vektor Gaya:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-red-400 hover:text-red-300">
                        <input
                            type="checkbox"
                            checked={showW}
                            onChange={(e) => setShowW(e.target.checked)}
                            className="rounded accent-red-500"
                        />
                        <span>W (Berat)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-sky-400 hover:text-sky-300">
                        <input
                            type="checkbox"
                            checked={showNormal}
                            onChange={(e) => setShowNormal(e.target.checked)}
                            className="rounded accent-sky-500"
                        />
                        <span>N (Normal)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-orange-400 hover:text-orange-300">
                        <input
                            type="checkbox"
                            checked={showComponents}
                            onChange={(e) => setShowComponents(e.target.checked)}
                            className="rounded accent-orange-500"
                        />
                        <span>W<sub>&parallel;</sub> &amp; W<sub>&perp;</sub></span>
                    </label>
                    {hasFriction && (
                        <label className="flex items-center gap-1.5 cursor-pointer text-yellow-400 hover:text-yellow-300">
                            <input
                                type="checkbox"
                                checked={showFriction}
                                onChange={(e) => setShowFriction(e.target.checked)}
                                className="rounded accent-yellow-500"
                            />
                            <span>f (Gesekan)</span>
                        </label>
                    )}
                </div>

                {/* Analytical Formula Summary */}
                <div className="text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/5 font-mono text-[11px]">
                    Persamaan Gerak: a = g(sin&theta; - &mu;<sub>k</sub>cos&theta;) = {acceleration.toFixed(2)} m/s&sup2;
                </div>
            </div>
        </div>
    );
}
