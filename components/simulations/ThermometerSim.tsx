"use client";
import { useRef, useEffect, useState } from 'react';

export default function ThermometerSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [celsius, setCelsius] = useState(25);

    const fahrenheit = celsius * 9 / 5 + 32;
    const kelvin = celsius + 273.15;
    const reamur = celsius * 4 / 5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 500;
        const H = canvas.height = 300;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        // Thermometer body
        const tx = 100, tw = 30, th = 220, ty = 40;
        const bulbR = 22;
        const fillH = ((celsius + 30) / 160) * th; // -30 to 130 range

        // Glass tube
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(tx - tw / 2, ty, tw, th, 10);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(tx - tw / 2, ty, tw, th, 10);
        ctx.stroke();

        // Bulb
        ctx.beginPath();
        ctx.arc(tx, ty + th + 5, bulbR, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        // Mercury column
        const mercuryGrad = ctx.createLinearGradient(0, ty + th - fillH, 0, ty + th);
        mercuryGrad.addColorStop(0, '#f87171');
        mercuryGrad.addColorStop(1, '#dc2626');
        ctx.fillStyle = mercuryGrad;
        ctx.fillRect(tx - 8, ty + th - fillH, 16, fillH);

        // Scale markings
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        for (let t = -20; t <= 120; t += 20) {
            const y = ty + th - ((t + 30) / 160) * th;
            ctx.fillRect(tx + tw / 2, y, 8, 1);
            ctx.fillText(`${t}°C`, tx + tw / 2 + 12, y + 4);
        }

        // Scale cards
        const scales = [
            { label: 'Celsius', value: `${celsius.toFixed(1)}°C`, color: '#ef4444', x: 250 },
            { label: 'Fahrenheit', value: `${fahrenheit.toFixed(1)}°F`, color: '#f97316', x: 250 },
            { label: 'Kelvin', value: `${kelvin.toFixed(1)} K`, color: '#eab308', x: 380 },
            { label: 'Reamur', value: `${reamur.toFixed(1)}°R`, color: '#22c55e', x: 380 },
        ];

        scales.forEach((s, i) => {
            const sy = 60 + (i % 2 === 0 ? 0 : 60) + Math.floor(i / 2) * 120;
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(s.x - 10, sy, 120, 50, 8);
            ctx.fill();
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(s.x - 10, sy, 120, 50, 8);
            ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(s.label, s.x + 50, sy + 18);
            ctx.fillStyle = s.color;
            ctx.font = 'bold 16px monospace';
            ctx.fillText(s.value, s.x + 50, sy + 40);
        });
    }, [celsius, fahrenheit, kelvin, reamur]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🌡️ Simulasi Konversi Suhu</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 500, margin: '0 auto', display: 'block' }} />
            <div className="mt-4">
                <label className="text-xs text-slate-400">Suhu: {celsius}°C</label>
                <input type="range" min="-30" max="130" value={celsius} onChange={e => setCelsius(+e.target.value)} className="w-full accent-red-500" />
            </div>
        </div>
    );
}
