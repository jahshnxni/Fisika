"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, Zap, ShieldAlert } from "lucide-react";

export type ElevatorMode =
    | "rest"
    | "up_accel"
    | "up_decel"
    | "down_accel"
    | "down_decel"
    | "free_fall";

export default function ElevatorApparentWeightSim() {
    const [mass, setMass] = useState<number>(60); // kg (massa orang)
    const [accelVal, setAccelVal] = useState<number>(2.5); // m/s^2 (percepatan lift)
    const [mode, setMode] = useState<ElevatorMode>("up_accel");
    const [isRunning, setIsRunning] = useState<boolean>(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const g = 9.8; // m/s^2
    const realWeight = mass * g; // W = mg

    // Determine effective acceleration vector and apparent weight N
    let effectiveA = 0; // positive means upward acceleration of elevator
    let modeLabel = "";
    let statusDescription = "";

    switch (mode) {
        case "rest":
            effectiveA = 0;
            modeLabel = "Diam / GLB (a = 0)";
            statusDescription = "Lift diam atau bergerak dengan kecepatan tetap. Gaya normal sama persis dengan gaya berat asli.";
            break;
        case "up_accel":
            effectiveA = accelVal;
            modeLabel = "Naik Dipercepat (a \u2191)";
            statusDescription = "Lantai lift mendorong lebih kuat ke atas untuk mempercepat tubuh. Timbangan membaca lebih berat!";
            break;
        case "up_decel":
            effectiveA = -accelVal;
            modeLabel = "Naik Diperlambat (a \u2193)";
            statusDescription = "Lift mengerem saat mendekati lantai atas. Tubuh cenderung terangkat, timbangan membaca lebih ringan.";
            break;
        case "down_accel":
            effectiveA = -accelVal;
            modeLabel = "Turun Dipercepat (a \u2193)";
            statusDescription = "Lantai lift meluncur ke bawah menjauhi kaki. Tekanan pada timbangan berkurang, terasa lebih ringan.";
            break;
        case "down_decel":
            effectiveA = accelVal;
            modeLabel = "Turun Diperlambat (a \u2191)";
            statusDescription = "Lift mengerem saat mendekati dasar. Lantai lift menahan tubuh lebih kuat, timbangan membaca lebih berat.";
            break;
        case "free_fall":
            effectiveA = -g;
            modeLabel = "\u26a0\ufe0f Kabel Putus / Jatuh Bebas (a = g \u2193)";
            statusDescription = "Lift dan penumpang jatuh dengan percepatan gravitasi yang sama. Terjadi keadaan tanpa bobot (N = 0)!";
            break;
    }

    // N = m * (g + effectiveA)
    const normalForce = Math.max(0, mass * (g + effectiveA));
    const apparentMass = normalForce / g;

    // Canvas animation state (elevator position)
    const [cabinY, setCabinY] = useState<number>(0); // -1.0 to +1.0
    const [cabinSpeed, setCabinSpeed] = useState<number>(0);

    useEffect(() => {
        if (!isRunning) return;

        let frameId: number;
        let lastTime = performance.now();

        const loop = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.05);
            lastTime = time;

            setCabinY((prev) => {
                let speed = 0;
                if (mode === "up_accel" || mode === "down_decel") speed = -0.4;
                else if (mode === "down_accel" || mode === "up_decel") speed = 0.4;
                else if (mode === "free_fall") speed = 1.2;

                let next = prev + speed * dt;
                if (next > 0.8) next = -0.8;
                if (next < -0.8) next = 0.8;
                return next;
            });

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [isRunning, mode]);

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

        // Dark shaft background
        ctx.fillStyle = "#0a0e1a";
        ctx.fillRect(0, 0, width, height);

        // Elevator Shaft Frame
        const shaftX = width / 2 - 90;
        const shaftW = 180;
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 3;
        ctx.strokeRect(shaftX, 10, shaftW, height - 20);

        // Guide rails on sides
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shaftX + 6, 10);
        ctx.lineTo(shaftX + 6, height - 10);
        ctx.moveTo(shaftX + shaftW - 6, 10);
        ctx.lineTo(shaftX + shaftW - 6, height - 10);
        ctx.stroke();

        // Pulley wheel at top
        const pulleyX = width / 2;
        const pulleyY = 22;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Cabin dimensions
        const cabinW = 140;
        const cabinH = 150;
        const cabinCenterX = width / 2;
        const cabinTopY = height / 2 - cabinH / 2 + cabinY * 60;
        const cabinLeftX = cabinCenterX - cabinW / 2;

        // Suspension cable from pulley to cabin
        if (mode !== "free_fall") {
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(pulleyX, pulleyY);
            ctx.lineTo(cabinCenterX, cabinTopY);
            ctx.stroke();
        } else {
            // Broken snap cable visualization
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(pulleyX, pulleyY);
            ctx.lineTo(pulleyX - 4, pulleyY + 18);
            ctx.stroke();
        }

        // Draw Elevator Cabin Box
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cabinLeftX, cabinTopY, cabinW, cabinH, 10);
        ctx.fill();
        ctx.stroke();

        // Cabin interior ceiling light
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(cabinLeftX + 40, cabinTopY + 4, cabinW - 80, 4);

        // Scale on the floor
        const scaleW = 60;
        const scaleH = 10;
        const scaleX = cabinCenterX - scaleW / 2;
        const scaleY = cabinTopY + cabinH - scaleH - 8;

        ctx.fillStyle = "#0f766e";
        ctx.strokeStyle = "#2dd4bf";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(scaleX, scaleY, scaleW, scaleH, 4);
        ctx.fill();
        ctx.stroke();

        // Digital LED readout on scale
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 9px ui-monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${apparentMass.toFixed(1)} kg`, cabinCenterX, scaleY + 8);

        // Passenger Character standing on scale
        // In free fall, passenger floats 15px above scale!
        const floatOffset = mode === "free_fall" ? -18 : 0;
        const footY = scaleY + floatOffset;
        const headY = footY - 70;

        // Passenger Body
        ctx.fillStyle = "#f59e0b";
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;

        // Head
        ctx.beginPath();
        ctx.arc(cabinCenterX, headY + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Torso
        ctx.fillStyle = "#3b82f6";
        ctx.strokeStyle = "#60a5fa";
        ctx.beginPath();
        ctx.roundRect(cabinCenterX - 10, headY + 22, 20, 28, 4);
        ctx.fill();
        ctx.stroke();

        // Legs
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cabinCenterX - 5, headY + 50);
        ctx.lineTo(cabinCenterX - 5, footY);
        ctx.moveTo(cabinCenterX + 5, headY + 50);
        ctx.lineTo(cabinCenterX + 5, footY);
        ctx.stroke();

        // Helper Arrow
        const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string, offsetLabelX = 0, offsetLabelY = 0) => {
            const headlen = 7;
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
            ctx.font = "bold 10px ui-monospace, sans-serif";
            ctx.fillText(label, x2 + offsetLabelX, y2 + offsetLabelY);
        };

        // Center of mass for forces
        const cmX = cabinCenterX + 28;
        const cmY = headY + 35;

        // Vector W (Gravity, straight DOWN, constant magnitude)
        const wLen = 42;
        drawArrow(cmX, cmY, cmX, cmY + wLen, "#ef4444", `W = ${realWeight.toFixed(0)} N`, 10, 4);

        // Vector N (Normal force, straight UP, dynamic magnitude)
        const nLen = (normalForce / realWeight) * 42;
        if (normalForce > 5) {
            drawArrow(cmX, cmY, cmX, cmY - nLen, "#06b6d4", `N = ${normalForce.toFixed(0)} N`, 10, 0);
        } else {
            // N = 0 indicator
            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 11px ui-monospace, sans-serif";
            ctx.fillText("N = 0 N", cmX + 25, cmY);
        }

    }, [mass, accelVal, mode, cabinY, normalForce, realWeight, apparentMass]);

    return (
        <div className="w-full bg-[#080d19] border border-cyan-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            Simulasi Gaya Normal &amp; Berat Semu
                        </span>
                        <span className="text-xs text-slate-400">Hukum Newton dalam Kerangka Non-Inersia</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Gerak Lift &amp; Pembacaan Skala Timbangan (Gaya Normal N)
                    </h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold">
                    {modeLabel}
                </div>
            </div>

            {/* Stage: Canvas + Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Canvas Viewport */}
                <div className="lg:col-span-6 relative aspect-[4/3] bg-[#0a0e1a] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-inner flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full block" />
                </div>

                {/* Telemetry & Analysis Panel */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900/70 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="space-y-4">
                        <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                            {statusDescription}
                        </div>

                        {/* Live Force Comparison Display */}
                        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                            <div className="bg-[#0b0f19] p-3 rounded-xl border border-red-500/30">
                                <div className="text-red-400 font-bold mb-1">Gaya Berat Nyata (W):</div>
                                <div className="text-xl font-bold text-white">{realWeight.toFixed(1)} N</div>
                                <div className="text-[10px] text-slate-400">W = m &times; g = {mass} &times; {g}</div>
                            </div>
                            <div className="bg-[#0b0f19] p-3 rounded-xl border border-cyan-500/30">
                                <div className="text-cyan-400 font-bold mb-1">Gaya Normal / Semu (N):</div>
                                <div className="text-xl font-bold text-cyan-300">{normalForce.toFixed(1)} N</div>
                                <div className="text-[10px] text-slate-400">Skala terbaca: {apparentMass.toFixed(1)} kg</div>
                            </div>
                        </div>

                        {/* Mathematical Formula Formula Card */}
                        <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 font-mono text-xs space-y-1">
                            <span className="text-yellow-400 font-bold">Persamaan Hukum II Newton:</span>
                            <div className="text-slate-300">
                                &Sigma;F = m &times; a &implies; N - mg = m(a_lift)
                            </div>
                            <div className="text-emerald-400 font-bold">
                                N = m(g + a) = {mass} &times; ({g} + ({effectiveA.toFixed(1)})) = {normalForce.toFixed(1)} N
                            </div>
                        </div>
                    </div>

                    {/* Mode Buttons */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-xs text-slate-400 font-bold block">Pilih Kondisi Gerak Lift:</span>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <button
                                onClick={() => setMode("rest")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "rest" ? "bg-cyan-500 text-slate-950 font-bold shadow" : "bg-slate-800 text-slate-300 border-white/5"
                                }`}
                            >
                                Diam / GLB
                            </button>
                            <button
                                onClick={() => setMode("up_accel")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "up_accel" ? "bg-cyan-500 text-slate-950 font-bold shadow" : "bg-slate-800 text-slate-300 border-white/5"
                                }`}
                            >
                                Naik Dipercepat
                            </button>
                            <button
                                onClick={() => setMode("up_decel")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "up_decel" ? "bg-cyan-500 text-slate-950 font-bold shadow" : "bg-slate-800 text-slate-300 border-white/5"
                                }`}
                            >
                                Naik Diperlambat
                            </button>
                            <button
                                onClick={() => setMode("down_accel")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "down_accel" ? "bg-cyan-500 text-slate-950 font-bold shadow" : "bg-slate-800 text-slate-300 border-white/5"
                                }`}
                            >
                                Turun Dipercepat
                            </button>
                            <button
                                onClick={() => setMode("down_decel")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "down_decel" ? "bg-cyan-500 text-slate-950 font-bold shadow" : "bg-slate-800 text-slate-300 border-white/5"
                                }`}
                            >
                                Turun Diperlambat
                            </button>
                            <button
                                onClick={() => setMode("free_fall")}
                                className={`p-2 rounded-xl border transition-all text-center ${
                                    mode === "free_fall" ? "bg-rose-500 text-white font-bold shadow animate-pulse" : "bg-slate-800 text-rose-300 border-rose-500/20"
                                }`}
                            >
                                Kabel Putus!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customization Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-xs">
                {/* Massa Orang */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-cyan-300 font-bold">Massa Orang (m):</span>
                        <span className="font-mono text-white font-bold">{mass} kg</span>
                    </div>
                    <input
                        type="range"
                        min={30}
                        max={100}
                        step={1}
                        value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>30 kg</span>
                        <span>60 kg</span>
                        <span>100 kg</span>
                    </div>
                </div>

                {/* Percepatan Lift */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-yellow-300 font-bold">Besar Percepatan Lift (|a|):</span>
                        <span className="font-mono text-white font-bold">{accelVal.toFixed(1)} m/s²</span>
                    </div>
                    <input
                        type="range"
                        min={0.5}
                        max={6.0}
                        step={0.5}
                        value={accelVal}
                        onChange={(e) => setAccelVal(Number(e.target.value))}
                        disabled={mode === "rest" || mode === "free_fall"}
                        className="w-full accent-yellow-400 disabled:opacity-40"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0.5 m/s²</span>
                        <span>3.0 m/s²</span>
                        <span>6.0 m/s²</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
