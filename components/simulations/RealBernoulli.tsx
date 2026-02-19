"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Gauge, Info, Play, Pause, RotateCcw } from 'lucide-react';

const RealBernoulli = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [pipeWidth1, setPipeWidth1] = useState(80); // Pixels
    const [pipeWidth2, setPipeWidth2] = useState(40); // Pixels

    // Refs for animation loop to access latest state without re-triggering effect
    const width1Ref = useRef(80);
    const width2Ref = useRef(40);

    // Update refs when state changes
    useEffect(() => {
        width1Ref.current = pipeWidth1;
        width2Ref.current = pipeWidth2;
    }, [pipeWidth1, pipeWidth2]);

    // Physics State
    const particles = useRef<any[]>([]);
    const timeRef = useRef(0);
    const animationFrameId = useRef<number | null>(null);

    // Constants
    const CAN_W = 600;
    const CAN_H = 400;
    const FLOW_SPEED_BASE = 2; // Base speed factor

    // Math helpers
    const getSpeedAtX = (x: number) => {
        // Simple map: 0->300 (Section 1), 300->600 (Section 2)
        // Transition region: 250->350

        // Use REF values for performance
        let currentWidth = width1Ref.current;
        const p1 = width1Ref.current;
        const p2 = width2Ref.current;

        if (x > 250 && x < 350) {
            // Linear interpolate width
            const t = (x - 250) / 100;
            currentWidth = p1 + (p2 - p1) * t;
        } else if (x >= 350) {
            currentWidth = p2;
        }

        // Continuity Equation: A1*v1 = A2*v2 => v is inversely proportional to width (in 2D approx)
        // v = Constant / Width
        const velocity = (FLOW_SPEED_BASE * 80) / currentWidth;
        return { velocity, currentWidth };
    }

    const initParticles = () => {
        const newParticles = [];
        for (let i = 0; i < 300; i++) {
            newParticles.push({
                x: Math.random() * CAN_W,
                y: Math.random() * width1Ref.current - width1Ref.current / 2, // Relative to center
                vx: 0,
                color: `hsla(${200 + Math.random() * 40}, 100%, 70%, 0.6)`
            });
        }
        particles.current = newParticles;
    }

    useEffect(() => {
        initParticles();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for non-transparent canvas if possible
        if (!ctx) return;

        const render = () => {
            if (!isPlaying) return;

            timeRef.current += 1;

            // Use REFS inside loop
            const w1 = width1Ref.current;
            const w2 = width2Ref.current;

            // Clear
            ctx.fillStyle = "#020617"; // cosmic-950
            ctx.fillRect(0, 0, CAN_W, CAN_H);

            const centerY = CAN_H / 2;

            // --- 1. Draw Pipe Walls ---
            ctx.beginPath();
            ctx.strokeStyle = "#334155"; // cosmic-700
            ctx.lineWidth = 4;

            // Top Wall
            ctx.moveTo(0, centerY - w1 / 2);
            ctx.lineTo(250, centerY - w1 / 2);
            ctx.lineTo(350, centerY - w2 / 2);
            ctx.lineTo(CAN_W, centerY - w2 / 2);

            // Bottom Wall
            ctx.moveTo(0, centerY + w1 / 2);
            ctx.lineTo(250, centerY + w1 / 2);
            ctx.lineTo(350, centerY + w2 / 2);
            ctx.lineTo(CAN_W, centerY + w2 / 2);

            ctx.stroke();

            // Fill Pipe Background (Glassy)
            ctx.fillStyle = "rgba(30, 41, 59, 0.3)";
            ctx.fill();

            // --- 2. Update & Draw Particles ---
            particles.current.forEach(p => {
                const { velocity, currentWidth } = getSpeedAtX(p.x);

                // Update Pos
                p.x += velocity;

                // Constrain Y to stay within pipe (simple scale mapping)
                // If particle is at 50% height of section 1, it should be at 50% height of section 2
                // We store Y relative to CENTER. We just need to check boundaries?
                // Actually, for flow streamline visualization, we just scale Y based on width ratio change if we want perfect streamlines.
                // But simplified: Re-randomize if out of bounds (which shouldn't happen if we scale)

                // Reset if out of bounds
                if (p.x > CAN_W) {
                    p.x = 0;
                    p.y = (Math.random() - 0.5) * (w1 - 10);
                }

                // Smooth Y transition (Pseudo-streamline) approach:
                // Calculate expected relative Y for this X
                // Not strictly physics-accurate but visually convincing for "flow compression"
                if (p.x > 250 && p.x < 350) {
                    // const t = (p.x - 250) / 100;
                    // p.y = p.y * (currentWidth / prevWidth? No, complex)
                    // Simple trick: Move Y towards 0 as width decreases
                    if (currentWidth < w1) {
                        p.y *= 0.99; // Slowly compress towards center
                    }
                }

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, centerY + p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color;

                // Speed trail
                ctx.fillRect(p.x - velocity * 2, centerY + p.y - 1, velocity * 2, 2);

                ctx.fill();
            });

            // --- 3. Draw Info Overlays (Speed & Pressure) ---
            // Section 1 Info
            const v1 = (FLOW_SPEED_BASE * 80) / w1;
            const p1Val = 1000 - v1 * 50; // Bernoulli simplified: P + 1/2 v^2 = C. P = C - v^2

            ctx.fillStyle = "white"; // Revert to white for text
            drawGauge(ctx, 100, centerY - 80, "V1", v1.toFixed(1), "m/s", "#8b5cf6"); // Primary
            drawGauge(ctx, 100, centerY + 80, "P1", p1Val.toFixed(0), "Pa", "#06b6d4"); // Accent

            // Section 2 Info
            const v2 = (FLOW_SPEED_BASE * 80) / w2;
            const p2Val = 1000 - v2 * 50;

            drawGauge(ctx, 500, centerY - 60, "V2", v2.toFixed(1), "m/s", "#ef4444"); // Red (Fast)
            drawGauge(ctx, 500, centerY + 60, "P2", p2Val.toFixed(0), "Pa", "#22c55e"); // Green (Low P?) -- Actually P drops when V rises. Use consistent colors?

            animationFrameId.current = requestAnimationFrame(render);
        };

        const drawGauge = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, val: string, unit: string, color: string) => {
            ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
            ctx.beginPath();
            ctx.roundRect(x - 40, y - 25, 80, 50, 8);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.font = "bold 16px Inter";
            ctx.fillText(label, x - 30, y + 5);

            ctx.fillStyle = "white";
            ctx.font = "bold 14px monospace";
            ctx.fillText(`${val} ${unit}`, x - 5, y + 5);
        };

        render();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isPlaying]); // Only re-run if play/pause changes, NOT on pipeWidth changes using refs


    return (
        <Card className="p-6 bg-cosmic-800/80 backdrop-blur border-cosmic-700 mt-8">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="bg-primary/20 text-primary p-1 rounded">Simulasi</span> Hukum Bernoulli
            </h3>
            <p className="text-sm text-slate-400 mb-6">
                Perhatikan hubungan antara **Kecepatan** dan **Tekanan**. Saat pipa menyempit, air harus berlari lebih cepat, dan tekanannya justru turun!
            </p>

            <div className="relative h-[400px] border-2 border-cosmic-600 rounded-xl overflow-hidden bg-cosmic-950 shadow-inner mb-6">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cosmic-900/50 p-4 rounded-xl border border-cosmic-700">
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Lebar Pipa Kiri (A1)</label>
                    <input
                        type="range"
                        min="60"
                        max="150"
                        value={pipeWidth1}
                        onChange={(e) => setPipeWidth1(Number(e.target.value))}
                        className="w-full h-2 bg-cosmic-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Lebar Pipa Kanan (A2)</label>
                    <input
                        type="range"
                        min="20"
                        max="100"
                        value={pipeWidth2}
                        onChange={(e) => setPipeWidth2(Number(e.target.value))}
                        className="w-full h-2 bg-cosmic-700 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-cosmic-700 hover:bg-cosmic-600 rounded-lg transition-colors"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? "Jeda" : "Lanjut"}
                </button>
                <button
                    onClick={() => { setPipeWidth1(80); setPipeWidth2(40); }}
                    className="flex items-center gap-2 px-4 py-2 bg-cosmic-700 hover:bg-cosmic-600 rounded-lg transition-colors"
                >
                    <RotateCcw className="w-5 h-5" /> Reset
                </button>
            </div>
        </Card>
    );
};

export default RealBernoulli;
