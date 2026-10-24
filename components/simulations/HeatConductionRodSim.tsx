"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function HeatConductionRodSim() {
    const [burnerOn, setBurnerOn] = useState<boolean>(false);
    const [elapsedSec, setElapsedSec] = useState<number>(0);
    const [metalType, setMetalType] = useState<'besi' | 'tembaga' | 'aluminium'>('besi');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Thermal conductivity k (W/m*K)
    const kMap = {
        besi: 80,
        aluminium: 205,
        tembaga: 385,
    };
    const kVal = kMap[metalType];

    // 5 wax positions at distances 5, 10, 15, 20, 25 cm
    const waxDistances = [5, 10, 15, 20, 25]; // cm
    // Melting threshold temp: 60 deg C
    // Time to reach 60 deg C scales with (x^2 / k)
    const meltTimes = waxDistances.map(d => {
        const factor = (d * d * 0.12) / (kVal / 80);
        return parseFloat(factor.toFixed(1));
    });

    useEffect(() => {
        let interval: any;
        if (burnerOn) {
            interval = setInterval(() => {
                setElapsedSec(prev => parseFloat((prev + 0.2).toFixed(1)));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [burnerOn]);

    const resetExp = () => {
        setBurnerOn(false);
        setElapsedSec(0);
    };

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

        // Lab Bench Background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);

        // Bench Surface
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(20, 250, width - 40, 50);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 250, width - 40, 50);

        // Stands holding metal rod
        ctx.fillStyle = "#64748b";
        ctx.fillRect(80, 150, 16, 100);
        ctx.fillRect(520, 150, 16, 100);

        // Spiritus Burner at x = 70
        drawBurner(ctx, 88, 250, burnerOn);

        // Metal Rod (Length = 30 cm, x = 80 to 520, y = 140)
        const rodX = 80;
        const rodY = 140;
        const rodW = 440;
        const rodH = 14;

        // Thermal Gradient along rod
        const rodGrad = ctx.createLinearGradient(rodX, 0, rodX + rodW, 0);
        if (burnerOn) {
            const heatSpread = Math.min(1, elapsedSec / 25);
            rodGrad.addColorStop(0, "#ef4444"); // Glowing red
            rodGrad.addColorStop(0.15 * heatSpread, "#f97316"); // Orange
            rodGrad.addColorStop(0.4 * heatSpread, "#facc15"); // Yellow
            rodGrad.addColorStop(Math.min(1, 0.7 * heatSpread), "#94a3b8"); // Steel
            rodGrad.addColorStop(1, "#64748b");
        } else {
            rodGrad.addColorStop(0, "#94a3b8");
            rodGrad.addColorStop(1, "#64748b");
        }
        ctx.fillStyle = rodGrad;
        ctx.fillRect(rodX, rodY, rodW, rodH);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rodX, rodY, rodW, rodH);

        // 5 Wax Drops & Stopwatches
        ctx.font = "9px monospace";
        ctx.textAlign = "center";

        waxDistances.forEach((dist, idx) => {
            const waxX = rodX + (dist / 30) * rodW;
            const tMelt = meltTimes[idx];
            const hasMelted = burnerOn && elapsedSec >= tMelt;

            // Distance mark
            ctx.fillStyle = "#cbd5e1";
            ctx.fillText(`${dist} cm`, waxX, rodY - 24);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.beginPath();
            ctx.moveTo(waxX, rodY - 18);
            ctx.lineTo(waxX, rodY);
            ctx.stroke();

            // Wax Drop (Yellow)
            if (!hasMelted) {
                ctx.fillStyle = "#fef08a";
                ctx.strokeStyle = "#eab308";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(waxX, rodY - 5, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else {
                // Melted drop puddle falling
                ctx.fillStyle = "rgba(254, 240, 138, 0.6)";
                ctx.fillRect(waxX - 6, rodY + rodH, 12, 3);
                ctx.beginPath();
                ctx.arc(waxX, 248, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Stopwatch badge under each wax drop
            ctx.fillStyle = hasMelted ? "rgba(34, 197, 94, 0.2)" : "rgba(15, 23, 42, 0.8)";
            ctx.strokeStyle = hasMelted ? "#22c55e" : "#475569";
            ctx.lineWidth = 1;
            ctx.roundRect(waxX - 26, rodY + 28, 52, 28, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = hasMelted ? "#4ade80" : "#94a3b8";
            ctx.font = "bold 9px monospace";
            ctx.fillText(hasMelted ? `${tMelt}s` : `t=?`, waxX, rodY + 42);
            ctx.font = "8px sans-serif";
            ctx.fillText(hasMelted ? "Meleleh" : "Padat", waxX, rodY + 52);
        });

        // Live Timer HUD Box (Top Right)
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(width - 190, 20, 170, 75, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("STOPWATCH LAB:", width - 180, 38);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 20px monospace";
        ctx.fillText(`${elapsedSec.toFixed(1)} detik`, width - 180, 64);

        ctx.fillStyle = "#a855f7";
        ctx.font = "10px sans-serif";
        ctx.fillText(`Bahan: Batang ${metalType.toUpperCase()}`, width - 180, 82);
    }, [burnerOn, elapsedSec, metalType, meltTimes]);

    function drawBurner(ctx: CanvasRenderingContext2D, x: number, y: number, lit: boolean) {
        // Burner Base Jar
        ctx.fillStyle = "#38bdf822";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.fillRect(x - 20, y - 55, 40, 55);
        ctx.strokeRect(x - 20, y - 55, 40, 55);

        // Cap & Wick
        ctx.fillStyle = "#64748b";
        ctx.fillRect(x - 8, y - 65, 16, 10);

        if (lit) {
            // Flame
            ctx.fillStyle = "#f97316";
            ctx.beginPath();
            ctx.ellipse(x, y - 80, 9, 20, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.ellipse(x, y - 76, 5, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🕯️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Percobaan Konduksi Kalor Batang Logam & Lilin Meleleh
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 18 & 19 TKA 2025: Analisis Variabel & Kelemahan Prosedur
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setBurnerOn(!burnerOn)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                            burnerOn
                                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                        }`}
                    >
                        {burnerOn ? "Matikan Api ⏸" : "Nyalakan Kompor Spiritus 🔥"}
                    </button>
                    <button
                        onClick={resetExp}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
                    >
                        Reset ↺
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Material Selector */}
            <div className="flex items-center gap-3 mt-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-xs">
                <span className="font-semibold text-slate-300">Variabel Kontrol (Jenis Logam):</span>
                {(['besi', 'tembaga', 'aluminium'] as const).map(m => (
                    <button
                        key={m}
                        onClick={() => { setMetalType(m); resetExp(); }}
                        className={`px-3 py-1 rounded-lg capitalize font-bold transition-all ${
                            metalType === m
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-700/50 text-slate-400 hover:text-white'
                        }`}
                    >
                        {m} (k = {kMap[m]} W/mK)
                    </button>
                ))}
            </div>

            {/* TKA Solution Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300 space-y-1.5">
                    <strong className="block text-violet-300 font-bold text-sm">
                        🎯 Analisis Variabel Soal No. 18 TKA:
                    </strong>
                    <ul className="space-y-1">
                        <li>• <strong className="text-cyan-400">Variabel Bebas:</strong> Jarak lilin dari sumber kalor (panjang efektif logam $L$).</li>
                        <li>• <strong className="text-pink-400">Variabel Terikat:</strong> Waktu melelehnya lilin ($t$).</li>
                        <li>• <strong className="text-amber-400">Variabel Kontrol:</strong> Jenis logam (besi), luas penampang batang, jenis nyala api.</li>
                    </ul>
                    <p className="text-emerald-300 font-semibold pt-1">👉 Jawaban TKA: Opsi C.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300 space-y-1.5">
                    <strong className="block text-violet-300 font-bold text-sm">
                        🎯 Evaluasi Prosedur Soal No. 19 TKA (Penyebab Data Tidak Akurat):
                    </strong>
                    <p className="leading-relaxed">
                        Jika potongan lilin atau mentega dipotong manual tanpa ditimbang massanya atau bentuknya tidak seragam, lilin yang lebih kecil akan meleleh lebih cepat bukan karena jaraknya melainkan karena ukurannya yang tidak seragam.
                    </p>
                    <p className="text-emerald-300 font-semibold pt-1">
                        👉 Jawaban TKA: Jenis lilin dan ukuran lilin tidak dipastikan sama sehingga tidak homogen (Opsi A).
                    </p>
                </div>
            </div>
        </div>
    );
}
