"use client";
import { useRef, useEffect, useState } from 'react';

export default function ArchimedesSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rhoBenda, setRhoBenda] = useState(600);
    const [rhoFluida, setRhoFluida] = useState(1000);

    // Physics Refs
    const physicsRef = useRef({
        rhoBenda: 600,
        rhoFluida: 1000
    });

    useEffect(() => {
        physicsRef.current = { rhoBenda, rhoFluida };
    }, [rhoBenda, rhoFluida]);

    const animRef = useRef(0);
    const timeRef = useRef(0);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false })!;
        const W = canvas.width = 500;
        const H = canvas.height = 350;

        const draw = () => {
            timeRef.current += 0.02;
            ctx.clearRect(0, 0, W, H);

            // Get current values from Ref
            const { rhoBenda: rb, rhoFluida: rf } = physicsRef.current;
            const rasio = rb / rf;
            const terendam = Math.min(rasio, 1);
            const status = rasio < 1 ? "TERAPUNG" : rasio === 1 ? "MELAYANG" : "TENGGELAM";
            const statusColor = rasio < 1 ? "#22c55e" : rasio === 1 ? "#eab308" : "#ef4444";

            // Background
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);

            // Water
            const waterTop = 120;
            const waterGrad = ctx.createLinearGradient(0, waterTop, 0, H);
            waterGrad.addColorStop(0, 'rgba(59,130,246,0.3)');
            waterGrad.addColorStop(1, 'rgba(30,64,175,0.5)');
            ctx.fillStyle = waterGrad;
            ctx.fillRect(50, waterTop, W - 100, H - waterTop - 20);

            // Water surface wave
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 50; x < W - 50; x++) {
                const y = waterTop + Math.sin(x * 0.03 + timeRef.current * 2) * 3;
                x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Container walls
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 3;
            ctx.strokeRect(50, 50, W - 100, H - 70);

            // Object
            const objSize = 60;
            const objX = W / 2 - objSize / 2;
            const maxDepth = H - 80 - objSize;
            const bobble = Math.sin(timeRef.current * 1.5) * 3;
            let objY: number;

            if (rasio >= 1) {
                objY = maxDepth + bobble * 0.3; // Tenggelam
            } else {
                const surfaceY = waterTop - objSize * (1 - terendam);
                objY = surfaceY + bobble;
            }

            // Object shadow in water
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(objX + 5, objY + 5, objSize, objSize);

            // Object
            const objGrad = ctx.createLinearGradient(objX, objY, objX + objSize, objY + objSize);
            objGrad.addColorStop(0, '#f97316');
            objGrad.addColorStop(1, '#dc2626');
            ctx.fillStyle = objGrad;
            ctx.fillRect(objX, objY, objSize, objSize);
            ctx.strokeStyle = '#fff3';
            ctx.strokeRect(objX, objY, objSize, objSize);

            // Weight arrow (down)
            const centerX = objX + objSize / 2;
            const centerY = objY + objSize / 2;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY + 40);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('W', centerX + 15, centerY + 35);

            // Buoyancy arrow (up)
            const buoyLen = Math.min(terendam * 50, 50);
            ctx.strokeStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY - buoyLen);
            ctx.stroke();
            ctx.fillStyle = '#22c55e';
            ctx.fillText('Fa', centerX + 15, centerY - buoyLen + 10);

            // Labels
            ctx.fillStyle = statusColor;
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(status, W / 2, 40);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.fillText(`ρ benda: ${rb} kg/m³`, W / 2 - 120, H - 5);
            ctx.fillText(`ρ fluida: ${rf} kg/m³`, W / 2 + 120, H - 5);
            ctx.fillText(`Terendam: ${(terendam * 100).toFixed(0)}%`, W / 2, H - 5);

            // Bubbles
            for (let i = 0; i < 8; i++) {
                const bx = 80 + i * 50 + Math.sin(timeRef.current + i) * 10;
                const by = H - 50 - ((timeRef.current * 30 + i * 40) % (H - waterTop - 50));
                if (by > waterTop) {
                    ctx.fillStyle = `rgba(147,197,253,${0.3 - (by - waterTop) * 0.001})`;
                    ctx.beginPath();
                    ctx.arc(bx, by, 3 + Math.sin(i) * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            requestRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, []); // Run once on mount

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">⚓ Simulasi Hukum Archimedes</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 500, margin: '0 auto', display: 'block' }} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-slate-400">ρ Benda: {rhoBenda} kg/m³</label>
                    <input type="range" min="100" max="2000" value={rhoBenda} onChange={e => setRhoBenda(+e.target.value)} className="w-full accent-orange-500" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">ρ Fluida: {rhoFluida} kg/m³</label>
                    <input type="range" min="500" max="13600" value={rhoFluida} onChange={e => setRhoFluida(+e.target.value)} className="w-full accent-blue-500" />
                </div>
            </div>
        </div>
    );
}
