"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Sliders, ArrowRight } from "lucide-react";

export default function ConnectedBlocksSim() {
    // Parameters
    const [mA, setMA] = useState<number>(3); // kg
    const [mB, setMB] = useState<number>(4); // kg
    const [mC, setMC] = useState<number>(5); // kg
    const [forceF, setForceF] = useState<number>(60); // N
    const [mu, setMu] = useState<number>(0.2); // Koefisien gesek
    const g = 9.8; // m/s^2

    // Simulation state
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [positionX, setPositionX] = useState<number>(0); // Displacement in meters
    const [velocity, setVelocity] = useState<number>(0);
    const [simTime, setSimTime] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    // Physics calculations
    const totalMass = mA + mB + mC;
    const NA = mA * g;
    const NB = mB * g;
    const NC = mC * g;
    const WA = NA;
    const WB = NB;
    const WC = NC;

    const fA = mu * NA;
    const fB = mu * NB;
    const fC = mu * NC;
    const fTotal = fA + fB + fC;

    // Acceleration
    const netForce = forceF - fTotal;
    const willMove = netForce > 0;
    const acceleration = willMove ? netForce / totalMass : 0;

    // Tensions
    // FBD Balok A: T_AB - fA = mA * a => T_AB = mA * a + fA
    const TAB = willMove ? mA * acceleration + fA : Math.min(forceF * (mA / totalMass), fA);
    // FBD Balok A+B: T_BC - (fA + fB) = (mA + mB) * a => T_BC = (mA + mB)*a + (fA + fB)
    const TBC = willMove ? (mA + mB) * acceleration + (fA + fB) : Math.min(forceF * ((mA + mB) / totalMass), fA + fB);

    // Animation Loop
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

            if (willMove && acceleration > 0) {
                setSimTime(prev => prev + dt);
                setVelocity(prevV => {
                    const newV = prevV + acceleration * dt;
                    setPositionX(prevX => {
                        const newX = prevX + prevV * dt + 0.5 * acceleration * dt * dt;
                        if (newX >= 6.0) {
                            setIsRunning(false);
                            return 6.0;
                        }
                        return newX;
                    });
                    return newV;
                });
            } else {
                setIsRunning(false);
            }

            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning, willMove, acceleration]);

    const handleReset = () => {
        setIsRunning(false);
        setPositionX(0);
        setVelocity(0);
        setSimTime(0);
        lastTimestampRef.current = null;
    };

    // Canvas drawing matching exactly user's uploaded diagram
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

        // Dark clean canvas
        ctx.fillStyle = "#0c1020";
        ctx.fillRect(0, 0, width, height);

        // Floor baseline
        const floorY = height - 70;
        ctx.fillStyle = "#64748b";
        ctx.fillRect(20, floorY, width - 40, 10);

        // Floor ground stripes
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        for (let x = 20; x < width - 40; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, floorY + 10);
            ctx.lineTo(x - 8, floorY + 22);
            ctx.stroke();
        }

        // Acceleration dashed arrow on top right (as in user image: "--- a --->")
        const arrowStartX = width - 180;
        const arrowY = 35;
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowStartX + 90, arrowY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Red arrow head
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(arrowStartX + 90, arrowY);
        ctx.lineTo(arrowStartX + 80, arrowY - 5);
        ctx.lineTo(arrowStartX + 80, arrowY + 5);
        ctx.closePath();
        ctx.fill();

        // Label a
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 13px ui-monospace, sans-serif";
        ctx.fillText(`a = ${acceleration.toFixed(2)} m/s²`, arrowStartX + 10, arrowY - 8);

        // Blocks layout
        const pxDisplacement = (positionX / 6.0) * (width * 0.35);
        const baseStartX = 60 + pxDisplacement;
        const blockW = 60;
        const blockH = 60;
        const gap = 80;

        const blockAX = baseStartX;
        const blockBX = blockAX + blockW + gap;
        const blockCX = blockBX + blockW + gap;
        const blockY = floorY - blockH;

        // Draw Helper Arrow with arrowhead
        const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string, offsetLabelX = 0, offsetLabelY = 0) => {
            const headlen = 8;
            const angle = Math.atan2(y2 - y1, x2 - x1);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = color;
            ctx.font = "bold 11px ui-monospace, sans-serif";
            ctx.fillText(label, x2 + offsetLabelX, y2 + offsetLabelY);
        };

        // Render Block function
        const renderBlock = (bx: number, name: string, mass: number, N: number, W: number, f: number) => {
            // Block body (Blue gradient as user image)
            const grad = ctx.createLinearGradient(bx, blockY, bx + blockW, blockY);
            grad.addColorStop(0, "#2563eb");
            grad.addColorStop(0.5, "#3b82f6");
            grad.addColorStop(1, "#1d4ed8");

            ctx.fillStyle = grad;
            ctx.strokeStyle = "#1e3a8a";
            ctx.lineWidth = 2;
            ctx.fillRect(bx, blockY, blockW, blockH);
            ctx.strokeRect(bx, blockY, blockW, blockH);

            // Block Label (A, B, or C)
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px ui-monospace, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(name, bx + blockW / 2, blockY + blockH / 2);

            const centerX = bx + blockW / 2;

            // Gaya Normal N (Black arrow straight UP, as user image)
            drawArrow(centerX, blockY, centerX, blockY - 45, "#e2e8f0", `N_${name} = ${N.toFixed(1)} N`, -25, -6);

            // Gaya Berat W (Red arrow straight DOWN, as user image)
            drawArrow(centerX, blockY + blockH, centerX, blockY + blockH + 45, "#ef4444", `W_${name} = ${W.toFixed(1)} N`, -25, 14);

            // Gaya Gesek f (Yellow arrow pointing LEFT)
            if (f > 0) {
                drawArrow(bx, blockY + blockH - 4, bx - 30, blockY + blockH - 4, "#eab308", `f_${name}`, -25, -4);
            }
        };

        // Draw Cables with Opposing Tensions (TAB and TBC as user image)
        // Cable 1: between A and B
        const rope1Start = blockAX + blockW;
        const rope1End = blockBX;
        const ropeY = blockY + blockH / 2;

        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rope1Start, ropeY);
        ctx.lineTo(rope1End, ropeY);
        ctx.stroke();

        // Opposing arrows for TAB
        const mid1 = (rope1Start + rope1End) / 2;
        drawArrow(mid1, ropeY, rope1Start + 12, ropeY, "#38bdf8", "");
        drawArrow(mid1, ropeY, rope1End - 12, ropeY, "#38bdf8", "");
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px ui-monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`T_AB = ${TAB.toFixed(1)} N`, mid1, ropeY - 10);

        // Cable 2: between B and C
        const rope2Start = blockBX + blockW;
        const rope2End = blockCX;

        ctx.beginPath();
        ctx.moveTo(rope2Start, ropeY);
        ctx.lineTo(rope2End, ropeY);
        ctx.stroke();

        // Opposing arrows for TBC
        const mid2 = (rope2Start + rope2End) / 2;
        drawArrow(mid2, ropeY, rope2Start + 12, ropeY, "#38bdf8", "");
        drawArrow(mid2, ropeY, rope2End - 12, ropeY, "#38bdf8", "");
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`T_BC = ${TBC.toFixed(1)} N`, mid2, ropeY - 10);

        // Pulling Force F on C to the right
        const forceStartX = blockCX + blockW;
        drawArrow(forceStartX, ropeY, forceStartX + 50, ropeY, "#22c55e", `F = ${forceF} N`, 8, 4);

        // Draw all 3 blocks
        renderBlock(blockAX, "A", mA, NA, WA, fA);
        renderBlock(blockBX, "B", mB, NB, WB, fB);
        renderBlock(blockCX, "C", mC, NC, WC, fC);

    }, [mA, mB, mC, forceF, mu, positionX, acceleration, TAB, TBC, NA, NB, NC, WA, WB, WC, fA, fB, fC]);

    return (
        <div className="w-full bg-[#090d18] border border-blue-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            Simulasi Dinamika Partikel &amp; Tali
                        </span>
                        <span className="text-xs text-slate-400">Hukum II Newton 3 Benda Berangkai</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Sistem Balok A, B, C Dihubungkan Tali &amp; Gaya Tarik F
                    </h3>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono tracking-wide ${
                    willMove ? "bg-emerald-500/10 border-emerald-400 text-emerald-300" : "bg-rose-500/10 border-rose-400 text-rose-300"
                }`}>
                    {willMove ? `Bergerak Bersama (a = ${acceleration.toFixed(2)} m/s²)` : "Diam: Gaya Tarik F \u2264 Total Gesekan"}
                </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/8] md:aspect-[21/9] bg-[#0c1020] rounded-2xl border border-blue-500/20 overflow-hidden shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Telemetry Panel */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono text-xs space-y-1 shadow-lg pointer-events-none">
                    <div className="text-blue-400 font-bold border-b border-white/10 pb-1 mb-1 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Hasil Gaya &amp; Kinematika
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Percepatan (a):</span>
                        <span className="text-emerald-300 font-bold">{acceleration.toFixed(2)} m/s²</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tegangan Tali T_AB:</span>
                        <span className="text-cyan-300 font-bold">{TAB.toFixed(2)} N</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tegangan Tali T_BC:</span>
                        <span className="text-cyan-300 font-bold">{TBC.toFixed(2)} N</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Total Gaya Gesek:</span>
                        <span className="text-yellow-300 font-bold">{fTotal.toFixed(2)} N</span>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                            isRunning ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-blue-500 hover:bg-blue-400 text-white"
                        }`}
                    >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "Jeda" : "Tarik Benda"}
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

            {/* Customization Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-xs">
                {/* Massa A */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-blue-300 font-bold">Massa A (m_A):</span>
                        <span className="font-mono text-white font-bold">{mA} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={mA}
                        onChange={(e) => { setMA(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-blue-400"
                    />
                </div>

                {/* Massa B */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-blue-300 font-bold">Massa B (m_B):</span>
                        <span className="font-mono text-white font-bold">{mB} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={mB}
                        onChange={(e) => { setMB(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-blue-400"
                    />
                </div>

                {/* Massa C */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-blue-300 font-bold">Massa C (m_C):</span>
                        <span className="font-mono text-white font-bold">{mC} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={mC}
                        onChange={(e) => { setMC(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-blue-400"
                    />
                </div>

                {/* Gaya Tarik F */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-emerald-300 font-bold">Gaya Tarik (F):</span>
                        <span className="font-mono text-white font-bold">{forceF} N</span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={150}
                        step={5}
                        value={forceF}
                        onChange={(e) => { setForceF(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-emerald-400"
                    />
                </div>

                {/* Koefisien Gesek mu */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-yellow-300 font-bold">Koefisien Gesek (&mu;):</span>
                        <span className="font-mono text-white font-bold">{mu.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={0.5}
                        step={0.05}
                        value={mu}
                        onChange={(e) => { setMu(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-yellow-400"
                    />
                </div>
            </div>

            {/* Formula Step-by-Step Derivation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-white/5 font-mono text-xs">
                <div className="space-y-1">
                    <div className="text-emerald-400 font-bold">1. Percepatan Total (a):</div>
                    <p className="text-slate-300">
                        a = (F - &Sigma;f) / (m_A + m_B + m_C)
                    </p>
                    <p className="text-slate-400">
                        = ({forceF} - {fTotal.toFixed(1)}) / {totalMass} = <strong className="text-emerald-300">{acceleration.toFixed(2)} m/s²</strong>
                    </p>
                </div>
                <div className="space-y-1">
                    <div className="text-cyan-400 font-bold">2. Tegangan Tali T_AB:</div>
                    <p className="text-slate-300">
                        T_AB = m_A &times; a + f_A
                    </p>
                    <p className="text-slate-400">
                        = ({mA} &times; {acceleration.toFixed(2)}) + {fA.toFixed(1)} = <strong className="text-cyan-300">{TAB.toFixed(2)} N</strong>
                    </p>
                </div>
                <div className="space-y-1">
                    <div className="text-cyan-400 font-bold">3. Tegangan Tali T_BC:</div>
                    <p className="text-slate-300">
                        T_BC = (m_A + m_B) &times; a + (f_A + f_B)
                    </p>
                    <p className="text-slate-400">
                        = ({mA + mB} &times; {acceleration.toFixed(2)}) + {(fA + fB).toFixed(1)} = <strong className="text-cyan-300">{TBC.toFixed(2)} N</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
