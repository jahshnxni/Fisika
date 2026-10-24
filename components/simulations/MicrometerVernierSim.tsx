"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function MicrometerVernierSim() {
    const [mode, setMode] = useState<'micrometer' | 'vernier'>('micrometer');
    const [thimblePos, setThimblePos] = useState<number>(10.32); // in mm
    const [vernierPos, setVernierPos] = useState<number>(24.6); // in mm
    const [targetDiameter, setTargetDiameter] = useState<number>(9.60);
    const [wallThickness, setWallThickness] = useState<number>(0.36);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculated values
    const innerDiameter = Math.max(0, thimblePos - 2 * wallThickness);

    useEffect(() => {
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

        ctx.clearRect(0, 0, width, height);

        if (mode === 'micrometer') {
            drawMicrometer(ctx, width, height, thimblePos);
        } else {
            drawVernier(ctx, width, height, vernierPos);
        }
    }, [mode, thimblePos, vernierPos, wallThickness]);

    function drawMicrometer(ctx: CanvasRenderingContext2D, W: number, H: number, val: number) {
        // Background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, W, H);

        const centerY = 150;
        const startX = 60;

        // Frame U-shape
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 22;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(140, centerY, 80, 0.4 * Math.PI, 1.6 * Math.PI, false);
        ctx.stroke();

        // Anvil (left fixed rod)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(startX + 60, centerY - 14, 25, 28);

        // Spindle (moving rod)
        const gap = Math.min(val * 4, 100);
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(startX + 85 + gap, centerY - 14, 150 - gap, 28);

        // Object measured (Bead Tube)
        ctx.fillStyle = "rgba(139, 92, 246, 0.75)";
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.fillRect(startX + 85, centerY - 13, gap, 26);
        ctx.strokeRect(startX + 85, centerY - 13, gap, 26);

        // Label on object
        if (gap > 20) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Benda Uji", startX + 85 + gap / 2, centerY + 4);
        }

        // Barrel / Sleeve (fixed cylinder with main scale)
        const sleeveX = startX + 235;
        const sleeveW = 160;
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 2;
        ctx.fillRect(sleeveX, centerY - 26, sleeveW, 52);
        ctx.strokeRect(sleeveX, centerY - 26, sleeveW, 52);

        // Datum line (horizontal center reference line)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sleeveX + 5, centerY);
        ctx.lineTo(sleeveX + sleeveW - 10, centerY);
        ctx.stroke();

        // Sleeve tick marks (0 to 25 mm)
        ctx.fillStyle = "#f8fafc";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        const scaleStepPx = 4; // 1 mm = 4 px
        for (let mm = 0; mm <= 25; mm++) {
            const tx = sleeveX + 15 + mm * scaleStepPx;
            if (tx > sleeveX + sleeveW - 35) break;

            // Upper ticks (1 mm each)
            ctx.strokeStyle = "#e2e8f0";
            ctx.beginPath();
            ctx.moveTo(tx, centerY);
            ctx.lineTo(tx, centerY - (mm % 5 === 0 ? 14 : 8));
            ctx.stroke();

            // Lower ticks (0.5 mm each)
            if (mm < 25) {
                const subX = tx + scaleStepPx / 2;
                ctx.strokeStyle = "#94a3b8";
                ctx.beginPath();
                ctx.moveTo(subX, centerY);
                ctx.lineTo(subX, centerY + 8);
                ctx.stroke();
            }

            // Number labels every 5 mm
            if (mm % 5 === 0) {
                ctx.fillText(mm.toString(), tx, centerY - 17);
            }
        }

        // Thimble (rotating sleeve on the right)
        const thimbleX = sleeveX + 15 + val * scaleStepPx;
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.fillRect(thimbleX, centerY - 38, 120, 76);
        ctx.strokeRect(thimbleX, centerY - 38, 120, 76);

        // Beveled edge
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.moveTo(thimbleX, centerY - 38);
        ctx.lineTo(thimbleX - 8, centerY - 28);
        ctx.lineTo(thimbleX - 8, centerY + 28);
        ctx.lineTo(thimbleX, centerY + 38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Thimble vernier circular markings
        const thimbleOffset = (val % 0.5) / 0.01; // 0 to 50 divisions
        ctx.fillStyle = "#e2e8f0";
        ctx.strokeStyle = "#e2e8f0";
        ctx.font = "9px monospace";
        ctx.textAlign = "left";

        for (let mark = -10; mark <= 10; mark++) {
            const currentDivision = (Math.round(thimbleOffset) + mark + 50) % 50;
            const my = centerY - mark * 4;
            if (my >= centerY - 32 && my <= centerY + 32) {
                ctx.beginPath();
                ctx.moveTo(thimbleX, my);
                ctx.lineTo(thimbleX + (currentDivision % 5 === 0 ? 12 : 6), my);
                ctx.stroke();

                if (currentDivision % 5 === 0) {
                    ctx.fillText(currentDivision.toString(), thimbleX + 15, my + 3);
                }
            }
        }

        // HUD Reading Box
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(W - 210, 20, 190, 70, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("PEMBACAAN MIKROMETER:", W - 200, 38);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 18px monospace";
        ctx.fillText(`${val.toFixed(2)} mm`, W - 200, 62);

        const mainPart = Math.floor(val * 2) / 2;
        const noniusPart = (val - mainPart).toFixed(2);
        ctx.fillStyle = "#a855f7";
        ctx.font = "11px monospace";
        ctx.fillText(`= ${mainPart.toFixed(1)} mm + ${noniusPart} mm`, W - 200, 80);
    }

    function drawVernier(ctx: CanvasRenderingContext2D, W: number, H: number, val: number) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, W, H);

        const centerY = 130;
        const scalePx = 4; // 1 mm = 4 px

        // Main Scale Bar
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.fillRect(30, centerY - 45, W - 60, 45);
        ctx.strokeRect(30, centerY - 45, W - 60, 45);

        // Main Scale Ticks (0 to 120 mm)
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        for (let mm = 0; mm <= 130; mm++) {
            const x = 50 + mm * scalePx;
            if (x > W - 40) break;
            const isCm = mm % 10 === 0;
            const is5mm = mm % 5 === 0;

            ctx.strokeStyle = isCm ? "#38bdf8" : is5mm ? "#cbd5e1" : "#64748b";
            ctx.beginPath();
            ctx.moveTo(x, centerY);
            ctx.lineTo(x, centerY - (isCm ? 22 : is5mm ? 15 : 9));
            ctx.stroke();

            if (isCm) {
                ctx.fillText((mm / 10).toString(), x, centerY - 26);
            }
        }

        // Sliding Vernier Caliper
        const vX = 50 + val * scalePx;
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.fillRect(vX, centerY, 180, 55);
        ctx.strokeRect(vX, centerY, 180, 55);

        // Vernier Ticks (0 to 10 divisions, 0.1 mm precision)
        // 10 vernier divisions = 9 mm on main scale -> 1 vernier div = 0.9 mm
        ctx.fillStyle = "#f8fafc";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        for (let div = 0; div <= 10; div++) {
            const vxTick = vX + div * (0.9 * scalePx);
            ctx.strokeStyle = div % 5 === 0 ? "#ec4899" : "#e2e8f0";
            ctx.beginPath();
            ctx.moveTo(vxTick, centerY);
            ctx.lineTo(vxTick, centerY + (div % 5 === 0 ? 18 : 11));
            ctx.stroke();

            if (div % 2 === 0) {
                ctx.fillText(div.toString(), vxTick, centerY + 30);
            }
        }

        // Measurement indicator box
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 1;
        ctx.roundRect(W - 220, 20, 200, 70, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("PEMBACAAN JANGKA SORONG:", W - 210, 38);

        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 18px monospace";
        ctx.fillText(`${val.toFixed(1)} mm (${(val / 10).toFixed(2)} cm)`, W - 210, 62);
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">📏</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Laboratorium Simulasi Pengukuran Presisi
                        </h4>
                        <p className="text-xs text-slate-400">
                            Mikrometer Sekrup (Ketelitian 0,01 mm) & Jangka Sorong (0,1 mm)
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                    <button
                        onClick={() => setMode('micrometer')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            mode === 'micrometer'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Mikrometer Sekrup
                    </button>
                    <button
                        onClick={() => setMode('vernier')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            mode === 'vernier'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Jangka Sorong
                    </button>
                </div>
            </div>

            {/* Canvas Display */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {mode === 'micrometer' ? (
                    <>
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="font-semibold text-slate-300">Putar Thimble (Diameter Luar)</span>
                                <span className="font-mono text-cyan-400 font-bold">{thimblePos.toFixed(2)} mm</span>
                            </div>
                            <input
                                type="range"
                                min="0.00"
                                max="25.00"
                                step="0.01"
                                value={thimblePos}
                                onChange={(e) => setThimblePos(parseFloat(e.target.value))}
                                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0.00 mm</span>
                                <span>10.32 mm (Soal TKA)</span>
                                <span>25.00 mm</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="font-semibold text-slate-300">Ketebalan Dinding Tabung</span>
                                <span className="font-mono text-purple-400 font-bold">{wallThickness.toFixed(2)} mm</span>
                            </div>
                            <input
                                type="range"
                                min="0.10"
                                max="1.50"
                                step="0.01"
                                value={wallThickness}
                                onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0.10 mm</span>
                                <span>0.36 mm (Soal TKA)</span>
                                <span>1.50 mm</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="col-span-2 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="font-semibold text-slate-300">Geser Rahang Geser (Jangka Sorong)</span>
                            <span className="font-mono text-pink-400 font-bold">{vernierPos.toFixed(1)} mm</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="100.0"
                            step="0.1"
                            value={vernierPos}
                            onChange={(e) => setVernierPos(parseFloat(e.target.value))}
                            className="w-full accent-pink-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                        />
                    </div>
                )}
            </div>

            {/* Contextual Physics TKA Analysis Box */}
            {mode === 'micrometer' && (
                <div className="mt-4 p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center gap-2 text-violet-300 font-bold">
                        <span>💡 Kasus Asli Soal 1 TKA 2025 (Wadah Manik-manik Hega):</span>
                    </div>
                    <p className="leading-relaxed">
                        Diameter Luar = <strong className="text-cyan-300">{thimblePos.toFixed(2)} mm</strong> | Ketebalan Dinding = <strong className="text-purple-300">{wallThickness.toFixed(2)} mm</strong>.
                    </p>
                    <p className="leading-relaxed">
                        Rumus Diameter Dalam Wadah:
                        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-300 ml-1">
                            D_dalam = D_luar - 2 &times; Tebal = {thimblePos.toFixed(2)} - 2({wallThickness.toFixed(2)}) = {innerDiameter.toFixed(2)} mm
                        </span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                        Kesimpulan: Manik-manik yang dapat dimasukkan adalah manik-manik yang memiliki diameter &le; {innerDiameter.toFixed(2)} mm!
                    </p>
                </div>
            )}
        </div>
    );
}
