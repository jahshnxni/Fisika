"use client";
import { useRef, useEffect, useState } from 'react';

export default function GasPistonSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [Q, setQ] = useState(500);       // kalor masuk (J)
    const [W, setW] = useState(200);       // usaha (J)
    const timeRef = useRef(0);

    const deltaU = Q - W;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const CW = canvas.width = 600;
        const CH = canvas.height = 380;
        let frameId: number;

        const draw = () => {
            timeRef.current += 0.02;
            ctx.clearRect(0, 0, CW, CH);

            // Background
            const bg = ctx.createLinearGradient(0, 0, 0, CH);
            bg.addColorStop(0, '#0f172a');
            bg.addColorStop(1, '#1e293b');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, CW, CH);

            // === CYLINDER (gas container) ===
            const cylX = 180, cylY = 80, cylW = 200, cylH = 180;
            const pistonY = cylY + 30 + Math.sin(timeRef.current * 1.5) * (W / 40);

            // Cylinder walls
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cylX, cylY);
            ctx.lineTo(cylX, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY);
            ctx.stroke();

            // Gas fill (color based on ΔU — hotter = more red)
            const heatFraction = Math.max(0, Math.min(1, deltaU / 600));
            const r = Math.floor(30 + heatFraction * 200);
            const g = Math.floor(50 + (1 - heatFraction) * 80);
            const b = Math.floor(100 + (1 - heatFraction) * 60);
            const gasGrad = ctx.createLinearGradient(cylX, pistonY, cylX, cylY + cylH);
            gasGrad.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
            gasGrad.addColorStop(1, `rgba(${r},${g},${b},0.15)`);
            ctx.fillStyle = gasGrad;
            ctx.fillRect(cylX + 2, pistonY, cylW - 4, cylY + cylH - pistonY - 2);

            // Gas particles (animate based on ΔU)
            const particleCount = 25;
            const gasH = cylY + cylH - pistonY;
            for (let i = 0; i < particleCount; i++) {
                const speed = 0.5 + (deltaU / 300) * 2;
                const px = cylX + 15 + ((i * 37 + timeRef.current * (30 + i * speed * 5)) % (cylW - 30));
                const baseY = pistonY + 10 + ((i * 53 + timeRef.current * (20 + i * speed * 3)) % (gasH - 20));
                const py = Math.max(pistonY + 5, Math.min(cylY + cylH - 5, baseY));
                const particleAlpha = 0.4 + heatFraction * 0.4;
                ctx.fillStyle = `rgba(${r + 80},${g + 60},${b},${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(px, py, 3 + heatFraction * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Piston (movable top)
            ctx.fillStyle = '#475569';
            ctx.fillRect(cylX - 5, pistonY - 8, cylW + 10, 12);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(cylX + cylW / 2 - 10, pistonY - 40, 20, 35);
            // Piston handle
            ctx.fillStyle = '#64748b';
            ctx.fillRect(cylX + cylW / 2 - 20, pistonY - 45, 40, 8);

            // === ENERGY FLOW ARROWS ===

            // Q arrow (heat in) — from left
            const arrowLen = Math.max(30, Q / 8);
            ctx.save();
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            // Q arrow body
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(cylX - arrowLen - 20, cylY + cylH / 2 - 8);
            ctx.lineTo(cylX - 20, cylY + cylH / 2 - 8);
            ctx.lineTo(cylX - 20, cylY + cylH / 2 - 16);
            ctx.lineTo(cylX - 5, cylY + cylH / 2);
            ctx.lineTo(cylX - 20, cylY + cylH / 2 + 16);
            ctx.lineTo(cylX - 20, cylY + cylH / 2 + 8);
            ctx.lineTo(cylX - arrowLen - 20, cylY + cylH / 2 + 8);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Q label
            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`Q = ${Q} J`, cylX - arrowLen / 2 - 20, cylY + cylH / 2 - 22);
            ctx.font = '11px monospace';
            ctx.fillText('Kalor Masuk', cylX - arrowLen / 2 - 20, cylY + cylH / 2 + 28);

            // W arrow (work out) — going up from piston
            const wArrowLen = Math.max(20, W / 10);
            ctx.save();
            ctx.shadowColor = '#3b82f6';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#3b82f6';
            const wX = cylX + cylW / 2;
            const wBaseY = pistonY - 50;
            ctx.beginPath();
            ctx.moveTo(wX - 8, wBaseY);
            ctx.lineTo(wX - 8, wBaseY - wArrowLen);
            ctx.lineTo(wX - 16, wBaseY - wArrowLen);
            ctx.lineTo(wX, wBaseY - wArrowLen - 20);
            ctx.lineTo(wX + 16, wBaseY - wArrowLen);
            ctx.lineTo(wX + 8, wBaseY - wArrowLen);
            ctx.lineTo(wX + 8, wBaseY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // W label
            ctx.fillStyle = '#60a5fa';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`W = ${W} J`, wX + 55, wBaseY - wArrowLen / 2);
            ctx.font = '11px monospace';
            ctx.fillText('Usaha', wX + 55, wBaseY - wArrowLen / 2 + 16);

            // === ΔU display (energy bar) ===
            const barX = cylX + cylW + 50, barY = 100, barW = 30, barH = 160;
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;
            ctx.fillRect(barX, barY, barW, barH);
            ctx.strokeRect(barX, barY, barW, barH);

            // Fill based on ΔU
            const fillFrac = Math.abs(deltaU) / 600;
            const fillH = fillFrac * barH;
            const barColor = deltaU >= 0 ? '#f97316' : '#06b6d4';
            const barGrad = ctx.createLinearGradient(barX, barY + barH - fillH, barX, barY + barH);
            barGrad.addColorStop(0, barColor);
            barGrad.addColorStop(1, barColor + '60');
            ctx.fillStyle = barGrad;
            ctx.fillRect(barX + 2, barY + barH - fillH, barW - 4, fillH);

            // ΔU label
            ctx.fillStyle = barColor;
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('ΔU', barX + barW / 2, barY - 10);
            ctx.font = 'bold 16px monospace';
            ctx.fillText(`${deltaU} J`, barX + barW / 2, barY + barH + 25);
            ctx.font = '10px monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(deltaU > 0 ? 'Suhu naik' : deltaU < 0 ? 'Suhu turun' : 'Tetap', barX + barW / 2, barY + barH + 40);

            // === EQUATION at bottom ===
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`ΔU = Q − W = ${Q} − ${W} = ${deltaU} J`, CW / 2, CH - 25);

            // Title labels for system
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('GAS IDEAL', cylX + cylW / 2, cylY + cylH - 10);

            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [Q, W, deltaU]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">⚡ Simulasi Hukum I Termodinamika (Piston Gas)</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">Kalor Masuk (Q): {Q} J</label>
                    <input type="range" min="0" max="1000" step="10" value={Q} onChange={e => setQ(+e.target.value)} className="w-full accent-red-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Usaha (W): {W} J</label>
                    <input type="range" min="0" max="800" step="10" value={W} onChange={e => setW(+e.target.value)} className="w-full accent-blue-500" />
                </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-red-500/10 rounded p-2 border border-red-500/30">
                    <span className="text-red-400 font-bold">Q = {Q} J</span>
                    <div className="text-slate-500">Kalor masuk</div>
                </div>
                <div className="bg-blue-500/10 rounded p-2 border border-blue-500/30">
                    <span className="text-blue-400 font-bold">W = {W} J</span>
                    <div className="text-slate-500">Usaha keluar</div>
                </div>
                <div className={`rounded p-2 border ${deltaU >= 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
                    <span className={`font-bold ${deltaU >= 0 ? 'text-orange-400' : 'text-cyan-400'}`}>ΔU = {deltaU} J</span>
                    <div className="text-slate-500">{deltaU > 0 ? 'Suhu naik ↑' : deltaU < 0 ? 'Suhu turun ↓' : 'Tetap'}</div>
                </div>
            </div>
        </div>
    );
}
