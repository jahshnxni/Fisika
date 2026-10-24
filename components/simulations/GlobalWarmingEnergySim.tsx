"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function GlobalWarmingEnergySim() {
    const [year, setYear] = useState<number>(2025);
    const [greenAreaPercent, setGreenAreaPercent] = useState<number>(60); // fell from 100% to 60% (-40%)
    const [emissionLevel, setEmissionLevel] = useState<number>(85); // %
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Temperature formula based on TKA Soal 22 data (2005 = 27.0 C, 2025 = 29.6 C)
    const baseTemp = 27.0 + ((year - 2005) / 20) * 2.6;
    // Microscopic kinetic energy of gas molecules: Ek = 3/2 * k * T
    const tempKelvin = baseTemp + 273.15;
    const avgEkJoule = 1.5 * 1.38e-23 * tempKelvin * 1e21; // in zeptojoules (10^-21 J)

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

        // Sky & Atmosphere
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, "#0f172a");
        skyGrad.addColorStop(0.6, "#1e293b");
        skyGrad.addColorStop(1, "#334155");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // --- LEFT HALF: City & Energy Radiation Diagram ---
        const cityW = 320;

        // Ground / City Surface
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(10, 240, cityW, 55);

        // City Buildings
        ctx.fillStyle = "#475569";
        ctx.fillRect(40, 160, 45, 80);
        ctx.fillRect(95, 130, 55, 110);
        ctx.fillRect(160, 175, 40, 65);

        // Building windows (lit yellow from AC/activity)
        ctx.fillStyle = "#fef08a";
        for (let r = 0; r < 4; r++) {
            ctx.fillRect(105, 145 + r * 18, 12, 10);
            ctx.fillRect(125, 145 + r * 18, 12, 10);
        }

        // Green Area (Parks / Trees)
        const treeCount = Math.round((greenAreaPercent / 100) * 5);
        for (let t = 0; t < treeCount; t++) {
            const tx = 220 + t * 22;
            drawTree(ctx, tx, 240);
        }

        // Solar incoming radiation (Yellow arrows)
        drawArrow(ctx, 60, 30, 90, 110, "#fde047");
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("Radiasi Matahari", 30, 25);

        // Trapped Greenhouse Gas Layer (Orange blanket in atmosphere)
        ctx.fillStyle = "rgba(249, 115, 22, 0.25)";
        ctx.fillRect(10, 70, cityW, 30);
        ctx.strokeStyle = "rgba(249, 115, 22, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(10, 70, cityW, 30);

        ctx.fillStyle = "#fb923c";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Lapisan Gas Rumah Kaca & Emisi Termal AC/Kendaraan", cityW / 2, 88);

        // Reflected infrared rays trapped back to earth (Red wavy ray)
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(110, 240);
        ctx.lineTo(140, 98);
        ctx.lineTo(170, 240);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = "9px sans-serif";
        ctx.fillText("Radiasi Inframerah Terperangkap", 170, 120);

        // --- RIGHT HALF: Actual Data Chart from Soal 22 TKA ---
        const chartX = 360;
        const chartY = 250;
        const chartW = 250;
        const chartH = 180;

        // Chart box
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1;
        ctx.roundRect(chartX - 25, 25, chartW + 35, 255, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("GRAFIK SUHU RERATA KOTA X (2005-2025)", chartX - 10, 48);

        // Chart axes
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chartX, chartY - chartH + 30);
        ctx.lineTo(chartX, chartY);
        ctx.lineTo(chartX + chartW, chartY);
        ctx.stroke();

        // Ticks: 2005, 2010, 2015, 2020, 2025
        const years = [2005, 2010, 2015, 2020, 2025];
        const temps = [27.0, 27.5, 28.1, 28.9, 29.6];

        ctx.fillStyle = "#94a3b8";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        years.forEach((yr, i) => {
            const x = chartX + (i / 4) * (chartW - 20);
            ctx.fillText(yr.toString(), x, chartY + 14);
        });

        // Ticks Y: 26.5 to 30.0 C
        ctx.textAlign = "right";
        for (let t = 27.0; t <= 30.0; t += 1.0) {
            const y = chartY - ((t - 26.5) / 3.5) * (chartH - 40);
            ctx.fillText(`${t.toFixed(1)}°`, chartX - 5, y + 3);
            ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
            ctx.beginPath();
            ctx.moveTo(chartX, y);
            ctx.lineTo(chartX + chartW, y);
            ctx.stroke();
        }

        // Plot Red Trend Line
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        years.forEach((yr, i) => {
            const x = chartX + (i / 4) * (chartW - 20);
            const y = chartY - ((temps[i] - 26.5) / 3.5) * (chartH - 40);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Data points
        years.forEach((yr, i) => {
            const x = chartX + (i / 4) * (chartW - 20);
            const y = chartY - ((temps[i] - 26.5) / 3.5) * (chartH - 40);
            ctx.fillStyle = yr === year ? "#facc15" : "#ef4444";
            ctx.beginPath();
            ctx.arc(x, y, yr === year ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Current status label
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`Tahun ${year}: Suhu = ${baseTemp.toFixed(1)}°C`, chartX - 10, chartY - 140);

        ctx.font = "10px monospace";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(`Energi Kinetik Partikel Udara:`, chartX - 10, chartY - 120);
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 11px monospace";
        ctx.fillText(`E_k = 3/2 k T = ${avgEkJoule.toFixed(2)} × 10⁻²¹ J`, chartX - 10, chartY - 105);
    }, [year, greenAreaPercent, emissionLevel, baseTemp, avgEkJoule]);

    function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = "#78350f";
        ctx.fillRect(x - 3, y - 18, 6, 18);
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(x, y - 24, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
        const headlen = 6;
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
                    <span className="text-xl">🌍</span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                            Simulasi Pemanasan Global, Keseimbangan Radiasi & Tren Suhu
                        </h4>
                        <p className="text-xs text-slate-400">
                            Studi Kasus Soal No. 22 TKA 2025: Tren Suhu Kota X 2005 - 2025
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setYear(2005); setGreenAreaPercent(100); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                    >
                        Tahun 2005 (27,0°C)
                    </button>
                    <button
                        onClick={() => { setYear(2025); setGreenAreaPercent(60); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/30 border border-rose-500 text-rose-300 hover:bg-rose-600/50"
                    >
                        Tahun 2025 (29,6°C)
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
                        <span className="font-semibold text-slate-300">Tahun Pengamatan:</span>
                        <span className="font-mono text-cyan-400 font-bold">{year}</span>
                    </div>
                    <input
                        type="range"
                        min="2005"
                        max="2025"
                        step="5"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>2005 (27,0°C)</span>
                        <span>2015 (28,1°C)</span>
                        <span>2025 (29,6°C)</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-slate-300">Luas Area Hijau Kota (%):</span>
                        <span className="font-mono text-emerald-400 font-bold">{greenAreaPercent}%</span>
                    </div>
                    <input
                        type="range"
                        min="40"
                        max="100"
                        step="10"
                        value={greenAreaPercent}
                        onChange={(e) => setGreenAreaPercent(parseInt(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Penurunan 40% (Tahun 2025)</span>
                        <span>100% (Asri 2005)</span>
                    </div>
                </div>
            </div>

            {/* TKA Multiple Choice Analysis */}
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 space-y-2 leading-relaxed">
                <strong className="block text-violet-300 font-bold text-sm">
                    🎯 Kunci Jawaban Soal No. 22 TKA (Pernyataan Benar Lebih Dari Satu):
                </strong>
                <div className="space-y-1 pl-1">
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Tren kenaikan suhu dapat disebabkan oleh peningkatan energi termal di lingkungan akibat aktivitas manusia.</span>
                    </div>
                    <div className="flex items-start gap-2 text-rose-400">
                        <span>❌</span>
                        <span><strong>SALAH:</strong> Emisi kendaraan dan AC tidak meningkatkan kalor laten untuk mengurangi efek rumah kaca, justru memperkuat perangkap panas.</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Penurunan area hijau menyebabkan berkurangnya pendinginan alami akibat proses transpirasi dan evaporasi.</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Kenaikan suhu jangka panjang menunjukkan ketidakseimbangan antara radiasi yang diserap dan dipancarkan kembali ke angkasa.</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-300">
                        <span>☑️</span>
                        <span><strong>BENAR:</strong> Peningkatan suhu udara berarti peningkatan energi kinetik rata-rata partikel gas ($E_k = \frac{3}{2}kT$).</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
