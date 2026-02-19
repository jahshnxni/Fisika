"use client";
import { useRef, useEffect, useState } from 'react';

export default function PVDiagramSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [process, setProcess] = useState<'isothermal' | 'isobaric' | 'isochoric' | 'adiabatic'>('isothermal');
    const [animProgress, setAnimProgress] = useState(0);
    const animRef = useRef<number>(0);

    useEffect(() => {
        setAnimProgress(0);
        let start: number | null = null;
        const animate = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 2000, 1);
            setAnimProgress(p);
            if (p < 1) animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [process]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 500;
        const H = canvas.height = 350;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        const ox = 80, oy = H - 60;
        const gw = 380, gh = 240;

        // Axes
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - gh);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + gw, oy);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('V (Volume)', ox + gw / 2, oy + 40);
        ctx.save();
        ctx.translate(20, oy - gh / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('P (Tekanan)', 0, 0);
        ctx.restore();

        // Draw process curve
        const colors: Record<string, string> = {
            isothermal: '#60a5fa', isobaric: '#22c55e', isochoric: '#f97316', adiabatic: '#a855f7'
        };
        const labels: Record<string, string> = {
            isothermal: 'Isotermal (T konstan)', isobaric: 'Isobarik (P konstan)',
            isochoric: 'Isokhorik (V konstan)', adiabatic: 'Adiabatik (Q = 0)'
        };

        ctx.strokeStyle = colors[process];
        ctx.lineWidth = 3;
        ctx.beginPath();

        const steps = Math.floor(animProgress * 100);
        for (let i = 0; i <= steps; i++) {
            const t = i / 100;
            let px: number, py: number;

            if (process === 'isothermal') {
                const v = 0.3 + t * 0.6;
                const p = 0.8 / v;
                px = ox + v * gw;
                py = oy - p * gh / 1.5;
            } else if (process === 'isobaric') {
                const v = 0.2 + t * 0.6;
                const p = 0.6;
                px = ox + v * gw;
                py = oy - p * gh;
            } else if (process === 'isochoric') {
                const v = 0.4;
                const p = 0.3 + t * 0.5;
                px = ox + v * gw;
                py = oy - p * gh;
            } else {
                const v = 0.3 + t * 0.6;
                const gamma = 5 / 3;
                const p = 0.8 * Math.pow(0.3 / v, gamma);
                px = ox + v * gw;
                py = oy - Math.max(p, 0.05) * gh / 1.5;
            }

            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Start/end dots
        if (steps > 0) {
            // Start point
            let sx: number, sy: number;
            if (process === 'isothermal') { sx = ox + 0.3 * gw; sy = oy - (0.8 / 0.3) * gh / 1.5; }
            else if (process === 'isobaric') { sx = ox + 0.2 * gw; sy = oy - 0.6 * gh; }
            else if (process === 'isochoric') { sx = ox + 0.4 * gw; sy = oy - 0.3 * gh; }
            else { sx = ox + 0.3 * gw; sy = oy - 0.8 * gh / 1.5; }
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(sx, sy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#22c55e'; ctx.font = '11px monospace'; ctx.textAlign = 'left';
            ctx.fillText('A', sx + 10, sy - 5);
        }

        // Label
        ctx.fillStyle = colors[process];
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[process], W / 2, 30);

        // Shaded work area
        if (process !== 'isochoric' && steps > 10) {
            ctx.fillStyle = colors[process] + '15';
            ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
                const t = i / 100;
                let px: number, py: number;
                if (process === 'isothermal') { const v = 0.3 + t * 0.6; px = ox + v * gw; py = oy - (0.8 / v) * gh / 1.5; }
                else if (process === 'isobaric') { const v = 0.2 + t * 0.6; px = ox + v * gw; py = oy - 0.6 * gh; }
                else { const v = 0.3 + t * 0.6; px = ox + v * gw; py = oy - Math.max(0.8 * Math.pow(0.3 / v, 5 / 3), 0.05) * gh / 1.5; }
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            // Close to x-axis
            const lastT = steps / 100;
            let lastV: number;
            if (process === 'isothermal') lastV = 0.3 + lastT * 0.6;
            else if (process === 'isobaric') lastV = 0.2 + lastT * 0.6;
            else lastV = 0.3 + lastT * 0.6;
            ctx.lineTo(ox + lastV * gw, oy);
            const firstV = process === 'isobaric' ? 0.2 : 0.3;
            ctx.lineTo(ox + firstV * gw, oy);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace';
            ctx.fillText('W = ∫P dV (luas di bawah kurva)', W / 2, oy + 25);
        }
    }, [process, animProgress]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">📊 Simulasi Diagram PV</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 500, margin: '0 auto', display: 'block' }} />
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {(['isothermal', 'isobaric', 'isochoric', 'adiabatic'] as const).map(p => (
                    <button key={p} onClick={() => setProcess(p)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${process === p ? 'bg-blue-600 text-white' : 'bg-cosmic-800 text-slate-400 hover:bg-cosmic-700'}`}>
                        {p === 'isothermal' ? 'Isotermal' : p === 'isobaric' ? 'Isobarik' : p === 'isochoric' ? 'Isokhorik' : 'Adiabatik'}
                    </button>
                ))}
            </div>
        </div>
    );
}
