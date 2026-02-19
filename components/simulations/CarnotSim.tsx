"use client";
import { useRef, useEffect, useState } from 'react';

export default function CarnotSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animProgress, setAnimProgress] = useState(0);
    const animRef = useRef<number>(0);
    const [efficiency, setEfficiency] = useState(40);

    const Th = 600; // Hot reservoir K
    const Tc = Th * (1 - efficiency / 100);

    useEffect(() => {
        setAnimProgress(0);
        let start: number | null = null;
        const animate = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 4000, 1);
            setAnimProgress(p);
            if (p < 1) animRef.current = requestAnimationFrame(animate);
            else { start = null; animRef.current = requestAnimationFrame(animate); }
        };
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [efficiency]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width = 550;
        const H = canvas.height = 350;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        // PV Diagram area
        const ox = 60, oy = H - 50;
        const gw = 250, gh = 240;

        // Axes
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - gh);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + gw, oy);
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('V', ox + gw / 2, oy + 20);
        ctx.save();
        ctx.translate(15, oy - gh / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('P', 0, 0);
        ctx.restore();

        // Carnot cycle: 4 processes
        // 1→2: Isothermal expansion (Th)
        // 2→3: Adiabatic expansion
        // 3→4: Isothermal compression (Tc)
        // 4→1: Adiabatic compression
        const gamma = 5 / 3;
        const V1 = 0.2, P1 = 0.9;
        const V2 = 0.5, P2 = P1 * V1 / V2; // isothermal: PV = const
        const V3 = 0.7;
        const P3 = P2 * Math.pow(V2 / V3, gamma); // adiabatic
        const V4 = V1 * Math.pow(P1 / (P3 * Math.pow(V3 / V1, gamma)), 1 / (gamma - 1)) || 0.35;
        const P4 = P3 * V3 / V4; // isothermal at Tc (simplified)

        const toX = (v: number) => ox + v * gw * 1.3;
        const toY = (p: number) => oy - p * gh;

        // Draw full cycle
        const pathSegments = [
            { from: [V1, P1], to: [V2, P2], type: 'isothermal', label: '1→2 Isotermal (Tₕ)', color: '#ef4444' },
            { from: [V2, P2], to: [V3, P3], type: 'adiabatic', label: '2→3 Adiabatik', color: '#f97316' },
            { from: [V3, P3], to: [V4, P4], type: 'isothermal', label: '3→4 Isotermal (T꜀)', color: '#3b82f6' },
            { from: [V4, P4], to: [V1, P1], type: 'adiabatic', label: '4→1 Adiabatik', color: '#a855f7' },
        ];

        // Shaded area (work done)
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.beginPath();
        // Draw all 4 segments to create closed shape
        for (let seg = 0; seg < 4; seg++) {
            const s = pathSegments[seg];
            for (let i = 0; i <= 30; i++) {
                const t = i / 30;
                let v: number, p: number;
                const vStart = s.from[0], vEnd = s.to[0], pStart = s.from[1], pEnd = s.to[1];
                if (s.type === 'isothermal') {
                    v = vStart + (vEnd - vStart) * t;
                    p = pStart * vStart / v;
                } else {
                    v = vStart + (vEnd - vStart) * t;
                    p = pStart * Math.pow(vStart / v, gamma);
                }
                const px = toX(v), py = toY(p);
                (seg === 0 && i === 0) ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();

        // Draw animated progress along cycle
        const totalSegs = 4;
        const progressSeg = Math.floor(animProgress * totalSegs);
        const segProgress = (animProgress * totalSegs) % 1;

        for (let seg = 0; seg < 4; seg++) {
            const s = pathSegments[seg];
            const maxI = seg < progressSeg ? 30 : seg === progressSeg ? Math.floor(segProgress * 30) : 0;
            if (maxI === 0 && seg > progressSeg) continue;

            ctx.strokeStyle = s.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i <= (seg <= progressSeg ? maxI || 30 : 30); i++) {
                const t = i / 30;
                const vStart = s.from[0], pStart = s.from[1];
                const vEnd = s.to[0];
                let v: number, p: number;
                if (s.type === 'isothermal') {
                    v = vStart + (vEnd - vStart) * t;
                    p = pStart * vStart / v;
                } else {
                    v = vStart + (vEnd - vStart) * t;
                    p = pStart * Math.pow(vStart / v, gamma);
                }
                i === 0 ? ctx.moveTo(toX(v), toY(p)) : ctx.lineTo(toX(v), toY(p));
            }
            ctx.stroke();
        }

        // Corner labels
        const points = [
            { v: V1, p: P1, label: '1' }, { v: V2, p: P2, label: '2' },
            { v: V3, p: P3, label: '3' }, { v: V4, p: P4, label: '4' },
        ];
        points.forEach(pt => {
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(toX(pt.v), toY(pt.p), 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(pt.label, toX(pt.v) + 12, toY(pt.p) - 8);
        });

        // Right side: Engine diagram
        const ex = 380, ey = 40;

        // Hot reservoir
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(ex - 40, ey, 120, 40, 8);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Tₕ = ${Th} K`, ex + 20, ey + 25);

        // Engine
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(ex - 20, ey + 70, 80, 60, 8);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('MESIN', ex + 20, ey + 105);

        // Cold reservoir
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.roundRect(ex - 40, ey + 160, 120, 40, 8);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`T꜀ = ${Math.round(Tc)} K`, ex + 20, ey + 185);

        // Arrows: Qh → Engine → Qc, W out
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ex + 20, ey + 40);
        ctx.lineTo(ex + 20, ey + 70);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Qₕ', ex + 45, ey + 58);

        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(ex + 20, ey + 130);
        ctx.lineTo(ex + 20, ey + 160);
        ctx.stroke();
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('Q꜀', ex + 45, ey + 148);

        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(ex + 60, ey + 100);
        ctx.lineTo(ex + 100, ey + 100);
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('W', ex + 115, ey + 105);

        // Efficiency
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`η = 1 - T꜀/Tₕ = ${efficiency}%`, ex + 20, ey + 230);

        // Title
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Siklus Carnot', ox + gw / 2, 20);
    }, [animProgress, efficiency, Tc]);

    return (
        <div className="bg-cosmic-900 rounded-xl p-4 border border-cosmic-700">
            <h3 className="text-white font-bold mb-4 text-center">♻️ Simulasi Siklus Carnot</h3>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ maxWidth: 550, margin: '0 auto', display: 'block' }} />
            <div className="mt-4">
                <label className="text-xs text-slate-400">Efisiensi Carnot: {efficiency}%</label>
                <input type="range" min="10" max="80" value={efficiency} onChange={e => setEfficiency(+e.target.value)} className="w-full accent-purple-500" />
            </div>
        </div>
    );
}
