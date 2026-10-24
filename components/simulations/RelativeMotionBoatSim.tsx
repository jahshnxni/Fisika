"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function RelativeMotionBoatSim() {
    const [boatSpeed, setBoatSpeed] = useState<number>(8); // km/h
    const [currentSpeed, setCurrentSpeed] = useState<number>(2); // km/h
    const [direction, setDirection] = useState<'timur' | 'barat' | 'tenggara'>('timur');
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const boatPosRef = useRef<number>(0);

    // Physics calculations
    const distanceKm = 10; // km
    // Resultant speed to the East
    let vEast = 0;
    if (direction === 'timur') {
        vEast = boatSpeed + currentSpeed;
    } else if (direction === 'barat') {
        vEast = -boatSpeed + currentSpeed;
    } else {
        // tenggara (45 deg)
        vEast = boatSpeed * Math.cos(Math.PI / 4) + currentSpeed;
    }

    const travelTimeHours = vEast > 0 ? distanceKm / vEast : 999;
    const arrivalMinute = Math.round(travelTimeHours * 60);
    const isExactlyOnTime = vEast === 10; // Arrives in exactly 1 hour (09:00)

    useEffect(() => {
        let frameId: number;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 640;
        const height = 300;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const render = () => {
            animRef.current += 0.03;
            if (isPlaying && vEast > 0) {
                boatPosRef.current += (vEast / 10) * 0.4;
                if (boatPosRef.current > 420) {
                    boatPosRef.current = 0; // loop
                }
            }

            ctx.clearRect(0, 0, width, height);

            // Ocean Sky Gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
            skyGrad.addColorStop(0, '#0c1a30');
            skyGrad.addColorStop(1, '#1e3a5f');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, width, 140);

            // Ocean Water Gradient
            const seaGrad = ctx.createLinearGradient(0, 140, 0, height);
            seaGrad.addColorStop(0, '#0369a1');
            seaGrad.addColorStop(1, '#082f49');
            ctx.fillStyle = seaGrad;
            ctx.fillRect(0, 140, width, height - 140);

            // Animated Sea Waves
            ctx.strokeStyle = "rgba(186, 230, 253, 0.35)";
            ctx.lineWidth = 1.5;
            for (let row = 0; row < 5; row++) {
                const y = 160 + row * 26;
                ctx.beginPath();
                for (let x = 0; x <= width; x += 10) {
                    const waveY = y + Math.sin(x * 0.04 + animRef.current * 2 + row) * 3;
                    if (x === 0) ctx.moveTo(x, waveY);
                    else ctx.lineTo(x, waveY);
                }
                ctx.stroke();
            }

            // Islands
            // Island A (West / Left)
            drawIsland(ctx, 45, 175, "Pulau A", "#15803d");
            // Island B (East / Right)
            drawIsland(ctx, 550, 175, "Pulau B", "#16a34a");

            // Distance dotted line
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(90, 130);
            ctx.lineTo(510, 130);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Jarak = 10 km (Arah Timur)", 300, 122);

            // Boat position
            const bX = 100 + boatPosRef.current;
            const bY = 190 + Math.sin(animRef.current * 3) * 2;

            drawBoat(ctx, bX, bY, direction);

            // Current vector arrows in water
            ctx.strokeStyle = "#38bdf8";
            ctx.fillStyle = "#38bdf8";
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const arrowX = 200 + i * 110 + (animRef.current * 20) % 90;
                drawArrow(ctx, arrowX, 260, arrowX + 35, 260, "#38bdf8");
            }
            ctx.font = "bold 10px sans-serif";
            ctx.fillText(`Arus Laut = ${currentSpeed} km/jam (Ke Timur)`, 300, 280);

            // Compass Rose HUD
            drawCompass(ctx, 580, 55);

            frameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(frameId);
    }, [boatSpeed, currentSpeed, direction, isPlaying, vEast]);

    function drawIsland(ctx: CanvasRenderingContext2D, x: number, y: number, name: string, color: string) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, 45, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Palm tree trunk
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.quadraticCurveTo(x, y - 25, x - 10, y - 35);
        ctx.stroke();

        // Palm leaves
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(x - 10, y - 35, 12, 0, Math.PI * 2);
        ctx.fill();

        // Name Tag
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, x, y + 36);
    }

    function drawBoat(ctx: CanvasRenderingContext2D, x: number, y: number, dir: string) {
        ctx.save();
        ctx.translate(x, y);

        // Boat Hull
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, 0);
        ctx.lineTo(24, 0);
        ctx.lineTo(16, 12);
        ctx.lineTo(-14, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cabin
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(-10, -10, 18, 10);

        // Mast & Flag
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, -10);
        ctx.lineTo(8, -24);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(8, -24);
        ctx.lineTo(18, -20);
        ctx.lineTo(8, -16);
        ctx.closePath();
        ctx.fill();

        // Vector arrow over boat
        drawArrow(ctx, 0, -32, 28, -32, "#fbbf24");
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`v_kapal=${boatSpeed}`, 10, -38);

        ctx.restore();
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 7;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
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

    function drawCompass(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("U", cx, cy - 13);
        ctx.fillText("S", cx, cy + 21);
        ctx.fillText("T", cx + 18, cy + 3);
        ctx.fillText("B", cx - 18, cy + 3);

        // Needle
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - 10);
        ctx.stroke();
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">⛵</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Gerak Relatif & Vektor Kecepatan Kapal
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 2 TKA: Navigasi Kapal Melawan/Searah Arus Laut
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono">
                        <span className="text-slate-400 mr-1.5">Resultan v:</span>
                        <strong className={isExactlyOnTime ? "text-green-400" : "text-amber-400"}>
                            {vEast.toFixed(1)} km/jam
                        </strong>
                    </div>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                        {isPlaying ? "Jeda ⏸" : "Jalan ▶"}
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Kecepatan Kapal (v_kapal)</span>
                        <span className="font-mono text-amber-400 font-bold">{boatSpeed} km/jam</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="16"
                        step="1"
                        value={boatSpeed}
                        onChange={(e) => setBoatSpeed(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>2 km/j</span>
                        <span className="text-green-400 font-bold">8 km/j (Jawaban TKA)</span>
                        <span>16 km/j</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Kecepatan Arus Laut</span>
                        <span className="font-mono text-cyan-400 font-bold">{currentSpeed} km/jam</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="6"
                        step="1"
                        value={currentSpeed}
                        onChange={(e) => setCurrentSpeed(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                        Arah arus konstan ke arah <strong>Timur</strong>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Arah Kemudi Kapal</label>
                    <div className="grid grid-cols-3 gap-1.5">
                        {(['timur', 'barat', 'tenggara'] as const).map((dir) => (
                            <button
                                key={dir}
                                onClick={() => setDirection(dir)}
                                className={`py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                                    direction === dir
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                                        : 'bg-slate-700/50 text-slate-400 hover:text-white'
                                }`}
                            >
                                {dir}
                            </button>
                        ))}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 text-center">
                        Estimasi Waktu Tiba: <strong>{isExactlyOnTime ? "09.00 (Tepat Waktu! ⏱️)" : `${arrivalMinute} menit`}</strong>
                    </div>
                </div>
            </div>

            {/* TKA Solution Analysis */}
            <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                isExactlyOnTime
                    ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700/50 text-slate-300"
            }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                    {isExactlyOnTime ? "✅ STRATEGI TEPAT SESUAI SOAL TKA NO. 2:" : "ℹ️ Analisis Gerak Relatif Vektor:"}
                </div>
                <p>
                    Jarak = 10 km ke arah Timur. Berangkat pukul 08.00 dan harus sampai tepat 09.00 (waktu tempuh t = 1 jam).
                    Maka kecepatan resultan terhadap bumi yang harus dicapai:
                </p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    v_resultan = s / t = 10 km / 1 jam = 10 km/jam ke arah Timur
                </div>
                <p>
                    Karena arus laut bergerak dari barat ke timur dengan v_arus = 2 km/jam, maka:
                </p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    v_kapal = v_resultan - v_arus = 10 - 2 = 8 km/jam ke arah Timur
                </div>
                <div className="text-violet-300 font-semibold">
                    Jawaban TKA: Opsi E (Bergerak ke arah timur dengan kecepatan 8 km·jam⁻¹).
                </div>
            </div>
        </div>
    );
}
