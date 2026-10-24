"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function DCCircuitBillingSim() {
    const [subTab, setSubTab] = useState<'circuit' | 'billing'>('circuit');

    // Circuit Simulator State (Soal 24)
    const [circuitBMode, setCircuitBMode] = useState<'paralel' | 'seri'>('paralel');
    const [vA, setVA] = useState<number>(12); // V
    const [vB, setVB] = useState<number>(6); // V

    // Circuit A: Two 6-ohm in series -> 12 ohms
    const rA = 12; // 6 + 6
    const iA = vA / rA; // 12 / 12 = 1.0 A

    // Circuit B: Two 3-ohm in parallel (1.5 ohm) or series (6 ohm)
    const rB = circuitBMode === 'paralel' ? 1.5 : 6.0;
    const iB = vB / rB; // 6 / 1.5 = 4A or 6 / 6 = 1A

    // Billing Simulator State (Soal 25)
    const [acHours, setAcHours] = useState<number>(8); // hours/day (Default 8, can reduce to 4)
    const [tvHours, setTvHours] = useState<number>(5);
    const [wmDays, setWmDays] = useState<number>(8);
    const [ironDays, setIronDays] = useState<number>(12);

    const tarifPerKwh = 1500;

    // Monthly kWh calculations
    const acKwh = (1000 * acHours * 30) / 1000;
    const fridgeKwh = (150 * 24 * 30) / 1000; // 108 kWh
    const wmKwh = (350 * 1 * wmDays) / 1000;
    const ironKwh = (300 * 1 * ironDays) / 1000;
    const tvKwh = (100 * tvHours * 30) / 1000;

    const totalKwh = acKwh + fridgeKwh + wmKwh + ironKwh + tvKwh;
    const totalBillRp = totalKwh * tarifPerKwh;
    const isUnderBudget = totalBillRp < 375000;

    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        // Lab Circuit Background
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#090d16");
        bg.addColorStop(1, "#1e1e38");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        if (subTab === 'circuit') {
            drawCircuits(ctx, width, height);
        } else {
            drawBillingVisual(ctx, width, height);
        }
    }, [subTab, circuitBMode, vA, vB, iA, iB, acHours, totalKwh, totalBillRp, isUnderBudget]);

    function drawCircuits(ctx: CanvasRenderingContext2D, W: number, H: number) {
        // --- LEFT: RANGKAIAN A (Seri 6Ω + 6Ω) ---
        const aX = 40;
        const aY = 40;
        const cW = 240;
        const cH = 190;

        ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.roundRect(aX, aY, cW, cH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("RANGKAIAN A", aX + cW / 2, aY + 22);

        // Wires
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(aX + 35, aY + 60);
        ctx.lineTo(aX + cW - 35, aY + 60);
        ctx.lineTo(aX + cW - 35, aY + cH - 35);
        ctx.lineTo(aX + 35, aY + cH - 35);
        ctx.closePath();
        ctx.stroke();

        // Resistors in series on top wire
        drawResistor(ctx, aX + 80, aY + 60, "6 Ω");
        drawResistor(ctx, aX + 160, aY + 60, "6 Ω");

        // Voltage Source on bottom wire
        drawVoltageSource(ctx, aX + cW / 2, aY + cH - 35, `${vA} V`);

        // Ammeter Readout Badge
        ctx.fillStyle = "#0284c7";
        ctx.roundRect(aX + cW / 2 - 45, aY + 105, 90, 26, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px monospace";
        ctx.fillText(`I_A = ${iA.toFixed(2)} A`, aX + cW / 2, aY + 122);

        // --- RIGHT: RANGKAIAN B (Paralel / Seri 3Ω & 3Ω) ---
        const bX = 350;
        const bY = 40;

        ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
        ctx.strokeStyle = iA === iB ? "#22c55e" : "#fbbf24";
        ctx.lineWidth = 1.5;
        ctx.roundRect(bX, bY, cW, cH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = iA === iB ? "#22c55e" : "#fbbf24";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`RANGKAIAN B (${circuitBMode.toUpperCase()})`, bX + cW / 2, bY + 22);

        if (circuitBMode === 'paralel') {
            // Parallel layout
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 2.5;

            // Outer circuit loop
            ctx.beginPath();
            ctx.moveTo(bX + 35, bY + 50);
            ctx.lineTo(bX + 80, bY + 50);
            ctx.lineTo(bX + 80, bY + 90);
            ctx.moveTo(bX + 160, bY + 50);
            ctx.lineTo(bX + cW - 35, bY + 50);
            ctx.lineTo(bX + cW - 35, bY + cH - 35);
            ctx.lineTo(bX + 35, bY + cH - 35);
            ctx.lineTo(bX + 35, bY + 50);
            ctx.stroke();

            // Branch 1 (top)
            ctx.beginPath();
            ctx.moveTo(bX + 80, bY + 50);
            ctx.lineTo(bX + 160, bY + 50);
            ctx.stroke();
            drawResistor(ctx, bX + 120, bY + 50, "3 Ω");

            // Branch 2 (bottom branch)
            ctx.beginPath();
            ctx.moveTo(bX + 80, bY + 90);
            ctx.lineTo(bX + 160, bY + 90);
            ctx.lineTo(bX + 160, bY + 50);
            ctx.stroke();
            drawResistor(ctx, bX + 120, bY + 90, "3 Ω");

            // Voltage Source
            drawVoltageSource(ctx, bX + cW / 2, bY + cH - 35, `${vB} V`);
        } else {
            // Series layout (Modified to match Circuit A)
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(bX + 35, bY + 60);
            ctx.lineTo(bX + cW - 35, bY + 60);
            ctx.lineTo(bX + cW - 35, bY + cH - 35);
            ctx.lineTo(bX + 35, bY + cH - 35);
            ctx.closePath();
            ctx.stroke();

            drawResistor(ctx, bX + 80, bY + 60, "3 Ω");
            drawResistor(ctx, bX + 160, bY + 60, "3 Ω");

            drawVoltageSource(ctx, bX + cW / 2, bY + cH - 35, `${vB} V`);
        }

        // Ammeter Readout Badge for B
        ctx.fillStyle = iA === iB ? "#15803d" : "#b45309";
        ctx.roundRect(bX + cW / 2 - 45, bY + 115, 90, 26, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px monospace";
        ctx.fillText(`I_B = ${iB.toFixed(2)} A`, bX + cW / 2, bY + 132);

        // Matching Status Banner
        ctx.fillStyle = iA === iB ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)";
        ctx.strokeStyle = iA === iB ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 1;
        ctx.roundRect(W / 2 - 160, H - 45, 320, 32, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = iA === iB ? "#4ade80" : "#f87171";
        ctx.fillText(
            iA === iB ? "✅ ARUS SAMA PERSIS: I_A = I_B = 1,00 A!" : "⚠️ ARUS BERBEDA: I_A = 1,0 A ≠ I_B = 4,0 A",
            W / 2,
            H - 24
        );
    }

    function drawBillingVisual(ctx: CanvasRenderingContext2D, W: number, H: number) {
        // Household Appliances Power Breakdown Chart
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("DISTRIBUSI KONSUMSI LISTRIK RUMAH TANGGA PER BULAN", 40, 45);

        // Appliances Data
        const apps = [
            { name: `AC 1000W (${acHours}j/hari)`, kwh: acKwh, color: "#38bdf8" },
            { name: "Kulkas 150W (24j/hari)", kwh: fridgeKwh, color: "#a855f7" },
            { name: "TV 100W (5j/hari)", kwh: tvKwh, color: "#facc15" },
            { name: "Mesin Cuci 350W", kwh: wmKwh, color: "#ec4899" },
            { name: "Setrika 300W", kwh: ironKwh, color: "#f97316" },
        ];

        // Horizontal Stacked Bar
        const barX = 40;
        const barY = 65;
        const barW = W - 80;
        const barH = 34;

        let curX = barX;
        apps.forEach(app => {
            const segW = (app.kwh / totalKwh) * barW;
            ctx.fillStyle = app.color;
            ctx.fillRect(curX, barY, segW, barH);
            curX += segW;
        });

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        // Budget Comparison Gauge
        const gaugeY = 135;
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = isUnderBudget ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 1.5;
        ctx.roundRect(40, gaugeY, W - 80, 110, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.fillText("TARGET KELUARGA: Tagihan Listrik < Rp 375.000 / Bulan (Maksimal 250 kWh)", 60, gaugeY + 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px monospace";
        ctx.fillText(`Total Konsumsi Energi : ${totalKwh.toFixed(1)} kWh`, 60, gaugeY + 58);

        ctx.fillStyle = isUnderBudget ? "#4ade80" : "#f87171";
        ctx.font = "bold 18px monospace";
        ctx.fillText(
            `Total Tagihan Bulanan : Rp ${Math.round(totalBillRp).toLocaleString('id-ID')}`,
            60,
            gaugeY + 86
        );

        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(
            isUnderBudget ? "✅ DI BAWAH TARGET (HEMAT!)" : "❌ MELEBIHI TARGET ANGGARAN!",
            W - 60,
            gaugeY + 86
        );
    }

    function drawResistor(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
        ctx.fillStyle = "#f59e0b";
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2;
        ctx.fillRect(x - 18, y - 8, 36, 16);
        ctx.strokeRect(x - 18, y - 8, 36, 16);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y + 3);
    }

    function drawVoltageSource(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(x - 20, y - 10, 40, 20);

        // Long line (+) and short thick line (-)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 12);
        ctx.lineTo(x - 8, y + 12);
        ctx.stroke();

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 6);
        ctx.lineTo(x + 4, y + 6);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y + 24);
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚡</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Rangkaian Arus Searah & Kalkulator Tarif Listrik PLN
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 24 (Modifikasi Arus Rangkaian) & Soal No. 25 (Tagihan &lt; Rp 375.000)
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSubTab('circuit')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            subTab === 'circuit'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Modifikasi Rangkaian (Soal 24)
                    </button>
                    <button
                        onClick={() => setSubTab('billing')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            subTab === 'billing'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Tagihan Listrik Rumah (Soal 25)
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Interactive Controls */}
            {subTab === 'circuit' ? (
                <div className="mt-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-300">
                        <strong className="text-white block mb-1">Modifikasi Susunan Resistor Rangkaian B:</strong>
                        <span>Pilih susunan agar kuat arus Rangkaian B sama dengan Rangkaian A (IA = 1,0 A).</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCircuitBMode('paralel')}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                                circuitBMode === 'paralel'
                                    ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                        >
                            Paralel (Awal: I = 4 A)
                        </button>
                        <button
                            onClick={() => setCircuitBMode('seri')}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                                circuitBMode === 'seri'
                                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                        >
                            Ubah Jadi Seri (Hasil: I = 1 A) ✅
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="font-semibold text-slate-300">Durasi Penggunaan AC 1000W (Keluarga)</span>
                            <span className="font-mono text-cyan-400 font-bold">{acHours} jam / hari</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="10"
                            step="1"
                            value={acHours}
                            onChange={(e) => setAcHours(parseInt(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>2 jam/hari</span>
                            <span className="text-emerald-400 font-bold">4 jam/hari (Keputusan Terbaik Soal 25)</span>
                            <span>8 jam/hari (Awal)</span>
                            <span>10 jam/hari</span>
                        </div>
                    </div>
                </div>
            )}

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                {subTab === 'circuit' ? (
                    <>
                        <strong className="block text-violet-300 font-bold text-sm">
                            🎯 Penurunan Rumus Soal No. 24 TKA (Agar Kuat Arus Kedua Rangkaian Sama):
                        </strong>
                        <p>1. <strong>Rangkaian A:</strong> VA = 12 V, dua resistor 6 Ω disusun seri:</p>
                        <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                            RA = 6 + 6 = 12 Ω  ⟹  IA = 12 / 12 = 1,0 A
                        </div>
                        <p>2. <strong>Rangkaian B:</strong> VB = 6 V. Jika susunan dua resistor 3 Ω <strong>diubah menjadi seri</strong>:</p>
                        <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                            RB = 3 + 3 = 6 Ω  ⟹  IB = 6 / 6 = 1,0 A
                        </div>
                        <p className="text-emerald-300 font-semibold pt-1">
                            👉 Jawaban TKA: Ubah susunan resistor Rangkaian B menjadi seri (Opsi C).
                        </p>
                    </>
                ) : (
                    <>
                        <strong className="block text-violet-300 font-bold text-sm">
                            🎯 Analisis Keputusan Soal No. 25 TKA (Target Tagihan &lt; Rp 375.000 / Bulan):
                        </strong>
                        <p>
                            Pemakaian energi awal: AC (240 kWh), Kulkas (108 kWh), TV (15 kWh), Setrika (3,6 kWh), Mesin Cuci (2,8 kWh).
                            Total energi = 369,4 kWh. Biaya awal = 369,4 × 1.500 = Rp 554.100.
                        </p>
                        <p>
                            Beban daya terbesar adalah AC (1.000 W).
                            Jika durasi pemakaian AC dikurangi menjadi <strong>4 jam per hari</strong>, penghematan energi:
                        </p>
                        <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                            ΔE = 1 kW × 4 jam × 30 hari = 120 kWh
                        </div>
                        <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                            Total energi baru = 369,4 - 120 = 249,4 kWh ⟹ Biaya = 249,4 × Rp 1.500 = Rp 374.100 (&lt; Rp 375.000!)
                        </div>
                        <p className="text-emerald-300 font-semibold pt-1">
                            👉 Jawaban TKA: Mengurangi penggunaan AC menjadi 4 jam per hari (Opsi A).
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
