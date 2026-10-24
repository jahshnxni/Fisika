"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Trophy, Sliders, Zap } from "lucide-react";

interface RollingObject {
    id: string;
    name: string;
    k: number; // I / (m R^2)
    formulaI: string;
    color: string;
    rank: number;
    description: string;
}

const SHAPES: RollingObject[] = [
    { id: "solid_sphere", name: "Bola Pejal", k: 0.4, formulaI: "2/5 mR²", color: "#38bdf8", rank: 1, description: "Konsentrasi massa paling dekat ke pusat. Momen inersia terkecil -> percepatan linier terbesar." },
    { id: "solid_cylinder", name: "Silinder Pejal", k: 0.5, formulaI: "1/2 mR²", color: "#fb923c", rank: 2, description: "Distribusi massa merata. Menggelinding lebih cepat daripada bola berongga dan cincin." },
    { id: "hollow_sphere", name: "Bola Berongga", k: 2 / 3, formulaI: "2/3 mR²", color: "#a855f7", rank: 3, description: "Massa berada di kulit bola, inersia lebih besar daripada benda pejal." },
    { id: "hoop", name: "Cincin / Pipa Tipis", k: 1.0, formulaI: "mR²", color: "#f43f5e", rank: 4, description: "Seluruh massa berada di jari-jari terluar R. Inersia maksimum -> percepatan paling lambat." },
];

export default function RotationalDynamicsSim() {
    const [theta, setTheta] = useState<number>(30); // derajat
    const [selectedShapeId, setSelectedShapeId] = useState<string>("all"); // 'all' for race mode
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [simTime, setSimTime] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    const g = 9.8;
    const rampLength = 8.0; // meter
    const rad = (theta * Math.PI) / 180;
    const sinTheta = Math.sin(rad);

    // Positions for each object (distance along ramp in meters)
    const [distances, setDistances] = useState<Record<string, number>>({
        solid_sphere: 0,
        solid_cylinder: 0,
        hollow_sphere: 0,
        hoop: 0,
    });

    // Rotation angles in radians
    const [angles, setAngles] = useState<Record<string, number>>({
        solid_sphere: 0,
        solid_cylinder: 0,
        hollow_sphere: 0,
        hoop: 0,
    });

    // Animation Loop
    useEffect(() => {
        if (!isRunning) {
            lastTimestampRef.current = null;
            return;
        }

        const step = (timestamp: number) => {
            if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
            const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
            lastTimestampRef.current = timestamp;

            setSimTime(prevT => prevT + dt);

            setDistances(prevD => {
                const nextD = { ...prevD };
                let allFinished = true;

                SHAPES.forEach(shape => {
                    // a = g * sin(theta) / (1 + k)
                    const a = (g * sinTheta) / (1 + shape.k);
                    const curD = prevD[shape.id] || 0;
                    if (curD < rampLength) {
                        const newD = curD + a * dt * dt * 0.5 + Math.sqrt(Math.max(0, 2 * a * curD)) * dt;
                        nextD[shape.id] = Math.min(rampLength, newD);
                        allFinished = false;
                    }
                });

                if (allFinished) setIsRunning(false);
                return nextD;
            });

            setAngles(prevA => {
                const nextA = { ...prevA };
                const radiusPx = 18;
                SHAPES.forEach(shape => {
                    const d = distances[shape.id] || 0;
                    nextA[shape.id] = (d * 55) / radiusPx;
                });
                return nextA;
            });

            animationFrameRef.current = requestAnimationFrame(step);
        };

        animationFrameRef.current = requestAnimationFrame(step);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning, sinTheta, distances]);

    const handleReset = () => {
        setIsRunning(false);
        setSimTime(0);
        setDistances({ solid_sphere: 0, solid_cylinder: 0, hollow_sphere: 0, hoop: 0 });
        setAngles({ solid_sphere: 0, solid_cylinder: 0, hollow_sphere: 0, hoop: 0 });
        lastTimestampRef.current = null;
    };

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

        // Dark canvas
        ctx.fillStyle = "#0a0e1c";
        ctx.fillRect(0, 0, width, height);

        // Ramp Geometry
        const startX = 60;
        const groundY = height - 50;
        const maxRampPx = width - 120;
        const rampBasePx = maxRampPx * Math.cos(rad);
        const rampHeightPx = maxRampPx * Math.sin(rad);

        const endX = startX + rampBasePx;
        const topY = groundY - rampHeightPx;

        // Ground Floor
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, groundY);
        ctx.lineTo(width - 20, groundY);
        ctx.stroke();

        // Wedge
        ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, groundY);
        ctx.lineTo(endX, groundY);
        ctx.lineTo(startX, topY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Finish Line
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(endX, groundY - 50);
        ctx.lineTo(endX, groundY + 10);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 11px ui-monospace, sans-serif";
        ctx.fillText("FINISH", endX - 20, groundY - 55);

        // Draw Rolling Objects
        const shapesToDraw = selectedShapeId === "all" ? SHAPES : SHAPES.filter(s => s.id === selectedShapeId);
        const radius = 18;

        shapesToDraw.forEach((shape, idx) => {
            const fraction = Math.min(1.0, (distances[shape.id] || 0) / rampLength);
            const rampDistPx = fraction * (maxRampPx - 40) + 20;

            // In race mode, slight vertical track offset for clarity
            const trackOffset = (idx - 1.5) * 6;
            const cx = startX + rampDistPx * Math.cos(rad) - radius * Math.sin(rad) + trackOffset * Math.sin(rad);
            const cy = topY + rampDistPx * Math.sin(rad) - radius * Math.cos(rad) - trackOffset * Math.cos(rad);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angles[shape.id] || 0);

            // Shape Circle Body
            ctx.fillStyle = shape.color;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Internal Spokes (to visualize rolling rotation)
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const spAngle = (i * Math.PI) / 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(radius * Math.cos(spAngle), radius * Math.sin(spAngle));
                ctx.stroke();
            }

            // Center hub
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Label above object
            ctx.fillStyle = shape.color;
            ctx.font = "bold 10px ui-monospace, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${shape.name}`, cx, cy - radius - 6);
        });

    }, [theta, rad, selectedShapeId, distances, angles]);

    return (
        <div className="w-full bg-[#080d19] border border-cyan-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/30">
                            Simulasi Dinamika Rotasi
                        </span>
                        <span className="text-xs text-slate-400">Momen Inersia &amp; Gerak Menggelinding Murni</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Balap Menggelinding di Bidang Miring: Bola vs Silinder vs Cincin
                    </h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-white/10">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                            isRunning ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-orange-500 hover:bg-orange-400 text-white"
                        }`}
                    >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "Jeda" : "Mulai Balapan"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        title="Reset Balapan"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative w-full aspect-[16/8] md:aspect-[21/9] bg-[#0a0e1c] rounded-2xl border border-orange-500/20 overflow-hidden shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Racing Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {SHAPES.map((shape) => {
                    const a = (g * sinTheta) / (1 + shape.k);
                    const vFinish = Math.sqrt(2 * a * rampLength);

                    return (
                        <div
                            key={shape.id}
                            className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2 relative overflow-hidden"
                            style={{ borderTopColor: shape.color, borderTopWidth: 3 }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-white">{shape.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white/5 text-slate-300">
                                    Juara #{shape.rank}
                                </span>
                            </div>

                            <div className="font-mono text-xs space-y-1">
                                <div className="flex justify-between text-slate-400">
                                    <span>Momen Inersia:</span>
                                    <span className="text-white font-bold">{shape.formulaI}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Konstanta (k):</span>
                                    <span className="text-yellow-400 font-bold">{shape.k.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Percepatan (a):</span>
                                    <span className="text-emerald-400 font-bold">{a.toFixed(2)} m/s²</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Kecepatan Akhir:</span>
                                    <span className="text-cyan-400 font-bold">{vFinish.toFixed(2)} m/s</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-tight pt-1">
                                {shape.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Incline Angle Slider */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 w-full md:w-1/2">
                    <span className="text-amber-300 font-bold whitespace-nowrap">Sudut Kemiringan (&theta;):</span>
                    <input
                        type="range"
                        min={10}
                        max={60}
                        step={1}
                        value={theta}
                        onChange={(e) => { setTheta(Number(e.target.value)); handleReset(); }}
                        className="w-full accent-amber-400"
                    />
                    <span className="font-mono font-bold text-white whitespace-nowrap">{theta}&deg;</span>
                </div>

                <div className="text-slate-300 font-mono text-[11px] bg-slate-950/70 px-3 py-1.5 rounded-lg border border-white/5">
                    Rumus Universal Percepatan Menggelinding: a = g &times; sin(&theta;) / (1 + k)
                </div>
            </div>
        </div>
    );
}
