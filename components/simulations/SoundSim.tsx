"use client";
import { useRef, useEffect, useState } from 'react';

export default function SoundSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pipeLength, setPipeLength] = useState(1);
    const [harmonic, setHarmonic] = useState(1);
    const [pipeType, setPipeType] = useState<'open' | 'closed'>('open');
    const timeRef = useRef(0);

    const vSound = 340;
    const freq = pipeType === 'open'
        ? harmonic * vSound / (2 * pipeLength)
        : harmonic * vSound / (4 * pipeLength);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 600;
        const H = canvas.height = 250;
        let frameId: number;

        const draw = () => {
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            const pipeX = 50, pipeW = W - 100, pipeH = 80;
            const pipeY = H / 2 - pipeH / 2;

            // Pipe
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(pipeX, pipeY, pipeW, pipeH);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipeX, pipeY, pipeW, pipeH);

            // Closed end
            if (pipeType === 'closed') {
                ctx.fillStyle = '#64748b';
                ctx.fillRect(pipeX, pipeY, 5, pipeH);
            }

            // Standing wave pattern
            const midY = H / 2;
            const n = pipeType === 'open' ? harmonic : harmonic;
            const lambda = pipeType === 'open' ? 2 * pipeW / n : 4 * pipeW / n;

            ctx.beginPath();
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            for (let x = 0; x <= pipeW; x++) {
                let envelope: number;
                if (pipeType === 'open') {
                    envelope = Math.sin(n * Math.PI * x / pipeW);
                } else {
                    envelope = Math.cos(n * Math.PI * x / (2 * pipeW));
                }
                const y = midY + envelope * 30 * Math.sin(timeRef.current * 5);
                x === 0 ? ctx.moveTo(pipeX + x, y) : ctx.lineTo(pipeX + x, y);
            }
            ctx.stroke();

            // Nodes and antinodes
            ctx.fillStyle = '#ef4444';
            ctx.font = '10px monospace';
            if (pipeType === 'open') {
                for (let i = 0; i <= n; i++) {
                    const nx = pipeX + (i / n) * pipeW;
                    ctx.beginPath();
                    ctx.arc(nx, midY, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Labels
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`f${harmonic} = ${freq.toFixed(0)} Hz`, W / 2, 25);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px monospace';
            ctx.fillText(`Nada ke-${harmonic} | L = ${pipeLength} m`, W / 2, H - 10);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [pipeLength, harmonic, pipeType, freq]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🔊 Simulasi Gelombang Bunyi (Pipa Organa)</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Panjang Pipa: {pipeLength} m</label>
                    <input type="range" min="0.5" max="3" step="0.1" value={pipeLength} onChange={e => setPipeLength(+e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Harmonik ke-{harmonic}</label>
                    <input type="range" min="1" max="5" value={harmonic} onChange={e => setHarmonic(+e.target.value)} className="w-full accent-yellow-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Jenis Pipa:</label>
                    <select value={pipeType} onChange={e => setPipeType(e.target.value as any)} className="w-full bg-cosmic-800 text-white text-xs rounded p-1 border border-cosmic-700">
                        <option value="open">Terbuka</option>
                        <option value="closed">Tertutup</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
