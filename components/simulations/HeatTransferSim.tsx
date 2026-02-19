"use client";
import { useRef, useEffect, useState } from 'react';

export default function HeatTransferSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'conduction' | 'convection' | 'radiation'>('conduction');
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 500;
        const H = canvas.height = 280;
        let frameId: number;

        const draw = () => {
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            if (mode === 'conduction') {
                // Hot side → Cold side through bar
                const barY = 100, barH = 50, barW = 360;
                const barX = 70;
                for (let x = 0; x < barW; x++) {
                    const t = x / barW;
                    const r = Math.round(255 * (1 - t));
                    const b = Math.round(255 * t);
                    ctx.fillStyle = `rgb(${r},50,${b})`;
                    ctx.fillRect(barX + x, barY, 1, barH);
                }
                ctx.strokeStyle = '#475569';
                ctx.strokeRect(barX, barY, barW, barH);

                // Vibrating particles
                for (let i = 0; i < 30; i++) {
                    const px = barX + 10 + i * 12;
                    const t = i / 30;
                    const vibration = (1 - t) * 5;
                    const py = barY + barH / 2 + Math.sin(timeRef.current * 10 + i) * vibration;
                    ctx.fillStyle = `rgba(255,255,255,${0.5 + (1 - t) * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = '#ef4444'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
                ctx.fillText('🔥 PANAS', barX + 30, barY - 10);
                ctx.fillStyle = '#3b82f6';
                ctx.fillText('❄️ DINGIN', barX + barW - 30, barY - 10);
                ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace';
                ctx.fillText('Partikel bergetar → transfer energi ke tetangga', W / 2, barY + barH + 30);
            } else if (mode === 'convection') {
                // Fluid loop
                const cx = W / 2, cy = H / 2;
                const rx = 120, ry = 80;

                // Container
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 2;
                ctx.strokeRect(cx - rx - 20, cy - ry - 20, (rx + 20) * 2, (ry + 20) * 2);

                // Moving particles in loop
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2 + timeRef.current * 1.5;
                    const px = cx + Math.cos(angle) * rx;
                    const py = cy + Math.sin(angle) * ry;
                    const isHot = py > cy;
                    ctx.fillStyle = isHot ? '#ef4444' : '#3b82f6';
                    ctx.beginPath();
                    ctx.arc(px, py, 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Arrows showing circulation
                ctx.strokeStyle = '#fbbf2480';
                ctx.lineWidth = 2;
                const arrowAngle = timeRef.current * 1.5;
                const ax = cx + Math.cos(arrowAngle) * rx;
                const ay = cy + Math.sin(arrowAngle) * ry;
                ctx.beginPath();
                ctx.arc(ax, ay, 8, 0, Math.PI * 2);
                ctx.strokeStyle = '#fbbf24';
                ctx.stroke();

                ctx.fillStyle = '#ef4444'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
                ctx.fillText('🔥 Sumber Panas', cx, cy + ry + 40);
                ctx.fillStyle = '#94a3b8';
                ctx.fillText('Fluida panas naik, dingin turun → SIRKULASI', W / 2, 25);
            } else {
                // Radiation - waves from hot object
                const sunX = 100, sunY = H / 2;

                // Sun/hot object
                ctx.fillStyle = '#fbbf24';
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // EM waves
                for (let w = 0; w < 5; w++) {
                    const phase = timeRef.current * 3 + w * 1.2;
                    const startX = sunX + 40;
                    const angle = (w - 2) * 0.3;
                    ctx.strokeStyle = `rgba(239,68,68,${0.8 - w * 0.15})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    for (let x = 0; x < 250; x++) {
                        const px = startX + x * Math.cos(angle);
                        const py = sunY + x * Math.sin(angle) + Math.sin(x * 0.1 + phase) * 8;
                        x === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                }

                // Target
                ctx.fillStyle = '#334155';
                ctx.fillRect(400, sunY - 40, 20, 80);
                const heatLevel = (Math.sin(timeRef.current) + 1) / 2;
                ctx.fillStyle = `rgba(239,68,68,${heatLevel * 0.5})`;
                ctx.fillRect(400, sunY - 40, 20, 80);

                ctx.fillStyle = '#94a3b8'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
                ctx.fillText('Energi dipancarkan sebagai gelombang EM (tanpa medium!)', W / 2, 25);
            }

            // Mode label
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(mode.toUpperCase(), W / 2, H - 10);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [mode]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🔄 Simulasi Perpindahan Kalor</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 500, margin: '0 auto', display: 'block' }} />
            <div className="flex gap-2 mt-4 justify-center">
                {(['conduction', 'convection', 'radiation'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                        className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${mode === m ? 'bg-blue-600 text-white' : 'bg-cosmic-800 text-slate-400 hover:bg-cosmic-700'}`}>
                        {m === 'conduction' ? '🧱 Konduksi' : m === 'convection' ? '💨 Konveksi' : '☀️ Radiasi'}
                    </button>
                ))}
            </div>
        </div>
    );
}
