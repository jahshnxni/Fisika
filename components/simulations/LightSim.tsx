"use client";
import { useRef, useEffect, useState } from 'react';

export default function LightSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [wavelength, setWavelength] = useState(550);
    const [slitDistance, setSlitDistance] = useState(50);
    const timeRef = useRef(0);

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
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, W, H);

            const screenX = W - 80;
            const slitX = 150;
            const midY = H / 2;

            // Light source
            ctx.fillStyle = wavelengthToHex(wavelength);
            ctx.shadowColor = wavelengthToHex(wavelength);
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(30, midY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Incoming rays
            ctx.strokeStyle = wavelengthToHex(wavelength) + '40';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(30, midY);
            ctx.lineTo(slitX, midY - slitDistance / 2);
            ctx.moveTo(30, midY);
            ctx.lineTo(slitX, midY + slitDistance / 2);
            ctx.stroke();

            // Barrier with double slit
            ctx.fillStyle = '#334155';
            ctx.fillRect(slitX, 0, 6, midY - slitDistance / 2 - 3);
            ctx.fillRect(slitX, midY - slitDistance / 2 + 3, 6, slitDistance - 6);
            ctx.fillRect(slitX, midY + slitDistance / 2 + 3, 6, H);

            // Interference pattern on screen
            const lambdaNorm = wavelength / 1000;
            const dNorm = slitDistance / 100;

            for (let y = 0; y < H; y++) {
                const dy = (y - midY) / 100;
                const phase = 2 * Math.PI * dNorm * dy / lambdaNorm;
                const intensity = Math.cos(phase / 2) ** 2;

                const color = wavelengthToRGB(wavelength);
                ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${intensity * 0.9})`;
                ctx.fillRect(screenX, y, 30, 1);
            }

            // Screen border
            ctx.strokeStyle = '#475569';
            ctx.strokeRect(screenX, 0, 30, H);

            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`λ = ${wavelength} nm`, W / 2, 20);
            ctx.fillText(`d = ${(slitDistance / 100).toFixed(2)} mm`, W / 2, 38);
            ctx.fillText('Celah Ganda', slitX + 3, H - 10);
            ctx.fillText('Layar', screenX + 15, H - 10);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [wavelength, slitDistance]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">🌈 Simulasi Interferensi Celah Ganda</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Panjang Gelombang: {wavelength} nm</label>
                    <input type="range" min="380" max="700" value={wavelength} onChange={e => setWavelength(+e.target.value)} className="w-full accent-purple-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Jarak Celah: {(slitDistance / 100).toFixed(2)} mm</label>
                    <input type="range" min="20" max="100" value={slitDistance} onChange={e => setSlitDistance(+e.target.value)} className="w-full accent-cyan-500" />
                </div>
            </div>
        </div>
    );
}

function wavelengthToRGB(wl: number) {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
    else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
    else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
    else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
    else if (wl >= 645 && wl <= 700) { r = 1; }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function wavelengthToHex(wl: number) {
    const { r, g, b } = wavelengthToRGB(wl);
    return `rgb(${r},${g},${b})`;
}
