"use client";
import { useRef, useEffect, useState } from 'react';

export default function ContinuitySim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [d1, setD1] = useState(80);
    const [d2, setD2] = useState(40);
    const timeRef = useRef(0);

    const v1 = 2;
    const v2 = v1 * (d1 * d1) / (d2 * d2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 600;
        const H = canvas.height = 300;
        let frameId: number;
        const particles: { x: number; y: number; speed: number }[] = [];
        for (let i = 0; i < 40; i++) {
            particles.push({ x: Math.random() * W, y: 0, speed: 0 });
        }

        const draw = () => {
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            const midY = H / 2;
            const wideR = d1 / 2;
            const narrowR = d2 / 2;
            const transStart = 200, transEnd = 350;

            // Pipe outline
            ctx.fillStyle = '#1e3a5f20';
            ctx.beginPath();
            ctx.moveTo(0, midY - wideR);
            ctx.lineTo(transStart, midY - wideR);
            ctx.lineTo(transEnd, midY - narrowR);
            ctx.lineTo(W, midY - narrowR);
            ctx.lineTo(W, midY + narrowR);
            ctx.lineTo(transEnd, midY + narrowR);
            ctx.lineTo(transStart, midY + wideR);
            ctx.lineTo(0, midY + wideR);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Particles
            for (const p of particles) {
                let pipeR: number;
                if (p.x < transStart) {
                    pipeR = wideR;
                    p.speed = v1;
                } else if (p.x > transEnd) {
                    pipeR = narrowR;
                    p.speed = v2;
                } else {
                    const t = (p.x - transStart) / (transEnd - transStart);
                    pipeR = wideR + (narrowR - wideR) * t;
                    p.speed = v1 + (v2 - v1) * t;
                }

                p.x += p.speed;
                if (p.x > W + 10) {
                    p.x = -10;
                    p.y = midY + (Math.random() - 0.5) * 2 * (wideR - 5);
                }

                // Clamp Y within pipe
                p.y = Math.max(midY - pipeR + 4, Math.min(midY + pipeR - 4, p.y));

                const alpha = Math.min(1, p.speed / 5);
                ctx.fillStyle = `rgba(96,165,250,${0.5 + alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3 + alpha * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`v₁ = ${v1.toFixed(1)} m/s`, 100, 30);
            ctx.fillText(`d₁ = ${d1} px`, 100, 48);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(`v₂ = ${v2.toFixed(1)} m/s`, 475, 30);
            ctx.fillText(`d₂ = ${d2} px`, 475, 48);
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`A₁v₁ = A₂v₂`, W / 2, H - 15);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [d1, d2, v2]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">💧 Simulasi Persamaan Kontinuitas</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Diameter Lebar: {d1}px</label>
                    <input type="range" min="40" max="120" value={d1} onChange={e => setD1(+e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Diameter Sempit: {d2}px</label>
                    <input type="range" min="15" max={d1 - 5} value={d2} onChange={e => setD2(+e.target.value)} className="w-full accent-yellow-500" />
                </div>
            </div>
        </div>
    );
}
