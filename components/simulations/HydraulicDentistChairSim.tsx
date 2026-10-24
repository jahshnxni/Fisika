"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function HydraulicDentistChairSim() {
    const [loadF2, setLoadF2] = useState<number>(540); // N (Patient on chair)
    const [d2Cm, setD2Cm] = useState<number>(3.0); // cm (large piston diameter)
    const [d1Cm, setD1Cm] = useState<number>(0.5); // cm (small piston diameter)
    const [pedalPress, setPedalPress] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Physics
    const areaRatio = (d2Cm * d2Cm) / (d1Cm * d1Cm); // (3 / 0.5)^2 = 36
    const minForceF1 = areaRatio > 0 ? loadF2 / areaRatio : 0; // 540 / 36 = 15 N
    const pressurePa = (loadF2 / (Math.PI * Math.pow((d2Cm / 100) / 2, 2))) / 1000; // in kPa

    useEffect(() => {
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

        ctx.clearRect(0, 0, width, height);

        // Clinic Background
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#082f49");
        bg.addColorStop(1, "#0f172a");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Floor
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 270, width, 50);
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 270, width, 50);

        // Small Piston Column (Left - Foot Pedal)
        const p1X = 140;
        const p1W = 28;
        const p1TopY = pedalPress ? 180 : 160;

        // Large Piston Column (Right - Dentist Chair)
        const p2X = 380;
        const p2W = 90;
        const p2Lift = pedalPress ? 15 : 0;
        const p2TopY = 160 - p2Lift;

        // Connecting Hydraulic Fluid Chamber
        ctx.fillStyle = "#0284c7"; // Hydraulic oil blue
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Left cylinder
        ctx.moveTo(p1X - p1W / 2, p1TopY + 20);
        ctx.lineTo(p1X - p1W / 2, 250);
        // Bottom tube
        ctx.lineTo(p2X - p2W / 2, 250);
        // Right cylinder
        ctx.lineTo(p2X - p2W / 2, p2TopY + 30);
        ctx.lineTo(p2X + p2W / 2, p2TopY + 30);
        ctx.lineTo(p2X + p2W / 2, 265);
        ctx.lineTo(p1X + p1W / 2, 265);
        ctx.lineTo(p1X + p1W / 2, p1TopY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Small Piston Rod & Foot Pedal
        ctx.fillStyle = "#94a3b8";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.fillRect(p1X - 6, p1TopY - 40, 12, 60);
        // Piston seal head
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(p1X - p1W / 2 + 2, p1TopY + 12, p1W - 4, 10);
        // Pedal Plate
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(p1X - 22, p1TopY - 45, 44, 8);

        // Downward Force Arrow F1
        drawArrow(ctx, p1X, p1TopY - 75, p1X, p1TopY - 48, "#ef4444");
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`F₁ = ${minForceF1.toFixed(1)} N`, p1X, p1TopY - 82);
        ctx.font = "9px monospace";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(`d₁ = ${d1Cm} cm`, p1X, 285);

        // Large Piston Rod & Dentist Chair
        ctx.fillStyle = "#64748b";
        ctx.fillRect(p2X - 16, p2TopY - 30, 32, 60);
        // Piston seal head
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(p2X - p2W / 2 + 3, p2TopY + 20, p2W - 6, 12);

        // Dentist Chair Graphics
        drawDentistChair(ctx, p2X, p2TopY - 30, loadF2);

        // Upward Support Arrow F2
        drawArrow(ctx, p2X, p2TopY + 40, p2X, p2TopY - 10, "#22c55e");
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`F₂ = ${loadF2} N`, p2X, p2TopY + 55);
        ctx.font = "9px monospace";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(`d₂ = ${d2Cm} cm`, p2X, 285);

        // --- HUD Stats Panel ---
        const hudX = width - 170;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(hudX - 10, 20, 160, 240, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("HUKUM PASCAL:", hudX, 40);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`F₂ Beban = ${loadF2} N`, hudX, 65);
        ctx.fillText(`d₂ Besar = ${d2Cm} cm`, hudX, 85);
        ctx.fillText(`d₁ Kecil = ${d1Cm} cm`, hudX, 105);

        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Rasio Luas (A₂/A₁):`, hudX, 130);
        ctx.font = "bold 11px monospace";
        ctx.fillText(`= (${d2Cm}/${d1Cm})² = ${areaRatio}×`, hudX, 146);

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`Gaya Tekan F₁:`, hudX, 175);
        ctx.font = "bold 16px monospace";
        ctx.fillText(`${minForceF1.toFixed(1)} N`, hudX, 196);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "9px sans-serif";
        ctx.fillText(`Tekanan P₁ = P₂:`, hudX, 220);
        ctx.fillText(`${pressurePa.toFixed(1)} kPa`, hudX, 235);
    }, [loadF2, d2Cm, d1Cm, pedalPress, minForceF1, areaRatio, pressurePa]);

    function drawDentistChair(ctx: CanvasRenderingContext2D, x: number, y: number, load: number) {
        ctx.save();
        ctx.translate(x, y);

        // Chair Base Mount
        ctx.fillStyle = "#475569";
        ctx.fillRect(-35, -8, 70, 8);

        // Ergonomic Chair Seat
        ctx.fillStyle = "#0284c7";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-45, -24, 75, 16, 4);
        ctx.fill();
        ctx.stroke();

        // Reclined Backrest
        ctx.beginPath();
        ctx.roundRect(-58, -60, 16, 42, 4);
        ctx.fill();
        ctx.stroke();

        // Headrest
        ctx.beginPath();
        ctx.roundRect(-56, -78, 12, 14, 3);
        ctx.fill();
        ctx.stroke();

        // Patient Figure (stickman relaxed)
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(-50, -71, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-48, -64);
        ctx.lineTo(-40, -24);
        ctx.lineTo(15, -24);
        ctx.lineTo(25, -5);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Pasien (540 N)", 0, -32);

        ctx.restore();
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 6;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
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
                    <span className="text-xl">🩺</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Sistem Hidrolik Kursi Dokter Gigi (Hukum Pascal)
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 12 TKA 2025: F₂ = 540 N, D₂ = 3 cm, D₁ = 0,5 cm
                        </p>
                    </div>
                </div>

                <button
                    onMouseDown={() => setPedalPress(true)}
                    onMouseUp={() => setPedalPress(false)}
                    onTouchStart={() => setPedalPress(true)}
                    onTouchEnd={() => setPedalPress(false)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-sky-900/40"
                >
                    {pedalPress ? "Injak Pedal Sedang Aktif! 🦶" : "Tekan / Injak Pedal Kaki 🦶"}
                </button>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Beban Kursi & Pasien (F₂)</span>
                        <span className="font-mono text-emerald-400 font-bold">{loadF2} N</span>
                    </div>
                    <input
                        type="range"
                        min="180"
                        max="1080"
                        step="90"
                        value={loadF2}
                        onChange={(e) => setLoadF2(parseInt(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Diameter Piston Besar (d₂)</span>
                        <span className="font-mono text-sky-400 font-bold">{d2Cm.toFixed(1)} cm</span>
                    </div>
                    <input
                        type="range"
                        min="1.0"
                        max="6.0"
                        step="0.5"
                        value={d2Cm}
                        onChange={(e) => setD2Cm(parseFloat(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Diameter Piston Kecil (d₁)</span>
                        <span className="font-mono text-rose-400 font-bold">{d1Cm.toFixed(1)} cm</span>
                    </div>
                    <input
                        type="range"
                        min="0.2"
                        max="2.0"
                        step="0.1"
                        value={d1Cm}
                        onChange={(e) => setD1Cm(parseFloat(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 12 TKA (Gaya Terkecil Mengangkat Beban Kursi Pasien):
                </strong>
                <p>
                    Berdasarkan Hukum Pascal, tekanan fluida dalam ruang tertutup diteruskan sama besar (P1 = P2):
                </p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    F1 / A1 = F2 / A2  ⟹  F1 = F2 × (d1 / d2)²
                </div>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    F1 = 540 N × (0,5 cm / 3 cm)² = 540 × (1/6)² = 540 / 36 = 15 Newton (Jawaban A)
                </div>
                <p className="text-emerald-300 font-semibold pt-1">
                    Hanya dengan gaya injak kaki 15 N (setara beban massa 1,5 kg), dokter gigi mampu mengangkat beban pasien 540 N (setara 54 kg)!
                </p>
            </div>
        </div>
    );
}
