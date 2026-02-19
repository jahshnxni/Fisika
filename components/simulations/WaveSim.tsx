"use client";
import { useRef, useEffect, useState } from 'react';

export default function WaveSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [amplitude, setAmplitude] = useState(40);
    const [frequency, setFrequency] = useState(2);
    const [waveType, setWaveType] = useState<'transversal' | 'longitudinal'>('transversal');
    const timeRef = useRef(0);

    const wavelength = 200 / frequency;
    const speed = wavelength * frequency;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 600;
        const H = canvas.height = 300;
        let frameId: number;

        const draw = () => {
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            const midY = H / 2;
            const omega = 2 * Math.PI * frequency;
            const k = 2 * Math.PI / wavelength;

            if (waveType === 'transversal') {
                // Draw wave
                ctx.beginPath();
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 3;
                for (let x = 0; x < W; x++) {
                    const y = midY + amplitude * Math.sin(k * x - omega * timeRef.current);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Dots on wave
                for (let x = 0; x < W; x += 30) {
                    const y = midY + amplitude * Math.sin(k * x - omega * timeRef.current);
                    ctx.fillStyle = '#f97316';
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Equilibrium line
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = '#ffffff20';
                ctx.beginPath();
                ctx.moveTo(0, midY);
                ctx.lineTo(W, midY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Amplitude arrow
                const peakX = 100;
                const peakY = midY - amplitude;
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(peakX, midY);
                ctx.lineTo(peakX, peakY);
                ctx.stroke();
                ctx.fillStyle = '#22c55e';
                ctx.font = '12px monospace';
                ctx.fillText('A', peakX + 5, (midY + peakY) / 2);
            } else {
                // Longitudinal wave
                for (let i = 0; i < 60; i++) {
                    const baseX = i * 10;
                    const displacement = amplitude * 0.3 * Math.sin(k * baseX - omega * timeRef.current);
                    const x = baseX + displacement;
                    const density = 1 + 0.5 * Math.cos(k * baseX - omega * timeRef.current);
                    ctx.fillStyle = `rgba(96,165,250,${0.3 + density * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(x, midY, 4 + density * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`λ = ${(wavelength / 20).toFixed(1)} m | f = ${frequency} Hz | v = ${(speed / 20).toFixed(1)} m/s`, W / 2, 25);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [amplitude, frequency, waveType, wavelength, speed]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🌊 Simulasi Gelombang</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Amplitudo: {amplitude}px</label>
                    <input type="range" min="10" max="80" value={amplitude} onChange={e => setAmplitude(+e.target.value)} className="w-full accent-green-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Frekuensi: {frequency} Hz</label>
                    <input type="range" min="1" max="8" step="0.5" value={frequency} onChange={e => setFrequency(+e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Jenis:</label>
                    <select value={waveType} onChange={e => setWaveType(e.target.value as any)} className="w-full bg-cosmic-800 text-white text-xs rounded p-1 border border-cosmic-700">
                        <option value="transversal">Transversal</option>
                        <option value="longitudinal">Longitudinal</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
