"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Sliders, ArrowUp, ArrowDown } from "lucide-react";

export default function PulleySystemSim() {
    const [m1, setM1] = useState<number>(6); // kg
    const [m2, setM2] = useState<number>(3); // kg
    const [g, setG] = useState<number>(9.8); // m/s^2

    // Simulation state
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [yOffset, setYOffset] = useState<number>(0); // Displacement (meter)
    const [velocity, setVelocity] = useState<number>(0); // m/s
    const [simTime, setSimTime] = useState<number>(0); // s

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);
    const maxTravel = 2.5; // Max displacement in meters

    // Physics
    const totalMass = m1 + m2;
    const diffMass = m1 - m2;
    const acceleration = totalMass > 0 ? (diffMass / totalMass) * g : 0;
    const tension = totalMass > 0 ? (2 * m1 * m2 * g) / totalMass : 0;

    const W1 = m1 * g;
    const W2 = m2 * g;

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

            setSimTime((prev) => prev + dt);
            setVelocity((prevV) => {
                const newV = prevV + acceleration * dt;
                setYOffset((prevY) => {
                    const newY = prevY + prevV * dt + 0.5 * acceleration * dt * dt;
                    if (Math.abs(newY) >= maxTravel) {
                        setIsRunning(false);
                        return newY > 0 ? maxTravel : -maxTravel;
                    }
                    return newY;
                });
                return newV;
            });

            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRunning, acceleration]);

    const handleReset = () => {
        setIsRunning(false);
        setYOffset(0);
        setVelocity(0);
        setSimTime(0);
        lastTimestampRef.current = null;
    };

    // Render Canvas
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

        // Background
        ctx.fillStyle = "#0c0f1d";
        ctx.fillRect(0, 0, width, height);

        // Ceiling
        const ceilingY = 30;
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 120, ceilingY);
        ctx.lineTo(width / 2 + 120, ceilingY);
        ctx.stroke();

        // Ceiling hash marks
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        for (let x = width / 2 - 110; x <= width / 2 + 110; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, ceilingY);
            ctx.lineTo(x + 10, ceilingY - 12);
            ctx.stroke();
        }

        // Pulley mount
        const pulleyCenterX = width / 2;
        const pulleyCenterY = 95;
        const pulleyRadius = 45;

        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(pulleyCenterX, ceilingY);
        ctx.lineTo(pulleyCenterX, pulleyCenterY);
        ctx.stroke();

        // Pulley Wheel
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pulleyCenterX, pulleyCenterY, pulleyRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pulley Spokes (Rotate with displacement)
        const rotationAngle = (yOffset / (pulleyRadius * 0.05)) * Math.PI;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const angle = rotationAngle + (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(pulleyCenterX, pulleyCenterY);
            ctx.lineTo(
                pulleyCenterX + pulleyRadius * Math.cos(angle),
                pulleyCenterY + pulleyRadius * Math.sin(angle)
            );
            ctx.stroke();
        }

        // Pulley Axle
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(pulleyCenterX, pulleyCenterY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pixel scaling for displacement
        const pxPerMeter = 55;
        const baseHangingY = pulleyCenterY + 110;

        // Mass 1 (Left): goes DOWN when yOffset > 0
        const m1X = pulleyCenterX - pulleyRadius;
        const m1Y = baseHangingY + yOffset * pxPerMeter;

        // Mass 2 (Right): goes UP when yOffset > 0
        const m2X = pulleyCenterX + pulleyRadius;
        const m2Y = baseHangingY - yOffset * pxPerMeter;

        // Rope Left
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(m1X, pulleyCenterY);
        ctx.lineTo(m1X, m1Y);
        ctx.stroke();

        // Rope Right
        ctx.beginPath();
        ctx.moveTo(m2X, pulleyCenterY);
        ctx.lineTo(m2X, m2Y);
        ctx.stroke();

        // Rope over pulley
        ctx.beginPath();
        ctx.arc(pulleyCenterX, pulleyCenterY, pulleyRadius, Math.PI, 0);
        ctx.stroke();

        // Draw Masses
        const drawMass = (x: number, y: number, m: number, label: string, color: string) => {
            const size = 32 + Math.min(m * 2.5, 30);
            ctx.fillStyle = color;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x - size / 2, y, size, size, 8);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 12px ui-monospace, SFMono-Regular, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, x, y + size / 2 - 7);
            ctx.fillText(`${m} kg`, x, y + size / 2 + 7);

            return size;
        };

        const size1 = drawMass(m1X, m1Y, m1, "m\u2081", "#38bdf8");
        const size2 = drawMass(m2X, m2Y, m2, "m\u2082", "#fb923c");

        // Helper Arrow
        const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string, alignRight = false) => {
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

            ctx.fillStyle = color;
            ctx.font = "bold 11px ui-monospace, SFMono-Regular, monospace";
            ctx.textAlign = alignRight ? "right" : "left";
            ctx.fillText(label, x2 + (alignRight ? -8 : 8), y2);
        };

        // FBD for Mass 1
        const tLen = Math.min(tension * 0.7, 50);
        const w1Len = Math.min(W1 * 0.7, 50);
        const w2Len = Math.min(W2 * 0.7, 50);

        // Tension T on m1 (pointing UP)
        drawArrow(m1X, m1Y, m1X, m1Y - tLen, "#06b6d4", `T = ${tension.toFixed(1)}N`, true);
        // Weight W1 on m1 (pointing DOWN)
        drawArrow(m1X, m1Y + size1, m1X, m1Y + size1 + w1Len, "#ef4444", `W\u2081 = ${W1.toFixed(1)}N`, true);

        // Tension T on m2 (pointing UP)
        drawArrow(m2X, m2Y, m2X, m2Y - tLen, "#06b6d4", `T = ${tension.toFixed(1)}N`, false);
        // Weight W2 on m2 (pointing DOWN)
        drawArrow(m2X, m2Y + size2, m2X, m2Y + size2 + w2Len, "#f97316", `W\u2082 = ${W2.toFixed(1)}N`, false);
    }, [m1, m2, g, yOffset, tension, W1, W2]);

    return (
        <div className="w-full bg-[#0a0d18] border border-cyan-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Simulasi Dinamika Katrol
                        </span>
                        <span className="text-xs text-slate-400">Mesin Atwood & Tegangan Tali</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Gerak Sistem Katrol Atwood Dua Beban & Diagram Gaya
                    </h3>
                </div>

                {/* Status */}
                <div className="px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold font-mono">
                    {m1 === m2
                        ? "Keseimbangan Statis (a = 0)"
                        : m1 > m2
                        ? "m\u2081 Bergerak Turun, m\u2082 Bergerak Naik"
                        : "m\u2082 Bergerak Turun, m\u2081 Bergerak Naik"}
                </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#0c0f1d] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Telemetry */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono text-xs space-y-1 shadow-lg pointer-events-none">
                    <div className="text-slate-400 font-bold border-b border-white/10 pb-1 mb-1 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Hasil Perhitungan Dinamika
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Percepatan (a):</span>
                        <span className="text-cyan-300 font-bold">{Math.abs(acceleration).toFixed(2)} m/s&sup2;</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tegangan Tali (T):</span>
                        <span className="text-yellow-400 font-bold">{tension.toFixed(2)} N</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Kecepatan (v):</span>
                        <span className="text-emerald-300 font-bold">{Math.abs(velocity).toFixed(2)} m/s</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Perpindahan:</span>
                        <span className="text-amber-300 font-bold">{Math.abs(yOffset).toFixed(2)} m</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                            isRunning
                                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                        }`}
                    >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "Jeda" : "Mulai Gerak"}
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

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                {/* Massa 1 */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-sky-300 font-bold">Massa m&sub1; (Kiri):</span>
                        <span className="font-mono text-white font-bold">{m1} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={15}
                        step={0.5}
                        value={m1}
                        onChange={(e) => {
                            setM1(Number(e.target.value));
                            handleReset();
                        }}
                        className="w-full accent-sky-400"
                    />
                </div>

                {/* Massa 2 */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-orange-300 font-bold">Massa m&sub2; (Kanan):</span>
                        <span className="font-mono text-white font-bold">{m2} kg</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={15}
                        step={0.5}
                        value={m2}
                        onChange={(e) => {
                            setM2(Number(e.target.value));
                            handleReset();
                        }}
                        className="w-full accent-orange-400"
                    />
                </div>

                {/* Gravitasi */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-emerald-300 font-bold">Percepatan Gravitasi (g):</span>
                        <span className="font-mono text-white font-bold">{g} m/s&sup2;</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={() => {
                                setG(9.8);
                                handleReset();
                            }}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                                g === 9.8
                                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                    : "bg-slate-800 border-white/5 text-slate-400"
                            }`}
                        >
                            g = 9.8 m/s&sup2; (Presisi)
                        </button>
                        <button
                            onClick={() => {
                                setG(10);
                                handleReset();
                            }}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                                g === 10
                                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                    : "bg-slate-800 border-white/5 text-slate-400"
                            }`}
                        >
                            g = 10 m/s&sup2; (Standar TKA)
                        </button>
                    </div>
                </div>
            </div>

            {/* Formula Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-white/5 font-mono text-xs">
                <div>
                    <span className="text-cyan-400 font-bold">Rumus Percepatan Sistem:</span>
                    <p className="text-slate-300 mt-1">
                        a = |m&sub1; - m&sub2;| / (m&sub1; + m&sub2;) &times; g = |{m1} - {m2}| / ({m1} + {m2}) &times; {g} ={" "}
                        <strong className="text-emerald-400">{Math.abs(acceleration).toFixed(2)} m/s&sup2;</strong>
                    </p>
                </div>
                <div>
                    <span className="text-yellow-400 font-bold">Rumus Tegangan Tali:</span>
                    <p className="text-slate-300 mt-1">
                        T = (2 &times; m&sub1; &times; m&sub2; / (m&sub1; + m&sub2;)) &times; g ={" "}
                        <strong className="text-yellow-300">{tension.toFixed(2)} N</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
