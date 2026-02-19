"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowDown, Info } from 'lucide-react';

const RealisticHydrostatic = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [depth, setDepth] = useState(2); // meters
    const [density, setDensity] = useState(1000); // kg/m^3
    const [gravity] = useState(9.8); // m/s^2
    const timeRef = useRef(0);

    // Physics constants
    const CONTAINER_HEIGHT_METERS = 10;
    const PIXELS_PER_METER = 40;

    // Calculated pressure
    const pressurePa = density * gravity * depth;
    const atmPressure = 101325;
    const absPressure = atmPressure + pressurePa;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            timeRef.current += 0.02;
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // --- 1. Draw Water (Sine Wave Surface) ---
            const waterLevelY = 50; // Starting Y position of water surface

            // ... (rest of render function) ...

            // Draw Water
            const gradient = ctx.createLinearGradient(0, waterLevelY, 0, height);
            gradient.addColorStop(0, "rgba(6, 182, 212, 0.4)"); // Cyan Surface
            gradient.addColorStop(1, "rgba(30, 58, 138, 0.9)"); // Deep Blue Bottom

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, waterLevelY);

            // Sine wave calculation for surface
            for (let x = 0; x <= width; x += 5) {
                const wave1 = Math.sin(x * 0.02 + timeRef.current) * 5;
                const wave2 = Math.sin(x * 0.05 - timeRef.current * 1.5) * 2;
                ctx.lineTo(x, waterLevelY + wave1 + wave2);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            // --- 2. Draw Bubbles (Particle System) ---
            const bubbleCount = 20;
            for (let i = 0; i < bubbleCount; i++) {
                const x = (Math.sin(i * 382.2 + timeRef.current * 0.1) + 1) * width / 2;
                const speed = (i % 3) + 1;
                const offset = (i * 92.2);
                let y = height - ((timeRef.current * 20 * speed + offset) % (height - waterLevelY));

                ctx.beginPath();
                ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fill();
            }

            // --- 3. Draw Object/Gauge at Depth ---
            const objectY = waterLevelY + (depth * PIXELS_PER_METER);

            // Gauge Line
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(width / 2 - 60, waterLevelY);
            ctx.lineTo(width / 2 - 60, objectY);
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Depth Label
            ctx.fillStyle = "white";
            ctx.font = "14px Inter";
            ctx.fillText(`${depth.toFixed(1)}m`, width / 2 - 50, waterLevelY + (depth * PIXELS_PER_METER) / 2);

            // Draw Sensor/Object
            ctx.beginPath();
            ctx.arc(width / 2, objectY, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#ef4444"; // Red dot
            ctx.shadowColor = "rgba(239, 68, 68, 0.8)";
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Pressure Vector Arrows (Force increases with depth)
            const arrowSize = 10 + (depth * 2);
            const arrowColor = `rgba(255,255,255, ${Math.min(0.8, 0.2 + depth * 0.1)})`;

            // Left Arrow pushing right
            ctx.beginPath();
            ctx.moveTo(width / 2 - 20 - arrowSize, objectY);
            ctx.lineTo(width / 2 - 20, objectY);
            ctx.lineTo(width / 2 - 25, objectY - 5);
            ctx.moveTo(width / 2 - 20, objectY);
            ctx.lineTo(width / 2 - 25, objectY + 5);
            ctx.strokeStyle = arrowColor;
            ctx.stroke();

            // Right Arrow pushing left
            ctx.beginPath();
            ctx.moveTo(width / 2 + 20 + arrowSize, objectY);
            ctx.lineTo(width / 2 + 20, objectY);
            ctx.lineTo(width / 2 + 25, objectY - 5);
            ctx.moveTo(width / 2 + 20, objectY);
            ctx.lineTo(width / 2 + 25, objectY + 5);
            ctx.strokeStyle = arrowColor;
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [depth, density]);


    return (
        <Card className="p-6 bg-cosmic-800/80 backdrop-blur border-cosmic-700 mt-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 text-[100px] font-black italic text-slate-800 pointer-events-none select-none -z-10 -translate-y-10 translate-x-10 group-hover:text-primary/10 transition-colors">
                SIM
            </div>

            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="bg-primary/20 text-primary p-1 rounded">Simulasi</span> Tekanan Hidrostatis
            </h3>
            <p className="text-sm text-slate-400 mb-6">
                Geser kedalaman untuk melihat perubahan tekanan secara real-time. Perhatikan bagaimana gaya tekan (panah) membesar di kedalaman.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative h-[400px] border-2 border-cosmic-600 rounded-xl overflow-hidden bg-cosmic-950 shadow-inner">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 font-mono border border-white/10">
                        Canvas Rendering • 60 FPS
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-cosmic-900/50 p-4 rounded-lg border border-cosmic-700">
                        <label className="block text-sm font-medium mb-3 flex justify-between">
                            <span>Kedalaman (h)</span>
                            <span className="text-accent font-bold">{depth.toFixed(1)} m</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="8"
                            step="0.1"
                            value={depth}
                            onChange={(e) => setDepth(parseFloat(e.target.value))}
                            className="w-full h-2 bg-cosmic-700 rounded-lg appearance-none cursor-pointer accent-accent hover:accent-primary transition-colors"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Permukaan</span>
                            <span>Dasar</span>
                        </div>
                    </div>

                    {/* Stats Display */}
                    <div className="space-y-3">
                        <div className="bg-gradient-to-br from-cosmic-900 to-cosmic-800 p-4 rounded-lg border border-cosmic-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
                            <div className="text-xs text-slate-400 mb-1">Tekanan Hidrostatis ($P_h$)</div>
                            <div className="text-2xl font-bold font-mono text-warning">
                                {pressurePa.toLocaleString()} <span className="text-sm text-slate-500">Pa</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                $\rho \cdot g \cdot h$
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cosmic-900 to-cosmic-800 p-4 rounded-lg border border-cosmic-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
                            <div className="text-xs text-slate-400 mb-1">Tekanan Mutlak (Absolute)</div>
                            <div className="text-2xl font-bold font-mono text-success">
                                {(absPressure / 1000).toFixed(2)} <span className="text-sm text-slate-500">kPa</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                                Termasuk Atmosfer (1 atm)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default RealisticHydrostatic;
