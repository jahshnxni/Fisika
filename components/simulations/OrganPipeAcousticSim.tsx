"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function OrganPipeAcousticSim() {
    const [airColumnCm, setAirColumnCm] = useState<number>(40); // cm
    const [soundSpeed, setSoundSpeed] = useState<number>(340); // m/s
    const [harmonic, setHarmonic] = useState<number>(1); // 1 = fundamental (nada dasar)
    const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // Physics
    const totalPipeLengthCm = 80; // cm
    const airColumnM = airColumnCm / 100; // 0.4 m
    const waterColumnCm = totalPipeLengthCm - airColumnCm; // 40 cm

    // Closed pipe formula: L = (2n - 1) * lambda / 4 -> f = (2n - 1) * v / (4 * L)
    const harmonicFactor = (2 * harmonic - 1);
    const wavelengthM = (4 * airColumnM) / harmonicFactor;
    const frequencyHz = (soundSpeed) / wavelengthM; // 340 / 1.6 = 212.5 Hz

    // Play tone using Web Audio API
    const toggleTone = () => {
        if (isPlayingSound) {
            oscRef.current?.stop();
            oscRef.current?.disconnect();
            setIsPlayingSound(false);
        } else {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                audioCtxRef.current = ctx;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                oscRef.current = osc;
                setIsPlayingSound(true);
            } catch (e) {
                console.error("Audio API error:", e);
            }
        }
    };

    useEffect(() => {
        if (oscRef.current && audioCtxRef.current) {
            oscRef.current.frequency.setValueAtTime(frequencyHz, audioCtxRef.current.currentTime);
        }
    }, [frequencyHz]);

    useEffect(() => {
        return () => {
            oscRef.current?.stop();
            audioCtxRef.current?.close();
        };
    }, []);

    useEffect(() => {
        let frame: number;
        let time = 0;
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

        const render = () => {
            time += 0.08;
            ctx.clearRect(0, 0, width, height);

            // Lab Room Background
            const bg = ctx.createLinearGradient(0, 0, 0, height);
            bg.addColorStop(0, "#090d16");
            bg.addColorStop(1, "#1e1b4b");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Center of PVC Pipe
            const pipeX = 170;
            const pipeTopY = 35;
            const pipeH = 240; // represents 80 cm (3px per cm)
            const pipeW = 60;

            const pxPerCm = pipeH / totalPipeLengthCm; // 3 px per cm
            const airPixels = airColumnCm * pxPerCm;
            const waterPixels = waterColumnCm * pxPerCm;
            const waterSurfaceY = pipeTopY + airPixels;

            // Outer PVC Pipe
            ctx.fillStyle = "#334155";
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 3;
            ctx.fillRect(pipeX - pipeW / 2, pipeTopY, pipeW, pipeH);
            ctx.strokeRect(pipeX - pipeW / 2, pipeTopY, pipeW, pipeH);

            // Inside Air Column
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(pipeX - pipeW / 2 + 2, pipeTopY, pipeW - 4, airPixels);

            // Inside Water Column (Bottom)
            const waterGrad = ctx.createLinearGradient(0, waterSurfaceY, 0, pipeTopY + pipeH);
            waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.7)");
            waterGrad.addColorStop(1, "rgba(2, 132, 199, 0.9)");
            ctx.fillStyle = waterGrad;
            ctx.fillRect(pipeX - pipeW / 2 + 2, waterSurfaceY, pipeW - 4, waterPixels);

            // Water surface line (Closed end node)
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(pipeX - pipeW / 2 + 2, waterSurfaceY);
            ctx.lineTo(pipeX + pipeW / 2 - 2, waterSurfaceY);
            ctx.stroke();

            // Standing Sound Wave in Air Column
            ctx.strokeStyle = "rgba(244, 63, 94, 0.85)";
            ctx.lineWidth = 2;
            const wavePoints = 40;

            // Envelope 1 & 2
            for (let side = -1; side <= 1; side += 2) {
                ctx.beginPath();
                for (let i = 0; i <= wavePoints; i++) {
                    const yFrac = i / wavePoints;
                    const curY = pipeTopY + yFrac * airPixels;
                    // Standing wave: amplitude is max at open top (yFrac=0), zero at water surface (yFrac=1)
                    const spatialAmp = Math.cos(yFrac * (harmonicFactor * Math.PI / 2));
                    const oscAmp = Math.sin(time * 4);
                    const curX = pipeX + side * spatialAmp * oscAmp * (pipeW / 2 - 6);

                    if (i === 0) ctx.moveTo(curX, curY);
                    else ctx.lineTo(curX, curY);
                }
                ctx.stroke();
            }

            // Striking Mallet at open mouth
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(pipeX - 15, pipeTopY - 20, 30, 10);
            ctx.fillStyle = "#e2e8f0";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Pukulan Alat", pipeX, pipeTopY - 26);

            // Open end: Antinode (Perut Gelombang)
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 10px sans-serif";
            ctx.fillText("PERUT (Antinode)", pipeX, pipeTopY + 14);

            // Water surface: Node (Simpul Gelombang)
            ctx.fillStyle = "#f43f5e";
            ctx.fillText("SIMPUL (Node)", pipeX, waterSurfaceY - 8);

            // Dimension lines
            // Air Column L = 40 cm
            drawDimensionLine(ctx, pipeX + pipeW / 2 + 20, pipeTopY, pipeX + pipeW / 2 + 20, waterSurfaceY, `L = ${airColumnCm} cm`);
            // Water Column = 40 cm
            drawDimensionLine(ctx, pipeX + pipeW / 2 + 20, waterSurfaceY, pipeX + pipeW / 2 + 20, pipeTopY + pipeH, `Air = ${waterColumnCm} cm`);

            // --- HUD Box (Right Side) ---
            const hudX = width - 230;
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.roundRect(hudX - 10, 25, 220, 260, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("PIPA ORGANA TERTUTUP (PVC):", hudX + 5, 45);

            ctx.font = "10px monospace";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(`Panjang Total  = ${totalPipeLengthCm} cm`, hudX + 5, 70);
            ctx.fillText(`Kolom Udara L  = ${airColumnCm} cm (${airColumnM} m)`, hudX + 5, 90);
            ctx.fillText(`Cepat Rambat v = ${soundSpeed} m/s`, hudX + 5, 110);
            ctx.fillText(`Harmonik ke-   = ${harmonic} (Nada Dasar)`, hudX + 5, 130);

            ctx.strokeStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(hudX + 5, 145);
            ctx.lineTo(hudX + 195, 145);
            ctx.stroke();

            ctx.fillStyle = "#a855f7";
            ctx.fillText(`Hubungan L & λ:`, hudX + 5, 165);
            ctx.font = "bold 11px monospace";
            ctx.fillText(`L = ¼ λ  => λ = 4L = ${wavelengthM.toFixed(2)} m`, hudX + 5, 182);

            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(`Frekuensi Nada Dasar (f₀):`, hudX + 5, 210);
            ctx.font = "bold 17px monospace";
            ctx.fillText(`${frequencyHz.toFixed(1)} Hz`, hudX + 5, 235);

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "9px sans-serif";
            ctx.fillText(`f₀ = v / 4L = 340 / (4 × 0.4) = 212.5 Hz`, hudX + 5, 258);

            frame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frame);
    }, [airColumnCm, waterColumnCm, soundSpeed, harmonic, airColumnM, wavelengthM, frequencyHz, harmonicFactor]);

    function drawDimensionLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, label: string) {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1 - 5, y1);
        ctx.lineTo(x1 + 5, y1);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.moveTo(x2 - 5, y2);
        ctx.lineTo(x2 + 5, y2);
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, x1 + 10, (y1 + y2) / 2 + 3);
    }

    return (
        <div className="my-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎶</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Gelombang Bunyi & Pipa Organa Tertutup PVC Air
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 15 TKA 2025: L = 40 cm, v = 340 m/s &rarr; f₀ = 212,5 Hz
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTone}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                            isPlayingSound
                                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                    >
                        <span>{isPlayingSound ? "Matikan Bunyi ⏹" : "Dengarkan Frekuensi 🔊"}</span>
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
                        <span className="font-semibold text-slate-300">Tinggi Kolom Udara (L)</span>
                        <span className="font-mono text-cyan-400 font-bold">{airColumnCm} cm ({airColumnM} m)</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="70"
                        step="5"
                        value={airColumnCm}
                        onChange={(e) => setAirColumnCm(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>10 cm</span>
                        <span className="text-emerald-400 font-bold">40 cm (Soal 15 TKA)</span>
                        <span>70 cm</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Cepat Rambat Bunyi di Udara (v)</span>
                        <span className="font-mono text-amber-400 font-bold">{soundSpeed} m/s</span>
                    </div>
                    <input
                        type="range"
                        min="300"
                        max="360"
                        step="5"
                        value={soundSpeed}
                        onChange={(e) => setSoundSpeed(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                </div>
            </div>

            {/* TKA Solution Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Penurunan Rumus Soal No. 15 TKA (Frekuensi Nada Dasar Pipa PVC):
                </strong>
                <p>
                    Permukaan air berfungsi sebagai ujung tertutup (simpul), sedangkan mulut pipa atas berfungsi sebagai ujung terbuka (perut).
                    Maka pipa ini berlaku sebagai <strong>Pipa Organa Tertutup</strong>.
                </p>
                <p>1. Pada nada dasar (harmonik pertama), terbentuk 1/4 gelombang pada kolom udara:</p>
                <div className="font-mono text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-700">
                    L = (1/4) λ  ⟹  λ = 4L = 4 × 0,4 m = 1,6 meter
                </div>
                <p>2. Frekuensi bunyi yang dihasilkan:</p>
                <div className="font-mono text-emerald-400 bg-slate-900/80 p-2 rounded border border-slate-700 font-bold">
                    f0 = v / λ = 340 m/s / 1,6 m = 212,5 Hz (Jawaban A)
                </div>
            </div>
        </div>
    );
}
