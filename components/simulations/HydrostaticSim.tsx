"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';

const HydrostaticSim = () => {
    const [depth, setDepth] = useState(5); // meters
    const [density, setDensity] = useState(1000); // kg/m^3
    const gravity = 9.8;
    const maxDepth = 10;

    // Calculate Pressure (Pascal)
    const pressure = Math.round(density * gravity * depth);
    const pressureAtm = 101325;
    const totalPressure = pressure + pressureAtm;

    // Visual logic
    const waterHeightPercent = 80; // Fixed container fill
    const pointY = (depth / maxDepth) * 100; // Position of measurement point relative to water surface

    return (
        <Card className="p-6 bg-cosmic-800 border-cosmic-700 text-white">
            <h3 className="text-xl font-bold mb-4 text-accent">Laboratorium Tekanan Hidrostatis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Container */}
                <div className="relative h-64 bg-gray-900 border-2 border-slate-600 rounded-lg overflow-hidden">
                    {/* Sky */}
                    <div className="absolute top-0 w-full h-[20%] bg-sky-900/30 flex items-center justify-center">
                        <span className="text-xs text-slate-400">Atmosphere ($P_atm$)</span>
                    </div>

                    {/* Water */}
                    <div
                        className="absolute bottom-0 w-full bg-blue-500/50 transition-colors duration-500"
                        style={{
                            height: `${waterHeightPercent}%`,
                            backgroundColor: density > 1000 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(6, 182, 212, 0.4)'
                        }}
                    >
                        {/* Measurement Point */}
                        <div
                            className="absolute w-full border-t-2 border-dashed border-red-500 flex items-center"
                            style={{ top: `${pointY}%` }}
                        >
                            <div className="w-4 h-4 rounded-full bg-red-500 absolute left-1/2 -ml-2 animate-pulse shadow-[0_0_10px_red]"></div>
                            <span className="ml-2 text-xs bg-black/50 px-1 rounded text-red-300">
                                h = {depth}m
                            </span>
                        </div>
                    </div>
                </div>

                {/* Controls & Data */}
                <div className="space-y-6">

                    {/* Controls */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Kedalaman ($h$): {depth} m</label>
                            <input
                                type="range" min="0" max="10" step="0.5"
                                value={depth} onChange={(e) => setDepth(Number(e.target.value))}
                                className="w-full accent-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Massa Jenis ($\rho$): {density} kg/$m^3$</label>
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setDensity(800)}
                                    className={`px-2 py-1 text-xs rounded ${density === 800 ? 'bg-primary text-white' : 'bg-slate-700'}`}
                                >Minyak (800)</button>
                                <button
                                    onClick={() => setDensity(1000)}
                                    className={`px-2 py-1 text-xs rounded ${density === 1000 ? 'bg-primary text-white' : 'bg-slate-700'}`}
                                >Air (1000)</button>
                                <button
                                    onClick={() => setDensity(13600)}
                                    className={`px-2 py-1 text-xs rounded ${density === 13600 ? 'bg-primary text-white' : 'bg-slate-700'}`}
                                >Raksa (13600)</button>
                            </div>
                            <input
                                type="range" min="800" max="13600" step="100"
                                value={density} onChange={(e) => setDensity(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>
                    </div>

                    {/* Real-time Math */}
                    <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm border border-slate-700">
                        <div className="text-slate-400 mb-2">Kalkulasi ($P_h = \rho \cdot g \cdot h$):</div>
                        <div className="flex justify-between items-end border-b border-slate-700 pb-2 mb-2">
                            <span>Hidrostatis:</span>
                            <span className="text-accent text-lg">{pressure.toLocaleString()} Pa</span>
                        </div>
                        <div className="flex justify-between items-end text-slate-500">
                            <span>Total ($P_h + P_atm$):</span>
                            <span>{totalPressure.toLocaleString()} Pa</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default HydrostaticSim;
