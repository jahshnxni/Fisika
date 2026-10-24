"use client";

import React, { useState } from "react";
import { Info, Play, RefreshCw, Droplets, ArrowUp, ArrowDown } from "lucide-react";

export default function ArchimedesThreeStatesVisualizer() {
    // Mode: 'overview' (shows all 3 side-by-side like user image) or 'interactive' (allows tuning rho_b and rho_f)
    const [viewMode, setViewMode] = useState<"overview" | "interactive">("overview");

    // Interactive custom state
    const [rhoFluid, setRhoFluid] = useState<number>(1000); // kg/m^3 (Air = 1000)
    const [rhoBody, setRhoBody] = useState<number>(600); // kg/m^3 (Kayu = 600)
    const [volumeBody] = useState<number>(0.02); // m^3 (20 Liter)
    const g = 9.8;

    // Calculation for interactive mode
    // Ratio rho_b / rho_f
    const ratio = rhoBody / rhoFluid;
    let stateType: "terapung" | "melayang" | "tenggelam" = "terapung";
    let submergedFraction = 1;
    let normalForce = 0;

    const weight = rhoBody * volumeBody * g; // W = m * g
    let buoyantForce = 0;

    if (rhoBody < rhoFluid) {
        stateType = "terapung";
        submergedFraction = Math.min(1, rhoBody / rhoFluid);
        buoyantForce = weight; // FA = W saat terapung
    } else if (Math.abs(rhoBody - rhoFluid) < 5) {
        stateType = "melayang";
        submergedFraction = 1.0;
        buoyantForce = weight; // FA = W saat melayang
    } else {
        stateType = "tenggelam";
        submergedFraction = 1.0;
        buoyantForce = rhoFluid * volumeBody * g; // FA < W
        normalForce = weight - buoyantForce; // Gaya normal dasar wadah
    }

    return (
        <div className="w-full bg-[#0b0f19] border border-cyan-500/20 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Visualisasi Hukum Archimedes
                        </span>
                        <span className="text-xs text-slate-400">Fluida Statis</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        Tiga Keadaan Benda dalam Fluida: Terapung, Melayang, Tenggelam
                    </h3>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                        onClick={() => setViewMode("overview")}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            viewMode === "overview"
                                ? "bg-cyan-500 text-slate-950 shadow"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Tiga Keadaan (Sesuai Diagram)
                    </button>
                    <button
                        onClick={() => setViewMode("interactive")}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            viewMode === "interactive"
                                ? "bg-cyan-500 text-slate-950 shadow"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Eksperimen Interaktif (Slider)
                    </button>
                </div>
            </div>

            {/* View Mode 1: Exact layout from user's image */}
            {viewMode === "overview" && (
                <div className="space-y-6">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Hukum Archimedes menyatakan bahwa gaya apung (<span className="text-cyan-400 font-bold">F<sub>A</sub></span>) sama dengan berat fluida yang dipindahkan. Posisi benda bergantung penuh pada perbandingan massa jenis benda (<span className="text-amber-400 font-bold">&rho;<sub>b</sub></span>) terhadap massa jenis fluida (<span className="text-cyan-400 font-bold">&rho;<sub>f</sub></span>).
                    </p>

                    {/* Three Containers Side by Side (Identical structure to user's uploaded image) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. TERAPUNG */}
                        <div className="flex flex-col items-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl p-5 border border-cyan-500/30 shadow-lg">
                            {/* Formulas above beaker */}
                            <div className="w-full text-center space-y-1 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 font-mono text-xs">
                                <div className="text-cyan-300 font-bold text-sm">Terapung Sebagian</div>
                                <div className="text-emerald-400 font-semibold">&rho;<sub>b</sub> &lt; &rho;<sub>f</sub></div>
                                <div className="text-purple-300">V<sub>tercelup</sub> &lt; V<sub>b</sub></div>
                                <div className="text-amber-300 font-bold">F<sub>A</sub> = W</div>
                            </div>

                            {/* Beaker SVG */}
                            <div className="relative w-full max-w-[220px] aspect-[4/5] bg-slate-950/40 rounded-2xl border-4 border-slate-500/40 p-2 overflow-hidden flex flex-col justify-end">
                                {/* Water Level */}
                                <div className="relative w-full h-[75%] bg-gradient-to-b from-cyan-400/30 to-blue-600/40 border-t-2 border-dashed border-cyan-300">
                                    {/* Water dashed line label */}
                                    <span className="absolute -top-3.5 right-1 text-[10px] text-cyan-300 font-mono">
                                        Permukaan Air
                                    </span>

                                    {/* Floating Block */}
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 -top-12 w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl border-2 border-amber-400 shadow-md flex flex-col items-center justify-center text-white"
                                        style={{ top: "-30px" }}
                                    >
                                        <span className="text-xs font-bold font-mono">Balok</span>
                                        <span className="text-[10px] text-amber-200">&rho;<sub>b</sub> &lt; &rho;<sub>f</sub></span>

                                        {/* Vector Arrows: FA up, W down */}
                                        <div className="absolute -top-7 flex flex-col items-center">
                                            <span className="text-[10px] text-cyan-400 font-bold">F<sub>A</sub></span>
                                            <div className="w-0.5 h-4 bg-cyan-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-cyan-400 rotate-180" />
                                        </div>
                                        <div className="absolute -bottom-7 flex flex-col items-center">
                                            <div className="w-0.5 h-4 bg-amber-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-amber-400" />
                                            <span className="text-[10px] text-amber-400 font-bold">W</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title Label below beaker */}
                            <h4 className="text-xl font-bold text-white mt-4 tracking-wide">
                                Terapung
                            </h4>
                            <p className="text-xs text-slate-400 text-center mt-1">
                                Bagian yang tercelup hanya sebagian sampai gaya apung mengimbangi seluruh berat benda.
                            </p>
                        </div>

                        {/* 2. MELAYANG */}
                        <div className="flex flex-col items-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl p-5 border border-purple-500/30 shadow-lg">
                            {/* Formulas above beaker */}
                            <div className="w-full text-center space-y-1 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 font-mono text-xs">
                                <div className="text-purple-300 font-bold text-sm">Melayang Sempurna</div>
                                <div className="text-emerald-400 font-semibold">&rho;<sub>b</sub> = &rho;<sub>f</sub></div>
                                <div className="text-purple-300">V<sub>tercelup</sub> = V<sub>b</sub></div>
                                <div className="text-amber-300 font-bold">F<sub>A</sub> = W</div>
                            </div>

                            {/* Beaker SVG */}
                            <div className="relative w-full max-w-[220px] aspect-[4/5] bg-slate-950/40 rounded-2xl border-4 border-slate-500/40 p-2 overflow-hidden flex flex-col justify-end">
                                {/* Water Level */}
                                <div className="relative w-full h-[75%] bg-gradient-to-b from-cyan-400/30 to-blue-600/40 border-t-2 border-dashed border-cyan-300">
                                    <span className="absolute -top-3.5 right-1 text-[10px] text-cyan-300 font-mono">
                                        Permukaan Air
                                    </span>

                                    {/* Suspended Block in the Middle */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl border-2 border-amber-400 shadow-md flex flex-col items-center justify-center text-white">
                                        <span className="text-xs font-bold font-mono">Balok</span>
                                        <span className="text-[10px] text-amber-200">&rho;<sub>b</sub> = &rho;<sub>f</sub></span>

                                        {/* Vector Arrows: FA up, W down */}
                                        <div className="absolute -top-7 flex flex-col items-center">
                                            <span className="text-[10px] text-cyan-400 font-bold">F<sub>A</sub></span>
                                            <div className="w-0.5 h-4 bg-cyan-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-cyan-400 rotate-180" />
                                        </div>
                                        <div className="absolute -bottom-7 flex flex-col items-center">
                                            <div className="w-0.5 h-4 bg-amber-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-amber-400" />
                                            <span className="text-[10px] text-amber-400 font-bold">W</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title Label below beaker */}
                            <h4 className="text-xl font-bold text-white mt-4 tracking-wide">
                                Melayang
                            </h4>
                            <p className="text-xs text-slate-400 text-center mt-1">
                                Benda melayang di sembarang kedalaman fluida karena massa jenis benda sama persis dengan fluida.
                            </p>
                        </div>

                        {/* 3. TENGGELAM */}
                        <div className="flex flex-col items-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl p-5 border border-rose-500/30 shadow-lg">
                            {/* Formulas above beaker */}
                            <div className="w-full text-center space-y-1 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 font-mono text-xs">
                                <div className="text-rose-300 font-bold text-sm">Tenggelam di Dasar</div>
                                <div className="text-emerald-400 font-semibold">&rho;<sub>b</sub> &gt; &rho;<sub>f</sub></div>
                                <div className="text-purple-300">V<sub>tercelup</sub> = V<sub>b</sub></div>
                                <div className="text-rose-300 font-bold">F<sub>A</sub> &lt; W &nbsp;(ada gaya N)</div>
                            </div>

                            {/* Beaker SVG */}
                            <div className="relative w-full max-w-[220px] aspect-[4/5] bg-slate-950/40 rounded-2xl border-4 border-slate-500/40 p-2 overflow-hidden flex flex-col justify-end">
                                {/* Water Level */}
                                <div className="relative w-full h-[75%] bg-gradient-to-b from-cyan-400/30 to-blue-600/40 border-t-2 border-dashed border-cyan-300">
                                    <span className="absolute -top-3.5 right-1 text-[10px] text-cyan-300 font-mono">
                                        Permukaan Air
                                    </span>

                                    {/* Sunken Block at Bottom */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-20 h-20 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl border-2 border-amber-400 shadow-md flex flex-col items-center justify-center text-white">
                                        <span className="text-xs font-bold font-mono">Balok</span>
                                        <span className="text-[10px] text-amber-200">&rho;<sub>b</sub> &gt; &rho;<sub>f</sub></span>

                                        {/* Vector Arrows: FA up + N up vs W down */}
                                        <div className="absolute -top-9 flex flex-col items-center">
                                            <span className="text-[9px] text-cyan-400 font-bold">F<sub>A</sub> + N</span>
                                            <div className="w-0.5 h-4 bg-cyan-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-cyan-400 rotate-180" />
                                        </div>
                                        <div className="absolute -bottom-7 flex flex-col items-center">
                                            <div className="w-0.5 h-5 bg-rose-400" />
                                            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-rose-400" />
                                            <span className="text-[10px] text-rose-400 font-bold">W</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title Label below beaker */}
                            <h4 className="text-xl font-bold text-white mt-4 tracking-wide">
                                Tenggelam
                            </h4>
                            <p className="text-xs text-slate-400 text-center mt-1">
                                Gaya apung maksimum tidak cukup menahan berat benda, sehingga benda jatuh sampai menyentuh dasar wadah.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode 2: Interactive Sandbox */}
            {viewMode === "interactive" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-5 bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                        <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-cyan-400" /> Parameter Benda & Fluida
                        </h4>

                        {/* Presets */}
                        <div>
                            <label className="text-xs text-slate-400 block mb-2">Preset Material Benda:</label>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    onClick={() => setRhoBody(600)}
                                    className={`p-2 rounded-lg border text-left transition-all ${
                                        rhoBody === 600
                                            ? "bg-amber-500/20 border-amber-400 text-amber-200"
                                            : "bg-slate-800 border-white/5 text-slate-300"
                                    }`}
                                >
                                    🪵 Kayu (600 kg/m&sup3;)
                                </button>
                                <button
                                    onClick={() => setRhoBody(920)}
                                    className={`p-2 rounded-lg border text-left transition-all ${
                                        rhoBody === 920
                                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                                            : "bg-slate-800 border-white/5 text-slate-300"
                                    }`}
                                >
                                    🧊 Es (920 kg/m&sup3;)
                                </button>
                                <button
                                    onClick={() => setRhoBody(1000)}
                                    className={`p-2 rounded-lg border text-left transition-all ${
                                        rhoBody === 1000
                                            ? "bg-purple-500/20 border-purple-400 text-purple-200"
                                            : "bg-slate-800 border-white/5 text-slate-300"
                                    }`}
                                >
                                    🧪 Plastik (1000 kg/m&sup3;)
                                </button>
                                <button
                                    onClick={() => setRhoBody(2700)}
                                    className={`p-2 rounded-lg border text-left transition-all ${
                                        rhoBody === 2700
                                            ? "bg-rose-500/20 border-rose-400 text-rose-200"
                                            : "bg-slate-800 border-white/5 text-slate-300"
                                    }`}
                                >
                                    ⚙️ Aluminium (2700 kg/m&sup3;)
                                </button>
                            </div>
                        </div>

                        {/* Slider Massa Jenis Benda */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-amber-300 font-mono font-bold">&rho;<sub>b</sub> (Massa Jenis Benda):</span>
                                <span className="font-mono text-white font-bold">{rhoBody} kg/m&sup3;</span>
                            </div>
                            <input
                                type="range"
                                min={200}
                                max={3000}
                                step={50}
                                value={rhoBody}
                                onChange={(e) => setRhoBody(Number(e.target.value))}
                                className="w-full accent-amber-400"
                            />
                        </div>

                        {/* Slider Massa Jenis Fluida */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-cyan-300 font-mono font-bold">&rho;<sub>f</sub> (Massa Jenis Fluida):</span>
                                <span className="font-mono text-white font-bold">{rhoFluid} kg/m&sup3;</span>
                            </div>
                            <input
                                type="range"
                                min={600}
                                max={1500}
                                step={25}
                                value={rhoFluid}
                                onChange={(e) => setRhoFluid(Number(e.target.value))}
                                className="w-full accent-cyan-400"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Minyak (800)</span>
                                <span>Air Murni (1000)</span>
                                <span>Madu (1420)</span>
                            </div>
                        </div>

                        {/* Live Physics Telemetry */}
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10 space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rasio Massa Jenis:</span>
                                <span className="text-emerald-400 font-bold">{(rhoBody / rhoFluid).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Volume Tercelup:</span>
                                <span className="text-cyan-300 font-bold">{(submergedFraction * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Gaya Berat (W):</span>
                                <span className="text-amber-400 font-bold">{weight.toFixed(1)} N</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Gaya Apung (F<sub>A</sub>):</span>
                                <span className="text-cyan-400 font-bold">{buoyantForce.toFixed(1)} N</span>
                            </div>
                            {normalForce > 0 && (
                                <div className="flex justify-between text-rose-400">
                                    <span>Gaya Normal Dasar (N):</span>
                                    <span className="font-bold">{normalForce.toFixed(1)} N</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Animated Tank */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        <div className="relative w-full max-w-[340px] aspect-[4/5] bg-slate-950/60 rounded-3xl border-4 border-slate-600/50 p-3 overflow-hidden flex flex-col justify-end shadow-2xl">
                            {/* Water Fluid */}
                            <div className="relative w-full h-[75%] bg-gradient-to-b from-cyan-500/35 to-blue-700/50 border-t-2 border-dashed border-cyan-300 transition-all duration-300">
                                <span className="absolute -top-3.5 right-2 text-[10px] text-cyan-300 font-mono">
                                    Fluida: {rhoFluid} kg/m&sup3;
                                </span>

                                {/* Dynamic Block with calculated vertical position */}
                                {(() => {
                                    let topPos = 0;
                                    if (stateType === "terapung") {
                                        // Block height is 80px. If 60% submerged, top 40% (32px) sticks out above surface
                                        topPos = -(80 * (1 - submergedFraction));
                                    } else if (stateType === "melayang") {
                                        topPos = 80; // Centered inside water
                                    } else {
                                        topPos = 180; // At the bottom
                                    }

                                    return (
                                        <div
                                            className="absolute left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-white transition-all duration-700 ease-out"
                                            style={{ top: `${topPos}px` }}
                                        >
                                            <span className="text-xs font-bold font-mono">Benda</span>
                                            <span className="text-[10px] text-amber-200">{rhoBody} kg/m&sup3;</span>

                                            {/* Submerged line indicator inside the block */}
                                            {stateType === "terapung" && (
                                                <div
                                                    className="absolute w-full border-t border-cyan-400 border-dashed"
                                                    style={{ top: `${80 * (1 - submergedFraction)}px` }}
                                                />
                                            )}

                                            {/* Vector FA (Blue) */}
                                            <div className="absolute -top-8 flex flex-col items-center">
                                                <span className="text-[10px] text-cyan-400 font-bold">F<sub>A</sub></span>
                                                <div className="w-0.5 h-4 bg-cyan-400" />
                                                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-cyan-400 rotate-180" />
                                            </div>

                                            {/* Vector W (Amber) */}
                                            <div className="absolute -bottom-8 flex flex-col items-center">
                                                <div className="w-0.5 h-4 bg-amber-400" />
                                                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-amber-400" />
                                                <span className="text-[10px] text-amber-400 font-bold">W</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Badge Status */}
                        <div className="mt-4 flex items-center gap-3">
                            <span
                                className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border shadow-lg ${
                                    stateType === "terapung"
                                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                                        : stateType === "melayang"
                                        ? "bg-purple-500/20 text-purple-300 border-purple-400"
                                        : "bg-rose-500/20 text-rose-300 border-rose-400"
                                }`}
                            >
                                Status: {stateType.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
