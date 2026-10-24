"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function MirageRefractionSim() {
    const [simMode, setSimMode] = useState<'mirage' | 'hypermetropia'>('mirage');
    const [groundTempC, setGroundTempC] = useState<number>(55); // Celsius
    const [lensPowerD, setLensPowerD] = useState<number>(2.0); // Diopter
    const [readDistCm, setReadDistCm] = useState<number>(25); // cm reading distance
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Hypermetropia calculation
    const normalSn = 25; // cm
    const patientPP = 50; // cm
    const idealPowerD = (100 / normalSn) - (100 / patientPP); // 4 - 2 = +2 D
    const isCorrectLens = Math.abs(lensPowerD - idealPowerD) < 0.2;

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

        if (simMode === 'mirage') {
            drawMirageScene(ctx, width, height, groundTempC);
        } else {
            drawHypermetropiaScene(ctx, width, height, lensPowerD, readDistCm);
        }
    }, [simMode, groundTempC, lensPowerD, readDistCm]);

    function drawMirageScene(ctx: CanvasRenderingContext2D, W: number, H: number, tempC: number) {
        // Sky Background
        const sky = ctx.createLinearGradient(0, 0, 0, 200);
        sky.addColorStop(0, "#38bdf8");
        sky.addColorStop(1, "#bae6fd");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, 200);

        // Blazing Sun
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(W - 80, 50, 28, 0, Math.PI * 2);
        ctx.fill();

        // Hot Asphalt / Dirt Field Ground
        const groundGrad = ctx.createLinearGradient(0, 200, 0, H);
        groundGrad.addColorStop(0, "#78350f");
        groundGrad.addColorStop(1, "#451a03");
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, 200, W, H - 200);

        // Heat shimmer layer (Hot air with lower density)
        const shimmerGrad = ctx.createLinearGradient(0, 160, 0, 200);
        shimmerGrad.addColorStop(0, "rgba(254, 240, 138, 0.05)");
        shimmerGrad.addColorStop(1, "rgba(254, 215, 170, 0.4)");
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(0, 160, W, 40);

        // Shimmer wavy heat lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            const wy = 175 + i * 6;
            for (let x = 0; x < W; x += 15) {
                const y = wy + Math.sin(x * 0.08 + i) * 2;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Target: Distant Green Bushes / Palm (at left)
        const plantX = 60;
        const plantY = 200;
        drawBush(ctx, plantX, plantY);

        // Observer (Student at right)
        const obsX = 550;
        const obsY = 200;
        drawObserver(ctx, obsX, obsY);

        // Straight direct ray (blocked / straight)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(plantX, plantY - 30);
        ctx.lineTo(obsX - 15, obsY - 60);
        ctx.stroke();

        // Curved Refracted Ray (Bending upward due to density gradient)
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(plantX, plantY - 25);
        // Bends downwards toward hot ground, then curves up to eye
        const bendY = 195 - (tempC - 35) * 0.4;
        ctx.quadraticCurveTo((plantX + obsX) / 2, bendY + 25, obsX - 15, obsY - 60);
        ctx.stroke();

        // Virtual apparent ray (eye projects straight down -> mirage on ground)
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(obsX - 15, obsY - 60);
        ctx.lineTo(240, 195);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inverted Mirage Bush (Reflection on ground)
        ctx.save();
        ctx.translate(240, 195);
        ctx.scale(0.8, -0.6); // inverted
        ctx.globalAlpha = 0.6;
        drawBush(ctx, 0, 0);
        ctx.restore();

        // Water Ripple Illusion Label
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("💧 Ilusi Genangan Air (Bayangan Terbalik)", 260, 225);

        // Air Density Labels
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Udara Dingin (Kerapatan Tinggi, Indeks Bias n₂ Besar)", 40, 130);
        ctx.fillStyle = "#b45309";
        ctx.fillText("Udara Panas Permukaan (Kerapatan Rendah, Indeks Bias n₁ Kecil)", 40, 185);
    }

    function drawBush(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(x, y - 25, 18, 0, Math.PI * 2);
        ctx.arc(x - 12, y - 18, 14, 0, Math.PI * 2);
        ctx.arc(x + 12, y - 18, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#78350f";
        ctx.fillRect(x - 3, y - 8, 6, 8);
    }

    function drawObserver(ctx: CanvasRenderingContext2D, x: number, y: number) {
        // Head & Eyes
        ctx.fillStyle = "#fed7aa";
        ctx.beginPath();
        ctx.arc(x - 15, y - 60, 10, 0, Math.PI * 2);
        ctx.fill();

        // Eye marker
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.arc(x - 19, y - 61, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x - 20, y - 50, 14, 30);

        // Legs
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 16, y - 20);
        ctx.lineTo(x - 18, y);
        ctx.moveTo(x - 10, y - 20);
        ctx.lineTo(x - 8, y);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Pengamat", x - 13, y + 15);
    }

    function drawHypermetropiaScene(ctx: CanvasRenderingContext2D, W: number, H: number, power: number, dist: number) {
        // Dark Lab
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, W, H);

        const eyeX = 460;
        const eyeY = 150;
        const eyeR = 50;

        // Eye Eyeball Cross-section
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Retina (Back of eyeball)
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeR - 2, -0.4 * Math.PI, 0.4 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Retina", eyeX + eyeR + 6, eyeY + 4);

        // Cornea & Eye Lens (Natural lens)
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(eyeX - eyeR + 15, eyeY, 8, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Reading Object (Book at distance dist)
        const bookX = Math.max(50, eyeX - dist * 8);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(bookX - 10, eyeY - 25, 8, 50);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Buku", bookX - 6, eyeY - 32);
        ctx.fillText(`${dist} cm`, bookX - 6, eyeY + 40);

        // Eyeglass Lens in front of eye
        const glassX = eyeX - eyeR - 25;
        if (power > 0) {
            // Convex lens (thicker in middle)
            ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
            ctx.strokeStyle = "#a855f7";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(glassX, eyeY, 6, 32, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#a855f7";
            ctx.fillText(`Kacamata +${power.toFixed(1)} D`, glassX, eyeY - 40);
        }

        // Ray Tracing: From Book to Retina
        // If power = +2 D at 25 cm, focus is exactly at retina (eyeX + eyeR - 2)
        // If power < 2 D, focus falls behind retina (focalX > eyeX + eyeR)
        const focalShift = (2.0 - power) * 22;
        const focalX = (eyeX + eyeR - 2) + focalShift;

        ctx.strokeStyle = isCorrectLens ? "#22c55e" : "#f59e0b";
        ctx.lineWidth = 2;

        // Upper Ray
        ctx.beginPath();
        ctx.moveTo(bookX, eyeY - 15);
        ctx.lineTo(glassX, eyeY - 20);
        ctx.lineTo(eyeX - eyeR + 15, eyeY - 18);
        ctx.lineTo(focalX, eyeY);
        ctx.stroke();

        // Lower Ray
        ctx.beginPath();
        ctx.moveTo(bookX, eyeY + 15);
        ctx.lineTo(glassX, eyeY + 20);
        ctx.lineTo(eyeX - eyeR + 15, eyeY + 18);
        ctx.lineTo(focalX, eyeY);
        ctx.stroke();

        // Focus point dot
        ctx.fillStyle = isCorrectLens ? "#22c55e" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(focalX, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Status text
        ctx.textAlign = "left";
        if (isCorrectLens) {
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("✅ TERFOKUS TEPAT DI RETINA (Penglihatan Jelas!)", 60, 40);
        } else {
            ctx.fillStyle = "#f59e0b";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("⚠️ KABUR: Titik Fokus Jatuh di Belakang Retina!", 60, 40);
        }
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">☀️</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Sifat Cahaya: Fatamorgana & Koreksi Hipermetropi
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 16 (Fatamorgana) & Soal No. 17 (Kacamata Rina +2 Dioptri)
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSimMode('mirage')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            simMode === 'mirage'
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Fatamorgana (Soal 16)
                    </button>
                    <button
                        onClick={() => setSimMode('hypermetropia')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            simMode === 'hypermetropia'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        Hipermetropi (Soal 17)
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex justify-center">
                <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '640px', height: 'auto' }} />
            </div>

            {/* Sliders */}
            <div className="mt-5">
                {simMode === 'mirage' ? (
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="font-semibold text-slate-300">Suhu Permukaan Lapangan Tanah:</span>
                            <span className="font-mono text-orange-400 font-bold">{groundTempC}°C</span>
                        </div>
                        <input
                            type="range"
                            min="35"
                            max="75"
                            step="1"
                            value={groundTempC}
                            onChange={(e) => setGroundTempC(parseInt(e.target.value))}
                            className="w-full accent-orange-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>35°C (Pembiasan Lemah)</span>
                            <span className="text-orange-400 font-bold">55°C (Fatamorgana Jelas)</span>
                            <span>75°C (Ekstrem)</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="font-semibold text-slate-300">Kekuatan Lensa Kacamata (P)</span>
                                <span className="font-mono text-purple-400 font-bold">+{lensPowerD.toFixed(1)} Dioptri</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="4.0"
                                step="0.5"
                                value={lensPowerD}
                                onChange={(e) => setLensPowerD(parseFloat(e.target.value))}
                                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0 D (Tanpa Kacamata)</span>
                                <span className="text-emerald-400 font-bold">+2.0 D (Resep Dokter)</span>
                                <span>+4.0 D</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="font-semibold text-slate-300">Jarak Baca Buku</span>
                                <span className="font-mono text-cyan-400 font-bold">{readDistCm} cm</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="60"
                                step="5"
                                value={readDistCm}
                                onChange={(e) => setReadDistCm(parseInt(e.target.value))}
                                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                {simMode === 'mirage' ? (
                    <>
                        <strong className="block text-violet-300 font-bold text-sm">
                            🎯 Penjelasan Ilmiah Soal No. 16 TKA (Fenomena Fatamorgana):
                        </strong>
                        <p>
                            Matahari memanaskan permukaan lapangan secara intensif. Udara yang bersentuhan langsung dengan tanah menjadi sangat panas dan memuai, sehingga <strong>kerapatan molekul udaranya lebih rendah</strong> dan indeks biasnya lebih kecil (n1 &lt; n2).
                        </p>
                        <p>
                            Sinar cahaya dari langit dan pepohonan merambat dari medium lebih rapat (udara dingin di atas) ke medium kurang rapat (udara panas di bawah).
                            Sesuai <strong>Hukum Snellius</strong>, berkas sinar dibiaskan menjauhi garis normal secara berangsur-angsur hingga melengkung ke atas masuk ke mata pengamat, menciptakan ilusi optik seolah ada riak air di tanah!
                        </p>
                        <p className="text-emerald-300 font-semibold pt-1">
                            👉 Jawaban TKA: Panas permukaan lapangan menyebabkan perbedaan kerapatan udara sehingga cahaya mengalami pembiasan (Opsi D).
                        </p>
                    </>
                ) : (
                    <>
                        <strong className="block text-violet-300 font-bold text-sm">
                            🎯 Penurunan Rumus & Evaluasi Strategi Soal No. 17 TKA (Hipermetropi Rina):
                        </strong>
                        <p>
                            Rina menderita hipermetropi dengan titik dekat PP = 50 cm. Jarak baca normal Sn = 25 cm.
                            Kekuatan lensa kacamata konvergen (cembung) yang dibutuhkan:
                        </p>
                        <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                            P = (100 / Sn) - (100 / PP) = (100 / 25) - (100 / 50) = 4 - 2 = +2 Dioptri
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 font-semibold">
                            <div className="p-2 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800">
                                1. Kacamata +2 Dioptri: <strong>TEPAT</strong>
                            </div>
                            <div className="p-2 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800">
                                2. Membaca jarak &gt; 50 cm: <strong>TEPAT</strong>
                            </div>
                            <div className="p-2 rounded bg-rose-950/40 text-rose-300 border border-rose-800">
                                3. Lensa cekung teman: <strong>TIDAK TEPAT</strong> (Lensa cekung untuk miopi)
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
