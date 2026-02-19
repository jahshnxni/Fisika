"use client";
import { useRef, useEffect, useState } from 'react';

export default function ExpansionSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tempChange, setTempChange] = useState(50);
    const [material, setMaterial] = useState<'steel' | 'aluminum' | 'copper'>('steel');

    const alphaMap = { steel: 12e-6, aluminum: 24e-6, copper: 17e-6 };
    const colorMap = { steel: '#94a3b8', aluminum: '#d1d5db', copper: '#f97316' };
    const alpha = alphaMap[material];
    const L0 = 2; // meters
    const deltaL = L0 * alpha * tempChange;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 600;
        const H = canvas.height = 200;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        const barY = 70, barH = 40;
        const baseW = 400;
        const expandW = baseW * (1 + alpha * tempChange * 5000); // exaggerated

        // Original bar (ghost)
        ctx.fillStyle = '#ffffff10';
        ctx.fillRect(50, barY, baseW, barH);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#ffffff30';
        ctx.strokeRect(50, barY, baseW, barH);
        ctx.setLineDash([]);

        // Expanded bar
        const heatFactor = Math.min(tempChange / 100, 1);
        const barGrad = ctx.createLinearGradient(50, 0, 50 + expandW, 0);
        barGrad.addColorStop(0, colorMap[material]);
        barGrad.addColorStop(1, `rgba(239,68,68,${heatFactor})`);
        ctx.fillStyle = barGrad;
        ctx.fillRect(50, barY, expandW, barH);
        ctx.strokeStyle = colorMap[material];
        ctx.lineWidth = 2;
        ctx.strokeRect(50, barY, expandW, barH);

        // Delta L arrow
        if (expandW > baseW) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50 + baseW, barY + barH + 20);
            ctx.lineTo(50 + expandW, barY + barH + 20);
            ctx.stroke();
            ctx.fillStyle = '#22c55e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`ΔL = ${(deltaL * 1000).toFixed(2)} mm`, 50 + (baseW + expandW) / 2, barY + barH + 38);
        }

        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`L₀ = ${L0} m | α = ${(alpha * 1e6).toFixed(0)} × 10⁻⁶ /°C | ΔT = ${tempChange}°C`, W / 2, 30);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`ΔL = L₀ × α × ΔT = ${(deltaL * 1000).toFixed(3)} mm`, W / 2, H - 15);
    }, [tempChange, material, alpha, deltaL]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">📏 Simulasi Pemuaian Panjang</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Perubahan Suhu: {tempChange}°C</label>
                    <input type="range" min="0" max="200" value={tempChange} onChange={e => setTempChange(+e.target.value)} className="w-full accent-red-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Material:</label>
                    <select value={material} onChange={e => setMaterial(e.target.value as any)} className="w-full bg-cosmic-800 text-white text-xs rounded p-1 border border-cosmic-700">
                        <option value="steel">Baja (α=12×10⁻⁶)</option>
                        <option value="aluminum">Aluminium (α=24×10⁻⁶)</option>
                        <option value="copper">Tembaga (α=17×10⁻⁶)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
