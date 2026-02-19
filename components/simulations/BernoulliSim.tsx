"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

const BernoulliSim = () => {
    // A simplified interaction of Continuity + Bernoulli
    // A1*v1 = A2*v2 -> v2 = v1 * (A1/A2)
    // P1 + 1/2 rho v1^2 = P2 + 1/2 rho v2^2 (simplified ignoring height)

    const [area2, setArea2] = useState(0.5); // Area of constriction relative to main pipe (1.0)
    const v1 = 2; // m/s constant input velocity
    const p1 = 100000; // Pa input pressure
    const rho = 1000; // Water

    // Calculations
    const area1 = 2.0; // arbitrary unit
    const realArea2 = Math.max(0.2, area2 * area1); // ensure not zero

    const v2 = v1 * (area1 / realArea2);

    // Bernoulli: P2 = P1 + 0.5*rho*(v1^2 - v2^2)
    const p2 = p1 + 0.5 * rho * (Math.pow(v1, 2) - Math.pow(v2, 2));

    return (
        <Card className="p-6 bg-cosmic-800 border-cosmic-700 text-white mt-8">
            <h3 className="text-xl font-bold mb-4 text-primary">Efek Venturi (Bernoulli)</h3>
            <p className="text-sm text-slate-400 mb-4">
                Lihat bagaimana kecepatan ($v$) meningkat saat luas penampang ($A$) mengecil, yang menyebabkan tekanan ($P$) turun.
            </p>

            {/* Visualization SVG */}
            <div className="w-full h-40 bg-slate-900 rounded-lg mb-6 relative flex items-center justify-center overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 150">
                    <defs>
                        <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>

                    {/* Pipe Shape */}
                    <path
                        d={`
                           M 0 35 L 100 35 Q 150 35 150 ${75 - (realArea2 * 20)} L 250 ${75 - (realArea2 * 20)} Q 250 35 300 35 L 400 35
                           L 400 115 L 300 115 Q 250 115 250 ${75 + (realArea2 * 20)} L 150 ${75 + (realArea2 * 20)} Q 150 115 100 115 L 0 115 Z
                        `}
                        fill="url(#waterFlow)"
                        stroke="#94a3b8"
                        strokeWidth="2"
                    />

                    {/* Flow Particles (CSS Animation handled globally or simplified here) */}
                    <circle cx="50" cy="75" r="3" fill="white">
                        <animate attributeName="cx" from="0" to="400" dur={`${4 / v1}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="85" r="3" fill="white">
                        <animate attributeName="cx" from="0" to="400" dur={`${4 / v1}s`} repeatCount="indefinite" />
                    </circle>

                    {/* Labels */}
                    <text x="50" y="25" fill="#94a3b8" fontSize="12">Area 1</text>
                    <text x="200" y={`${75 - (realArea2 * 20) - 10}`} fill="#94a3b8" fontSize="12" textAnchor="middle">Area 2 (Sempit)</text>
                </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Persempit Pipa (Geser):</label>
                    <input
                        type="range" min="0.2" max="1.0" step="0.05"
                        value={area2} onChange={(e) => setArea2(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>

                <div className="bg-slate-950 p-4 rounded border border-slate-800 grid grid-cols-2 gap-4">
                    <div className='text-center'>
                        <div className="text-xs text-slate-500">Kecepatan ($v_2$)</div>
                        <div className={`text-xl font-bold font-mono ${v2 > v1 ? 'text-green-400' : 'text-white'}`}>
                            {v2.toFixed(2)} m/s
                        </div>
                        <div className="text-[10px] text-slate-600">v1 = {v1} m/s</div>
                    </div>
                    <div className='text-center'>
                        <div className="text-xs text-slate-500">Tekanan ($P_2$)</div>
                        <div className={`text-xl font-bold font-mono ${p2 < p1 ? 'text-red-400' : 'text-white'}`}>
                            {(p2 / 1000).toFixed(1)} kPa
                        </div>
                        <div className="text-[10px] text-slate-600">P1 = {(p1 / 1000)} kPa</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default BernoulliSim;
