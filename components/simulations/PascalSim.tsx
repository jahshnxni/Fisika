"use client";
import { useRef, useEffect, useState } from 'react';

export default function PascalSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [F1, setF1] = useState(100);
    const [A1, setA1] = useState(5);
    const [A2, setA2] = useState(50);
    const animRef = useRef(0);
    const pressAnim = useRef(0);

    const F2 = F1 * (A2 / A1);
    const ratio = A2 / A1;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 600;
        const H = canvas.height = 350;

        const draw = () => {
            animRef.current++;
            pressAnim.current += 0.02;
            ctx.clearRect(0, 0, W, H);

            // Background
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, '#0f172a');
            bg.addColorStop(1, '#1e293b');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            const bounce = Math.sin(pressAnim.current) * 5;

            // Small piston (left)
            const smallX = 100, smallW = 40, smallH = 120;
            const smallTop = 100 + bounce;
            ctx.fillStyle = '#334155';
            ctx.fillRect(smallX - smallW / 2, smallTop, smallW, smallH);
            // Piston head
            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(smallX - smallW / 2 - 5, smallTop - 10, smallW + 10, 15);
            ctx.shadowColor = '#60a5fa';
            ctx.shadowBlur = 10;
            ctx.fillRect(smallX - smallW / 2 - 5, smallTop - 10, smallW + 10, 15);
            ctx.shadowBlur = 0;

            // Large piston (right)
            const largeX = 450, largeW = 120, largeH = 120;
            const liftAmount = (F1 / F2) * 30;
            const largeTop = 100 - bounce * (1 / ratio) - liftAmount;
            ctx.fillStyle = '#334155';
            ctx.fillRect(largeX - largeW / 2, largeTop, largeW, largeH);
            // Piston head
            ctx.fillStyle = '#f97316';
            ctx.fillRect(largeX - largeW / 2 - 5, largeTop - 10, largeW + 10, 15);
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 10;
            ctx.fillRect(largeX - largeW / 2 - 5, largeTop - 10, largeW + 10, 15);
            ctx.shadowBlur = 0;

            // Connecting tube (fluid)
            ctx.fillStyle = '#3b82f620';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(smallX + smallW / 2, smallTop + smallH);
            ctx.lineTo(smallX + smallW / 2, 260);
            ctx.lineTo(largeX - largeW / 2, 260);
            ctx.lineTo(largeX - largeW / 2, largeTop + largeH);
            ctx.lineTo(largeX + largeW / 2, largeTop + largeH);
            ctx.lineTo(largeX + largeW / 2, 260);
            ctx.lineTo(smallX - smallW / 2, 260);
            ctx.lineTo(smallX - smallW / 2, smallTop + smallH);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Fluid particles
            for (let i = 0; i < 30; i++) {
                const px = 120 + (i % 10) * 30 + Math.sin(animRef.current * 0.03 + i) * 3;
                const py = 230 + Math.sin(animRef.current * 0.05 + i * 2) * 10;
                ctx.fillStyle = `rgba(59,130,246,${0.3 + Math.sin(i) * 0.2})`;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Force arrows
            // Small piston - down arrow
            ctx.fillStyle = '#60a5fa';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`F₁ = ${F1} N`, smallX, smallTop - 30);
            ctx.fillText(`A₁ = ${A1} cm²`, smallX, smallTop - 15);
            drawArrow(ctx, smallX, smallTop - 50, smallX, smallTop - 15, '#60a5fa');

            // Large piston - up arrow
            ctx.fillStyle = '#f97316';
            ctx.fillText(`F₂ = ${F2.toFixed(0)} N`, largeX, largeTop - 30);
            ctx.fillText(`A₂ = ${A2} cm²`, largeX, largeTop - 15);
            drawArrow(ctx, largeX, largeTop - 50, largeX, largeTop - 15, '#f97316');

            // Ratio label
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 16px monospace';
            ctx.fillText(`Pengganda: ${ratio.toFixed(1)}x`, W / 2, 310);

            requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animRef.current);
    }, [F1, A1, A2, F2, ratio]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🔧 Simulasi Dongkrak Hidrolik (Hukum Pascal)</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Gaya (F₁): {F1} N</label>
                    <input type="range" min="10" max="500" value={F1} onChange={e => setF1(+e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Luas Kecil (A₁): {A1} cm²</label>
                    <input type="range" min="1" max="20" value={A1} onChange={e => setA1(+e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Luas Besar (A₂): {A2} cm²</label>
                    <input type="range" min="20" max="200" value={A2} onChange={e => setA2(+e.target.value)} className="w-full accent-blue-500" />
                </div>
            </div>
            <div className="mt-3 text-center text-sm text-accent font-mono">
                F₂ = F₁ × (A₂/A₁) = {F1} × ({A2}/{A1}) = <strong>{F2.toFixed(0)} N</strong>
            </div>
        </div>
    );
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4));
    ctx.fillStyle = color;
    ctx.fill();
}
