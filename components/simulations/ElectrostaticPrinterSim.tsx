"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function ElectrostaticPrinterSim() {
    const [probeXCm, setProbeXCm] = useState<number>(3.2); // cm along x-axis
    const [q1MicroC, setQ1MicroC] = useState<number>(-4); // microCoulomb
    const [q2MicroC, setQ2MicroC] = useState<number>(-9); // microCoulomb
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics
    const dCm = 8.0; // distance between electrodes in cm
    const k = 9e9;

    // Convert cm to meters
    const r1M = Math.abs(probeXCm) / 100;
    const r2M = Math.abs(dCm - probeXCm) / 100;

    // E fields magnitude
    const E1 = r1M > 0.002 ? (k * Math.abs(q1MicroC) * 1e-6) / (r1M * r1M) : 9999999;
    const E2 = r2M > 0.002 ? (k * Math.abs(q2MicroC) * 1e-6) / (r2M * r2M) : 9999999;

    // Direction along x-axis (negative charges attract toward themselves)
    // For x between 0 and 8: E1 points left (-), E2 points right (+)
    let Etotal = 0;
    if (probeXCm < 0) {
        Etotal = E1 + E2; // both point right (+) toward charges
    } else if (probeXCm > dCm) {
        Etotal = -(E1 + E2); // both point left (-) toward charges
    } else {
        Etotal = E2 - E1; // opposite directions
    }

    const isZeroField = Math.abs(Etotal) < 2e6 || Math.abs(probeXCm - 3.2) < 0.1;

    useEffect(() => {
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

        ctx.clearRect(0, 0, width, height);

        // Printer Chassis Dark Background
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#090d16");
        bg.addColorStop(1, "#172554");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Laser Printer Paper Sheet (White backdrop)
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(40, 70, 360, 150);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, 70, 360, 150);

        ctx.fillStyle = "#64748b";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Kertas Cetak Printer Elektrostatik", 50, 88);

        // X-Axis on Paper (from x = -2 cm to +10 cm)
        const axisY = 145;
        const originPx = 100; // x = 0 cm
        const pxPerCm = 30; // 1 cm = 30 px
        const q2Px = originPx + dCm * pxPerCm; // x = 8 cm = 100 + 240 = 340 px

        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(50, axisY);
        ctx.lineTo(390, axisY);
        ctx.stroke();

        // Ticks along axis
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        for (let c = 0; c <= 8; c += 2) {
            const tx = originPx + c * pxPerCm;
            ctx.strokeStyle = "#94a3b8";
            ctx.beginPath();
            ctx.moveTo(tx, axisY - 4);
            ctx.lineTo(tx, axisY + 4);
            ctx.stroke();
            ctx.fillStyle = "#64748b";
            ctx.fillText(`${c}`, tx, axisY + 16);
        }

        // Electrode Q1 at x = 0 (Blue Negative Charge)
        drawElectrode(ctx, originPx, axisY, `${q1MicroC} μC`, "Q₁ (x=0)");

        // Electrode Q2 at x = 8 cm (Blue Negative Charge)
        drawElectrode(ctx, q2Px, axisY, `${q2MicroC} μC`, "Q₂ (x=8)");

        // Electric Field Vector Arrows at Probe Position
        const probePx = originPx + probeXCm * pxPerCm;

        // Draw Sensor Probe
        ctx.fillStyle = isZeroField ? "#22c55e" : "#f59e0b";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(probePx, axisY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isZeroField ? "#4ade80" : "#fbbf24";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Sensor (x=${probeXCm.toFixed(1)} cm)`, probePx, axisY - 14);

        // Arrows E1 and E2 if inside
        if (probeXCm > 0.5 && probeXCm < 7.5) {
            // E1 points toward Q1 (Left)
            const e1Len = Math.min(E1 / 1.5e6, 45);
            drawArrow(ctx, probePx, axisY - 5, probePx - e1Len, axisY - 5, "#38bdf8");
            ctx.fillStyle = "#38bdf8";
            ctx.font = "9px monospace";
            ctx.fillText("E₁ (ke kiri)", probePx - e1Len / 2, axisY - 12);

            // E2 points toward Q2 (Right)
            const e2Len = Math.min(E2 / 1.5e6, 45);
            drawArrow(ctx, probePx, axisY + 5, probePx + e2Len, axisY + 5, "#a855f7");
            ctx.fillStyle = "#a855f7";
            ctx.fillText("E₂ (ke kanan)", probePx + e2Len / 2, axisY + 22);
        }

        // Zero Field Detection Marker
        const zeroPx = originPx + 3.2 * pxPerCm;
        ctx.strokeStyle = "rgba(34, 197, 94, 0.7)";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(zeroPx, 90);
        ctx.lineTo(zeroPx, 210);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("Titik E = 0 (x = 3,2 cm)", zeroPx, 205);

        // --- HUD Box (Right Side) ---
        const hudX = width - 200;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = isZeroField ? "#22c55e" : "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(hudX - 10, 20, 190, 265, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("ANALISIS MEDAN LISTRIK:", hudX, 42);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Q₁ = ${q1MicroC} μC (di x = 0)`, hudX, 66);
        ctx.fillText(`Q₂ = ${q2MicroC} μC (di x = 8 cm)`, hudX, 84);
        ctx.fillText(`Posisi x = ${probeXCm.toFixed(2)} cm`, hudX, 102);

        ctx.strokeStyle = "#334155";
        ctx.beginPath();
        ctx.moveTo(hudX, 114);
        ctx.lineTo(hudX + 165, 114);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`E₁ = k|Q₁|/x²:`, hudX, 134);
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${(E1 / 1e6).toFixed(2)} MN/C`, hudX, 150);

        ctx.fillStyle = "#a855f7";
        ctx.fillText(`E₂ = k|Q₂|/(8-x)²:`, hudX, 172);
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${(E2 / 1e6).toFixed(2)} MN/C`, hudX, 188);

        ctx.fillStyle = isZeroField ? "#22c55e" : "#f59e0b";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("Medan Total E_tot:", hudX, 214);
        ctx.font = "bold 15px monospace";
        ctx.fillText(isZeroField ? "0 N/C (NOL!)" : `${(Math.abs(Etotal) / 1e6).toFixed(2)} MN/C`, hudX, 234);

        if (isZeroField) {
            ctx.fillStyle = "#4ade80";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("🎯 Partikel toner seimbang!", hudX, 258);
        } else {
            ctx.fillStyle = "#94a3b8";
            ctx.font = "9px sans-serif";
            ctx.fillText("E₁ ≠ E₂ (Belum Seimbang)", hudX, 258);
        }
    }, [probeXCm, q1MicroC, q2MicroC, dCm, E1, E2, Etotal, isZeroField]);

    function drawElectrode(ctx: CanvasRenderingContext2D, x: number, y: number, chargeText: string, label: string) {
        ctx.fillStyle = "#0284c7";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Minus sign for negative charge
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 6, y);
        ctx.stroke();

        ctx.fillStyle = "#0284c7";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(chargeText, x, y - 20);
        ctx.fillStyle = "#475569";
        ctx.fillText(label, x, y + 26);
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 5;
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

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🖨️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Listrik Statis & Elektroda Printer Toner
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 23 TKA 2025: Q₁ = -4 μC (x=0) & Q₂ = -9 μC (x=8 cm)
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setProbeXCm(3.2)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isZeroField
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Titik Nol: x = 3,2 cm (Soal 23)
                    </button>
                    <button
                        onClick={() => setProbeXCm(4.0)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
                    >
                        Titik Tengah: x = 4 cm
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Probe Slider */}
            <div className="mt-5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-300">Geser Posisi Sensor Partikel Toner di Sumbu-X:</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">x = {probeXCm.toFixed(2)} cm</span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="7.5"
                    step="0.1"
                    value={probeXCm}
                    onChange={(e) => setProbeXCm(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>x = 0 (Dekat Q₁)</span>
                    <span className="text-emerald-400 font-bold">x = 3.2 cm (E_total = 0 N/C)</span>
                    <span>x = 4 cm (Tengah)</span>
                    <span>x = 8 cm (Dekat Q₂)</span>
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 23 TKA (Menentukan Titik Kuat Medan Listrik Nol):
                </strong>
                <p>
                    Kedua muatan bernilai negatif (Q1 = -4 μC dan Q2 = -9 μC). Arah garis medan listrik selalu <strong>menuju ke muatan negatif</strong>.
                    Di antara kedua muatan, medan E1 mengarah ke kiri (menuju Q1) dan medan E2 mengarah ke kanan (menuju Q2), sehingga titik medan total nol pasti berada <strong>di antara kedua muatan</strong>.
                </p>
                <p>Syarat medan nol (E1 = E2):</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    k · |Q1| / x² = k · |Q2| / (8 - x)²  ⟹  √4 / x = √9 / (8 - x)
                </div>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    2 / x = 3 / (8 - x)  ⟹  2(8 - x) = 3x  ⟹  5x = 16  ⟹  x = 3,2 cm
                </div>
                <p className="text-emerald-300 font-semibold pt-1">
                    👉 Jawaban TKA: Di sebelah kanan Q1, yaitu pada x = 3,2 cm (Opsi B).
                </p>
            </div>
        </div>
    );
}
