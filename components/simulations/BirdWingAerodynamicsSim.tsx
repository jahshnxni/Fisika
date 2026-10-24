"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function BirdWingAerodynamicsSim() {
    const [windSpeed, setWindSpeed] = useState<number>(15); // m/s
    const [angleAttack, setAngleAttack] = useState<number>(6); // degrees
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Array<{ x: number, y: number, speed: number, top: boolean }>>([]);

    // Physics
    const vBottom = windSpeed;
    const vTop = windSpeed * (1 + 0.35 + angleAttack * 0.03); // faster over curved upper surface
    const airDensity = 1.2; // kg/m^3
    const deltaP = 0.5 * airDensity * (vTop * vTop - vBottom * vBottom); // Pa
    const wingArea = 0.4; // m^2
    const liftForceN = deltaP * wingArea; // N

    useEffect(() => {
        // Initialize streamline particles
        const particles: Array<{ x: number, y: number, speed: number, top: boolean }> = [];
        for (let i = 0; i < 70; i++) {
            particles.push({
                x: Math.random() * 640,
                y: 60 + Math.random() * 180,
                speed: 1,
                top: Math.random() > 0.5,
            });
        }
        particlesRef.current = particles;
    }, []);

    useEffect(() => {
        let frame: number;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 640;
        const height = 310;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Wind Tunnel Dark Stream Background
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, "#082f49");
            bgGrad.addColorStop(0.5, "#0f172a");
            bgGrad.addColorStop(1, "#0369a1");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            const centerX = 260;
            const centerY = 160;

            // Streamline particles
            ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
            for (const p of particlesRef.current) {
                // Determine speed based on whether it passes above or below wing
                const isOverWing = p.y < centerY && p.x > centerX - 120 && p.x < centerX + 120;
                const spd = isOverWing ? (vTop / 5) : (vBottom / 5);

                p.x += spd;
                if (p.x > width) {
                    p.x = 0;
                    p.y = 70 + Math.random() * 160;
                }

                // Curved streamline deflection around wing
                let drawY = p.y;
                if (p.x > centerX - 110 && p.x < centerX + 110) {
                    const distFromCenter = 1 - Math.abs(p.x - centerX) / 110;
                    if (p.y < centerY) {
                        drawY -= distFromCenter * 20; // curve over top
                    } else {
                        drawY += distFromCenter * 8; // gentle curve under
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, drawY, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Bird Airfoil Wing
            drawAirfoil(ctx, centerX, centerY, angleAttack);

            // Velocity Labels
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`v_atas = ${vTop.toFixed(1)} m/s (Cepat)`, centerX, centerY - 65);
            ctx.fillStyle = "#60a5fa";
            ctx.fillText(`P_atas LEBIH RENDAH`, centerX, centerY - 50);

            ctx.fillStyle = "#fbbf24";
            ctx.fillText(`v_bawah = ${vBottom.toFixed(1)} m/s (Lambat)`, centerX, centerY + 65);
            ctx.fillStyle = "#f59e0b";
            ctx.fillText(`P_bawah LEBIH TINGGI`, centerX, centerY + 80);

            // Lift Vector Arrow (F_angkat)
            const arrowLen = Math.min(liftForceN * 1.5, 75);
            drawArrow(ctx, centerX, centerY - 15, centerX, centerY - 15 - arrowLen, "#22c55e");
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(`F_angkat = ${liftForceN.toFixed(1)} N`, centerX, centerY - 25 - arrowLen);

            // --- HUD Box (Right Side) ---
            const hudX = width - 180;
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.roundRect(hudX - 10, 25, 170, 250, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("PRINSIP BERNOULLI:", hudX, 45);

            ctx.font = "10px monospace";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(`v Angin  = ${windSpeed} m/s`, hudX, 70);
            ctx.fillText(`Sudut θ  = ${angleAttack}°`, hudX, 90);
            ctx.fillText(`Luas A   = ${wingArea} m²`, hudX, 110);

            ctx.strokeStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(hudX, 125);
            ctx.lineTo(hudX + 150, 125);
            ctx.stroke();

            ctx.fillStyle = "#38bdf8";
            ctx.fillText(`Beda Tekanan ΔP:`, hudX, 145);
            ctx.font = "bold 11px monospace";
            ctx.fillText(`= ${deltaP.toFixed(1)} Pa`, hudX, 162);

            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(`Gaya Angkat (Lift):`, hudX, 190);
            ctx.font = "bold 15px monospace";
            ctx.fillText(`${liftForceN.toFixed(1)} N`, hudX, 210);

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "9px sans-serif";
            ctx.fillText("v_atas > v_bawah", hudX, 235);
            ctx.fillText("P_bawah > P_atas", hudX, 250);

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [windSpeed, angleAttack, vTop, vBottom, deltaP, liftForceN, wingArea]);

    function drawAirfoil(ctx: CanvasRenderingContext2D, cx: number, cy: number, angleDeg: number) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((-angleDeg * Math.PI) / 180);

        // Teardrop Airfoil Shape (curved top, flatter bottom)
        ctx.fillStyle = "#e2e8f0";
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(-100, 0); // Leading edge
        ctx.bezierCurveTo(-90, -32, 20, -38, 100, 0); // Upper surface (high curvature)
        ctx.bezierCurveTo(30, 4, -80, 8, -100, 0); // Lower surface (flat/concave)
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Camber line
        ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(-100, 0);
        ctx.lineTo(100, 0);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 7;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🦅</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Asas Bernoulli & Aerodinamika Sayap Burung
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 14 TKA 2025: Mengapa Sayap Membantu Burung Terbang
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setWindSpeed(20); setAngleAttack(10); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/30 border border-emerald-500 text-emerald-300 transition-all hover:bg-emerald-600/50"
                    >
                        Gaya Angkat Maksimal 🛫
                    </button>
                    <button
                        onClick={() => { setWindSpeed(10); setAngleAttack(2); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 transition-all hover:bg-slate-700"
                    >
                        Meluncur / Gliding 🪂
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Kecepatan Aliran Udara / Angin (v)</span>
                        <span className="font-mono text-cyan-400 font-bold">{windSpeed} m/s</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Sudut Serang Sayap (Angle of Attack θ)</span>
                        <span className="font-mono text-amber-400 font-bold">{angleAttack}°</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="16"
                        step="1"
                        value={angleAttack}
                        onChange={(e) => setAngleAttack(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>
            </div>

            {/* TKA Multiple Correct Options Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-2 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Kunci Jawaban Soal No. 14 TKA (Pernyataan Benar Lebih Dari Satu):
                </strong>
                <div className="space-y-1.5 pl-1">
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Saat udara mengalir di atas dan bawah sayap, kecepatan udara di atas lebih tinggi (v_atas &gt; v_bawah).</span>
                    </div>
                    <div className="flex items-start gap-2 text-rose-400">
                        <span>❌</span>
                        <span><strong>SALAH:</strong> Rendahnya kecepatan udara di bawah sayap menghasilkan tekanan yang lebih tinggi, bukan lebih rendah.</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Perbedaan tekanan (P_bawah &gt; P_atas) menciptakan gaya angkat yang memungkinkan burung tetap terbang.</span>
                    </div>
                    <div className="flex items-start gap-2 text-rose-400">
                        <span>❌</span>
                        <span><strong>SALAH:</strong> Hambatan (drag) bukan penyebab utama gaya angkat, melainkan perbedaan tekanan fluida.</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Bentuk sayap dapat diubah-ubah oleh burung untuk menghasilkan variasi gaya angkat sesuai kebutuhan terbang.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
