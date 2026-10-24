"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function BasketballProjectileSim() {
    const [v0, setV0] = useState<number>(7.5); // m/s
    const [angleDeg, setAngleDeg] = useState<number>(50); // degrees
    const [shooter, setShooter] = useState<'adrian' | 'bisma'>('adrian');
    const [isShooting, setIsShooting] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Physics parameters
    const g = 10; // m/s^2
    const y0 = 2.0; // initial release height in m
    const targetX = 3.0; // hoop distance in m
    const targetY = 3.05; // hoop height in m

    const rad = (angleDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(rad);
    const v0y = v0 * Math.sin(rad);

    // Time to reach hoop distance (x = 3m)
    const timeToHoop = targetX / v0x;
    // Height at x = 3m
    const heightAtHoop = y0 + v0y * timeToHoop - 0.5 * g * timeToHoop * timeToHoop;
    const isGoal = Math.abs(heightAtHoop - targetY) < 0.25 && heightAtHoop >= 3.0;

    // Switch presets
    const selectAdrian = () => {
        setShooter('adrian');
        setV0(7.5);
        setAngleDeg(50);
        animRef.current = 0;
        setIsShooting(true);
    };

    const selectBisma = () => {
        setShooter('bisma');
        setV0(6.5);
        setAngleDeg(50);
        animRef.current = 0;
        setIsShooting(true);
    };

    useEffect(() => {
        let frame: number;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 640;
        const height = 320;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Coordinate scaling: origin at bottom-left of court
        // court scale: 1 meter = 80 pixels
        const scale = 85;
        const originX = 90;
        const originY = 270;

        const render = () => {
            if (isShooting) {
                animRef.current += 0.025;
                if (animRef.current > timeToHoop + 0.3) {
                    setIsShooting(false);
                }
            }

            ctx.clearRect(0, 0, width, height);

            // Indoor Basketball Gym Background
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, "#0f172a");
            bgGrad.addColorStop(1, "#1e1e38");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Gym Floor (Wood Parquet)
            const floorGrad = ctx.createLinearGradient(0, originY, 0, height);
            floorGrad.addColorStop(0, "#92400e");
            floorGrad.addColorStop(1, "#78350f");
            ctx.fillStyle = floorGrad;
            ctx.fillRect(0, originY, width, height - originY);

            // Baseline & Key court lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, originY);
            ctx.lineTo(width, originY);
            ctx.stroke();

            // Basketball Hoop Pole & Backboard at x = 3.0 m
            const hoopPixelX = originX + targetX * scale;
            const hoopPixelY = originY - targetY * scale;

            // Pole
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(hoopPixelX + 25, originY);
            ctx.lineTo(hoopPixelX + 25, hoopPixelY - 30);
            ctx.lineTo(hoopPixelX + 4, hoopPixelY);
            ctx.stroke();

            // Backboard
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2;
            ctx.fillRect(hoopPixelX + 4, hoopPixelY - 35, 6, 50);
            ctx.strokeRect(hoopPixelX + 4, hoopPixelY - 35, 6, 50);

            // Rim (Ring Basket) at exactly 3.05m
            ctx.strokeStyle = "#ea580c";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(hoopPixelX - 22, hoopPixelY);
            ctx.lineTo(hoopPixelX + 4, hoopPixelY);
            ctx.stroke();

            // Net
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hoopPixelX - 22, hoopPixelY);
            ctx.lineTo(hoopPixelX - 18, hoopPixelY + 22);
            ctx.lineTo(hoopPixelX, hoopPixelY + 22);
            ctx.lineTo(hoopPixelX + 4, hoopPixelY);
            ctx.stroke();

            // Hoop Height Label
            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Ring: h = 3,05 m", hoopPixelX + 16, hoopPixelY);

            // Ground distance marker (3m)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(originX, originY + 18);
            ctx.lineTo(hoopPixelX, originY + 18);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("x = 3 meter", (originX + hoopPixelX) / 2, originY + 32);

            // Player Shooter (Stickman Athlete)
            drawShooter(ctx, originX, originY, shooter);

            // Parabolic Trajectory Path (Dotted)
            ctx.strokeStyle = shooter === 'adrian' ? "rgba(56, 189, 248, 0.6)" : "rgba(244, 63, 94, 0.6)";
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            const totalSteps = 60;
            const tEnd = (targetX + 0.4) / v0x;
            for (let i = 0; i <= totalSteps; i++) {
                const tStep = (i / totalSteps) * tEnd;
                const px = originX + (v0x * tStep) * scale;
                const py = originY - (y0 + v0y * tStep - 0.5 * g * tStep * tStep) * scale;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Animated Flying Basketball
            const tCurrent = Math.min(animRef.current, tEnd);
            const ballX = originX + (v0x * tCurrent) * scale;
            const ballY = originY - (y0 + v0y * tCurrent - 0.5 * g * tCurrent * tCurrent) * scale;

            // Draw Basketball
            ctx.fillStyle = "#ea580c";
            ctx.beginPath();
            ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#431407";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Vector arrow at ball
            const vxCurrent = v0x;
            const vyCurrent = v0y - g * tCurrent;
            drawArrow(ctx, ballX, ballY, ballX + vxCurrent * 3, ballY - vyCurrent * 3, "#facc15");

            // Result Alert at Hoop
            if (tCurrent >= timeToHoop - 0.05) {
                if (isGoal) {
                    ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
                    ctx.roundRect(hoopPixelX - 70, hoopPixelY - 70, 140, 28, 6);
                    ctx.fill();
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 11px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("🏀 SWISH! Bola Masuk!", hoopPixelX, hoopPixelY - 52);
                } else {
                    ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
                    ctx.roundRect(hoopPixelX - 90, hoopPixelY - 70, 180, 28, 6);
                    ctx.fill();
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 11px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("❌ Gagal! Bola Jatuh Terlalu Rendah", hoopPixelX, hoopPixelY - 52);
                }
            }

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [v0, angleDeg, shooter, isShooting, timeToHoop, isGoal]);

    function drawShooter(ctx: CanvasRenderingContext2D, px: number, py: number, name: string) {
        // Head
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(px, py - 145, 12, 0, Math.PI * 2);
        ctx.fill();

        // Jersey Body
        ctx.fillStyle = name === 'adrian' ? "#0284c7" : "#be123c";
        ctx.fillRect(px - 10, py - 132, 20, 45);

        // Name
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name.toUpperCase(), px, py - 105);

        // Legs
        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - 6, py - 87);
        ctx.lineTo(px - 8, py);
        ctx.moveTo(px + 6, py - 87);
        ctx.lineTo(px + 8, py);
        ctx.stroke();

        // Jump Height Label (2m release point)
        ctx.fillStyle = "#94a3b8";
        ctx.font = "9px sans-serif";
        ctx.fillText("Pelepasan: h = 2 m", px - 35, py - 150);
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 5;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.5;
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
                    <span className="text-xl">🏀</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Gerak Parabola Jump Shot Bola Basket
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 7 TKA: Tembakan Adrian (7,5 m/s) vs Bisma (6,5 m/s)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={selectAdrian}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            shooter === 'adrian'
                                ? 'bg-sky-600/30 border-sky-500 text-sky-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Adrian (7,5 m/s)
                    </button>
                    <button
                        onClick={selectBisma}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            shooter === 'bisma'
                                ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Bisma (6,5 m/s)
                    </button>
                    <button
                        onClick={() => { animRef.current = 0; setIsShooting(true); }}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold transition-all shadow"
                    >
                        Tembak Ulang 🚀
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
                        <span className="font-semibold text-slate-300">Kecepatan Awal (v₀)</span>
                        <span className="font-mono text-cyan-400 font-bold">{v0.toFixed(1)} m/s</span>
                    </div>
                    <input
                        type="range"
                        min="5.0"
                        max="10.0"
                        step="0.1"
                        value={v0}
                        onChange={(e) => {
                            setV0(parseFloat(e.target.value));
                            animRef.current = 0;
                            setIsShooting(true);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>5.0 m/s</span>
                        <span className="text-rose-400 font-bold">6.5 m/s (Bisma)</span>
                        <span className="text-sky-400 font-bold">7.5 m/s (Adrian)</span>
                        <span>10.0 m/s</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Sudut Elevasi (θ)</span>
                        <span className="font-mono text-amber-400 font-bold">{angleDeg}°</span>
                    </div>
                    <input
                        type="range"
                        min="30"
                        max="70"
                        step="1"
                        value={angleDeg}
                        onChange={(e) => {
                            setAngleDeg(parseInt(e.target.value));
                            animRef.current = 0;
                            setIsShooting(true);
                        }}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                        sin(50°) = 0,766 | cos(50°) = 0,643
                    </div>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Analisis Soal No. 7 TKA (Pengaruh Penurunan Kecepatan Bola Bisma):
                </strong>
                <p>Waktu tempuh bola mencapai ring (x = 3 m):</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    t = x / (v0 · cos 50°)
                </div>
                <p>Ketika Bisma menurunkan kecepatan awal dari 7,5 m/s ke 6,5 m/s:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-1">
                    <li>
                        Komponen kecepatan horizontal (vx) menjadi lebih lambat, sehingga bola membutuhkan waktu <strong>lebih lama</strong> untuk mencapai jarak 3 m (t_Bisma ≈ 0,72 s &gt; t_Adrian ≈ 0,62 s).
                    </li>
                    <li>
                        Karena berada di udara lebih lama, percepatan gravitasi menarik bola ke bawah lebih lama (-1/2 g t²), sehingga ketinggian bola di x = 3 m menjadi y ≈ 2,99 m (di bawah tinggi ring 3,05 m).
                    </li>
                </ul>
                <p className="text-amber-300 font-semibold pt-1">
                    👉 Kesimpulan TKA: Bola Bisma jatuh lebih cepat dan gagal masuk karena kecepatannya lebih kecil (Jawaban C).
                </p>
            </div>
        </div>
    );
}
