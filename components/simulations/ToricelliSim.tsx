"use client";
import { useRef, useEffect, useState } from 'react';

export default function ToricelliSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [holeY, setHoleY] = useState(60);
    const [waterLevel, setWaterLevel] = useState(90);
    const timeRef = useRef(0);

    const g = 10;
    const h = (waterLevel - holeY) * 0.05;
    const v = Math.sqrt(2 * g * Math.max(h, 0));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 500;
        const H = canvas.height = 350;
        let frameId: number;
        const drops: { x: number; y: number; vx: number; vy: number }[] = [];

        const draw = () => {
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            const tankX = 80, tankW = 120, tankBottom = 280;
            const tankTop = tankBottom - 200;
            const waterTop = tankBottom - waterLevel * 2;
            const holeAbsY = tankBottom - holeY * 2;

            // Tank
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 3;
            ctx.strokeRect(tankX, tankTop, tankW, tankBottom - tankTop);

            // Water
            if (waterTop < tankBottom) {
                const wg = ctx.createLinearGradient(0, waterTop, 0, tankBottom);
                wg.addColorStop(0, 'rgba(59,130,246,0.3)');
                wg.addColorStop(1, 'rgba(30,64,175,0.5)');
                ctx.fillStyle = wg;
                ctx.fillRect(tankX + 2, waterTop, tankW - 4, tankBottom - waterTop - 2);
            }

            // Hole
            if (holeAbsY > waterTop && h > 0) {
                ctx.fillStyle = '#60a5fa';
                ctx.fillRect(tankX + tankW - 2, holeAbsY - 3, 8, 6);

                // Spawn drops
                if (timeRef.current % 0.05 < 0.02) {
                    drops.push({ x: tankX + tankW + 6, y: holeAbsY, vx: v * 15, vy: 0 });
                }
            }

            // Ground
            ctx.fillStyle = '#334155';
            ctx.fillRect(0, tankBottom, W, H - tankBottom);

            // Update & draw drops (parabolic trajectory)
            for (let i = drops.length - 1; i >= 0; i--) {
                const d = drops[i];
                d.x += d.vx * 0.016;
                d.vy += 300 * 0.016;
                d.y += d.vy * 0.016;
                if (d.y > tankBottom || d.x > W) { drops.splice(i, 1); continue; }
                ctx.fillStyle = '#60a5fa';
                ctx.beginPath();
                ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`h = ${h.toFixed(1)} m`, tankX + tankW + 20, holeAbsY - 20);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`v = √(2gh) = ${v.toFixed(1)} m/s`, tankX + tankW + 20, holeAbsY);

            // Height arrow
            if (h > 0) {
                ctx.strokeStyle = '#f97316';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(tankX - 15, waterTop);
                ctx.lineTo(tankX - 15, holeAbsY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#f97316';
                ctx.textAlign = 'center';
                ctx.fillText('h', tankX - 25, (waterTop + holeAbsY) / 2);
            }

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [holeY, waterLevel, h, v]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🚿 Simulasi Teorema Toricelli</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 500, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Posisi Lubang: {holeY}%</label>
                    <input type="range" min="10" max="85" value={holeY} onChange={e => setHoleY(+e.target.value)} className="w-full accent-orange-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Level Air: {waterLevel}%</label>
                    <input type="range" min="20" max="98" value={waterLevel} onChange={e => setWaterLevel(+e.target.value)} className="w-full accent-blue-500" />
                </div>
            </div>
        </div>
    );
}
