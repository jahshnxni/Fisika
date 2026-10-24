"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Sparkles, BookOpen, Layers } from "lucide-react";

interface SolutionStep {
    stepNumber: number;
    title: string;
    description: string;
    formulaLatex: string;
    subNotes: string[];
    diagramType: "inclined-plane" | "archimedes" | "atwood" | "projectile";
    highlightVariables: Record<string, string>;
}

interface ProblemCase {
    id: string;
    title: string;
    topic: string;
    problemStatement: string;
    steps: SolutionStep[];
}

const PROBLEMS: ProblemCase[] = [
    {
        id: "bidang-miring",
        title: "Dinamika Bidang Miring Kasar",
        topic: "Dinamika Gerak & Hukum Newton",
        problemStatement:
            "Sebuah balok bermassa m = 4 kg diletakkan pada bidang miring dengan sudut kemiringan \u03b8 = 37\u00b0 (\u00b1 0.6 untuk sin 37\u00b0 dan 0.8 untuk cos 37\u00b0). Koefisien gesekan statis \u03bc_s = 0.5 dan kinetis \u03bc_k = 0.3. Tentukan apakah balok bergerak, dan jika bergerak hitung percepatannya! (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Analisis Fisika & Sketsa Bidang Miring",
                description:
                    "Identifikasi seluruh parameter fisis yang diketahui dan gambar orientasi bidang miring.",
                formulaLatex: "m = 4\\text{ kg}, \\quad \\theta = 37^\\circ, \\quad \\mu_s = 0.5, \\quad \\mu_k = 0.3, \\quad g = 10\\text{ m/s}^2",
                subNotes: [
                    "Berat total balok: W = m \u00d7 g = 4 \u00d7 10 = 40 N",
                    "Arah gerak potensial: menuruni bidang miring sepanjang sumbu X'",
                ],
                diagramType: "inclined-plane",
                highlightVariables: { "W": "40 N", "\u03b8": "37\u00b0", "m": "4 kg" },
            },
            {
                stepNumber: 2,
                title: "2. Dekomposisi Vektor Gaya Bebas (FBD)",
                description:
                    "Uraikan vektor gaya berat W ke sumbu yang sejajar (X') dan tegak lurus (Y') bidang miring.",
                formulaLatex: "W_\\parallel = W \\sin\\theta = 40 \\times 0.6 = 24\\text{ N} \\\\[6pt] W_\\perp = W \\cos\\theta = 40 \\times 0.8 = 32\\text{ N}",
                subNotes: [
                    "Gaya Normal (N) seimbang dengan komponen tegak lurus: N = W_\u22a5 = 32 N",
                    "Gaya penarik balok ke bawah adalah W_\u2225 = 24 N",
                ],
                diagramType: "inclined-plane",
                highlightVariables: { "W_\u2225": "24 N", "W_\u22a5": "32 N", "N": "32 N" },
            },
            {
                stepNumber: 3,
                title: "3. Uji Syarat Gerak (Gaya Gesek Statis Maksimum)",
                description:
                    "Bandingkan gaya penarik sejajar bidang (W_\u2225) dengan gaya gesek statis maksimum (f_s,max).",
                formulaLatex: "f_{s,\\max} = \\mu_s \\times N = 0.5 \\times 32\\text{ N} = 16\\text{ N} \\\\[6pt] W_\\parallel (24\\text{ N}) > f_{s,\\max} (16\\text{ N}) \\implies \\text{BALOK BERGERAK MELUNCUR}",
                subNotes: [
                    "Karena W_\u2225 melebihi batas statis maksimum, balok pasti meluncur ke bawah.",
                    "Saat bergerak, gaya gesek yang bekerja berganti menjadi gaya gesek kinetis (f_k).",
                ],
                diagramType: "inclined-plane",
                highlightVariables: { "f_s,max": "16 N", "Status": "Meluncur" },
            },
            {
                stepNumber: 4,
                title: "4. Perhitungan Percepatan dengan Hukum II Newton",
                description:
                    "Terapkan \u03a3F_x = m \u00d7 a sepanjang bidang miring dengan gaya gesek kinetis f_k.",
                formulaLatex: "f_k = \\mu_k \\times N = 0.3 \\times 32\\text{ N} = 9.6\\text{ N} \\\\[6pt] a = \\frac{W_\\parallel - f_k}{m} = \\frac{24 - 9.6}{4} = \\frac{14.4}{4} = \\mathbf{3.6\\text{ m/s}^2}",
                subNotes: [
                    "Resultan gaya: \u03a3F = 24 N - 9.6 N = 14.4 N ke arah bawah bidang miring",
                    "Percepatan balok: a = 3.6 m/s\u00b2 menuruni bidang miring",
                ],
                diagramType: "inclined-plane",
                highlightVariables: { "f_k": "9.6 N", "\u03a3F": "14.4 N", "a": "3.6 m/s\u00b2" },
            },
        ],
    },
    {
        id: "archimedes",
        title: "Hukum Archimedes & Fraksi Terapung",
        topic: "Fluida Statis & Gaya Apung",
        problemStatement:
            "Sebuah balok kayu bermassa jenis \u03c1_b = 750 kg/m\u00b3 dengan volume V_b = 0.04 m\u00b3 dimasukkan ke dalam air bermassa jenis \u03c1_f = 1000 kg/m\u00b3. Berapakah volume kayu yang berada di bawah permukaan air (V_celup) dan berapa gaya apung yang dialaminya? (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Perbandingan Massa Jenis Benda & Fluida",
                description:
                    "Periksa apakah benda terapung, melayang, atau tenggelam dengan membandingkan \u03c1_b dan \u03c1_f.",
                formulaLatex: "\\rho_b = 750\\text{ kg/m}^3 < \\rho_f = 1000\\text{ kg/m}^3 \\implies \\text{TERAPUNG SEBAGIAN}",
                subNotes: [
                    "Karena \u03c1_b < \u03c1_f, balok akan berada dalam keadaan terapung seimbang.",
                    "Pada keadaan terapung seimbang, gaya apung sama persis dengan berat benda: F_A = W.",
                ],
                diagramType: "archimedes",
                highlightVariables: { "\u03c1_b": "750 kg/m\u00b3", "\u03c1_f": "1000 kg/m\u00b3", "Status": "Terapung" },
            },
            {
                stepNumber: 2,
                title: "2. Menentukan Fraksi Volume Tercelup",
                description:
                    "Gunakan prinsip kesetimbangan gaya F_A = W untuk menentukan perbandingan volume.",
                formulaLatex: "F_A = W \\implies \\rho_f \\, g \\, V_{\\text{celup}} = \\rho_b \\, g \\, V_b \\\\[6pt] \\frac{V_{\\text{celup}}}{V_b} = \\frac{\\rho_b}{\\rho_f} = \\frac{750}{1000} = 0.75 = 75\\%",
                subNotes: [
                    "Tepat 75% dari volume balok kayu berada di bawah permukaan air.",
                    "Sisanya 25% volume berada di atas permukaan air.",
                ],
                diagramType: "archimedes",
                highlightVariables: { "Fraksi": "75%", "V_muncul": "25%" },
            },
            {
                stepNumber: 3,
                title: "3. Perhitungan Volume Tercelup & Gaya Apung Akhir",
                description:
                    "Substitusikan nilai volume total V_b = 0.04 m\u00b3 untuk mendapatkan hasil fisis kuantitatif.",
                formulaLatex: "V_{\\text{celup}} = 0.75 \\times 0.04\\text{ m}^3 = \\mathbf{0.03\\text{ m}^3} \\\\[6pt] F_A = \\rho_f \\, g \\, V_{\\text{celup}} = 1000 \\times 10 \\times 0.03 = \\mathbf{300\\text{ N}}",
                subNotes: [
                    "Berat balok W = \u03c1_b \u00d7 V_b \u00d7 g = 750 \u00d7 0.04 \u00d7 10 = 300 N",
                    "Terbukti F_A = W = 300 N (Hukum Kesetimbangan Archimedes)",
                ],
                diagramType: "archimedes",
                highlightVariables: { "V_celup": "0.03 m\u00b3", "F_A": "300 N", "W": "300 N" },
            },
        ],
    },
    {
        id: "katrol",
        title: "Mesin Katrol Atwood Dinamika",
        topic: "Dinamika Gerak Translasi & Rotasi",
        problemStatement:
            "Dua buah benda m_1 = 6 kg dan m_2 = 4 kg dihubungkan tali tak bermassa melalui katrol licin tak bermassa. Tentukan percepatan sistem dan besar tegangan tali T saat sistem dilepas! (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Analisis Sistem & Arah Gerak",
                description:
                    "Bandingkan kedua massa untuk menentukan arah resultan gerak beban.",
                formulaLatex: "m_1 = 6\\text{ kg} > m_2 = 4\\text{ kg} \\implies m_1 \\text{ turun, } m_2 \\text{ naik}",
                subNotes: [
                    "Berat beban 1: W_1 = m_1 \u00d7 g = 6 \u00d7 10 = 60 N",
                    "Berat beban 2: W_2 = m_2 \u00d7 g = 4 \u00d7 10 = 40 N",
                ],
                diagramType: "atwood",
                highlightVariables: { "m_1": "6 kg", "m_2": "4 kg", "W_1": "60 N", "W_2": "40 N" },
            },
            {
                stepNumber: 2,
                title: "2. Penurunan Rumus Percepatan Sistem",
                description:
                    "Terapkan Hukum II Newton untuk keseluruhan sistem tali: \u03a3F_net = (m_1 + m_2) \u00d7 a.",
                formulaLatex: "a = \\frac{W_1 - W_2}{m_1 + m_2} = \\frac{(m_1 - m_2) g}{m_1 + m_2} = \\frac{(6 - 4) \\times 10}{6 + 4} = \\frac{20}{10} = \\mathbf{2\\text{ m/s}^2}",
                subNotes: [
                    "Percepatan kedua benda sama besar: a = 2 m/s\u00b2",
                    "m_1 bergerak turun dengan percepatan 2 m/s\u00b2, m_2 bergerak naik dengan 2 m/s\u00b2",
                ],
                diagramType: "atwood",
                highlightVariables: { "a": "2 m/s\u00b2" },
            },
            {
                stepNumber: 3,
                title: "3. Perhitungan Tegangan Tali (T)",
                description:
                    "Tinjau Free Body Diagram untuk benda m_1 yang bergerak turun: W_1 - T = m_1 \u00d7 a.",
                formulaLatex: "T = W_1 - m_1 a = 60 - (6 \\times 2) = 60 - 12 = \\mathbf{48\\text{ N}} \\\\[6pt] \\text{Verifikasi pada } m_2: \\quad T - W_2 = m_2 a \\implies T = 40 + (4 \\times 2) = \\mathbf{48\\text{ N}} \\; (\\checkmark)",
                subNotes: [
                    "Kedua peninjauan menghasilkan nilai tegangan tali yang identik yaitu T = 48 N.",
                    "Tegangan tali berada di antara W_2 (40 N) dan W_1 (60 N), memenuhi prinsip dinamika.",
                ],
                diagramType: "atwood",
                highlightVariables: { "T": "48 N" },
            },
        ],
    },
];

export default function ManimSolutionViewer() {
    const [selectedProblemId, setSelectedProblemId] = useState<string>("bidang-miring");
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const problem = PROBLEMS.find((p) => p.id === selectedProblemId) || PROBLEMS[0];
    const step = problem.steps[currentStepIndex] || problem.steps[0];

    // Handle problem change
    const handleSelectProblem = (id: string) => {
        setSelectedProblemId(id);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    };

    // Auto Playback logic
    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        const intervalMs = 4000 / playbackSpeed;
        timerRef.current = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev < problem.steps.length - 1) {
                    return prev + 1;
                } else {
                    setIsPlaying(false);
                    return prev;
                }
            });
        }, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, playbackSpeed, problem.steps.length]);

    // Manim Style Canvas Animation Renderer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Manim Signature Dark Aesthetic Background (#0c0d14)
        ctx.fillStyle = "#0c0d14";
        ctx.fillRect(0, 0, width, height);

        // Glowing Coordinate Grid (3b1b style)
        ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw Manim Watermark / Math Canvas Header
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "italic 11px ui-monospace, SFMono-Regular, Cambria Math, serif";
        ctx.fillText("ANIMATED MATHEMATICAL PROOF  \u2022  MANIM ENGINE", 20, 24);

        // Arrow helper function with 3b1b glow
        const drawManimVector = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            color: string,
            label: string,
            glow = true
        ) => {
            const headlen = 10;
            const angle = Math.atan2(y2 - y1, x2 - x1);

            ctx.save();
            if (glow) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
            }

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(
                x2 - headlen * Math.cos(angle - Math.PI / 6),
                y2 - headlen * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                x2 - headlen * Math.cos(angle + Math.PI / 6),
                y2 - headlen * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Label
            ctx.fillStyle = color;
            ctx.font = "bold 13px ui-monospace, Cambria Math, serif";
            ctx.fillText(label, x2 + 8, y2 + 4);
        };

        // Render Geometry based on step.diagramType
        if (step.diagramType === "inclined-plane") {
            const originX = 70;
            const originY = height - 60;
            const rampW = width - 180;
            const thetaRad = (37 * Math.PI) / 180;
            const rampH = rampW * Math.tan(thetaRad) * 0.55;

            // Wedge
            ctx.strokeStyle = "#38bdf8";
            ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(originX + rampW, originY);
            ctx.lineTo(originX, originY - rampH);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Angle arc
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(originX + rampW, originY, 40, Math.PI, Math.PI + thetaRad * 0.7);
            ctx.stroke();
            ctx.fillStyle = "#facc15";
            ctx.font = "bold 12px serif";
            ctx.fillText("\u03b8 = 37\u00b0", originX + rampW - 75, originY - 12);

            // Block
            const blockDist = rampW * 0.45;
            const bx = originX + blockDist * Math.cos(thetaRad);
            const by = originY - rampH + blockDist * Math.sin(thetaRad);

            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(thetaRad * 0.55);

            ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
            ctx.strokeStyle = "#fef08a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-25, -25, 50, 50, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#1e1b4b";
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "center";
            ctx.fillText("m", 0, 4);

            // Vectors according to currentStepIndex
            if (currentStepIndex >= 1) {
                // Normal Force
                drawManimVector(0, 0, 0, -65, "#38bdf8", "N = 32 N");
                // W_perp
                drawManimVector(0, 0, 0, 65, "#c084fc", "W\u22a5 = 32 N");
                // W_parallel
                drawManimVector(0, 0, 65, 0, "#fb923c", "W\u2225 = 24 N");
            }

            if (currentStepIndex >= 2) {
                // Friction
                const fVal = currentStepIndex >= 3 ? "f_k = 9.6 N" : "f_s,max = 16 N";
                drawManimVector(0, 0, -45, 0, "#facc15", fVal);
            }

            ctx.restore();

            // Total Weight W (Global frame)
            if (currentStepIndex >= 0) {
                drawManimVector(bx, by, bx, by + 75, "#ef4444", "W = mg = 40 N");
            }
        } else if (step.diagramType === "archimedes") {
            const centerX = width / 2;
            const tankY = height - 50;
            const tankW = 220;
            const tankH = 170;

            // Glass tank
            ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.strokeRect(centerX - tankW / 2, tankY - tankH, tankW, tankH);

            // Water
            const waterLevel = tankY - tankH * 0.7;
            ctx.fillStyle = "rgba(14, 165, 233, 0.25)";
            ctx.fillRect(centerX - tankW / 2 + 3, waterLevel, tankW - 6, tankY - waterLevel - 3);

            // Dashed surface line
            ctx.strokeStyle = "#38bdf8";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(centerX - tankW / 2, waterLevel);
            ctx.lineTo(centerX + tankW / 2, waterLevel);
            ctx.stroke();
            ctx.setLineDash([]);

            // Floating Wood Block (75% submerged)
            const blockW = 80;
            const blockH = 80;
            const submergedH = blockH * 0.75;
            const blockTop = waterLevel - (blockH - submergedH);

            ctx.fillStyle = "rgba(217, 119, 6, 0.9)";
            ctx.strokeStyle = "#fde68a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(centerX - blockW / 2, blockTop, blockW, blockH, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.fillText("Kayu", centerX, blockTop + blockH / 2);

            // Vectors
            drawManimVector(centerX, blockTop + blockH / 2, centerX, blockTop - 45, "#38bdf8", "F_A = 300 N");
            drawManimVector(centerX, blockTop + blockH / 2, centerX, blockTop + blockH + 45, "#ef4444", "W = 300 N");
        } else if (step.diagramType === "atwood") {
            const centerX = width / 2;
            const topY = 60;
            const r = 35;

            // Pulley
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, topY + r, r, 0, Math.PI * 2);
            ctx.stroke();

            // Strings
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(centerX - r, topY + r);
            ctx.lineTo(centerX - r, topY + 140);
            ctx.moveTo(centerX + r, topY + r);
            ctx.lineTo(centerX + r, topY + 90);
            ctx.stroke();

            // Mass 1 (Heavier, lower)
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(centerX - r - 20, topY + 140, 40, 40);
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.fillText("6 kg", centerX - r, topY + 165);

            // Mass 2 (Lighter, higher)
            ctx.fillStyle = "#fb923c";
            ctx.fillRect(centerX + r - 18, topY + 90, 36, 36);
            ctx.fillStyle = "#0f172a";
            ctx.fillText("4 kg", centerX + r, topY + 112);

            // Tension vectors
            drawManimVector(centerX - r, topY + 140, centerX - r, topY + 105, "#22d3ee", "T = 48 N");
            drawManimVector(centerX - r, topY + 180, centerX - r, topY + 225, "#ef4444", "W_1 = 60 N");

            drawManimVector(centerX + r, topY + 90, centerX + r, topY + 55, "#22d3ee", "T = 48 N");
            drawManimVector(centerX + r, topY + 126, centerX + r, topY + 165, "#f97316", "W_2 = 40 N");
        }
    }, [step, currentStepIndex]);

    return (
        <div className="w-full bg-[#080a12] border border-cyan-500/30 rounded-2xl p-4 md:p-6 text-slate-100 shadow-2xl space-y-6 my-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Manim Animated Solver
                        </span>
                        <span className="text-xs text-slate-400">Pembahasan Soal Berbasis Visual &amp; MathJax</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        {problem.title}
                    </h3>
                </div>

                {/* Problem Selector Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">Pilih Kasus:</span>
                    <select
                        value={selectedProblemId}
                        onChange={(e) => handleSelectProblem(e.target.value)}
                        className="bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                        {PROBLEMS.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Problem Statement Box */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" /> Soal Fisika Standar TKA:
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {problem.problemStatement}
                </p>
            </div>

            {/* Main Interactive Stage: Canvas + Formula Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Visual Geometry Canvas (Manim Style) */}
                <div className="lg:col-span-7 relative aspect-[16/10] bg-[#0c0d14] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl flex flex-col justify-end">
                    <canvas ref={canvasRef} className="w-full h-full block" />

                    {/* Step Title Pill in Canvas */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-cyan-300">
                        {step.title}
                    </div>

                    {/* Highlighted Variables Pill */}
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 max-w-[200px] justify-end">
                        {Object.entries(step.highlightVariables).map(([k, v]) => (
                            <span
                                key={k}
                                className="px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-200"
                            >
                                {k}: <strong className="text-yellow-300">{v}</strong>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Step Explanation & Math Typography Panel */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/80 rounded-2xl border border-white/5 p-5 space-y-4">
                    <div className="space-y-4">
                        {/* Step indicator */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono">
                                Langkah {step.stepNumber} dari {problem.steps.length}
                            </span>
                            <span className="text-slate-500 font-mono">
                                Speed: {playbackSpeed}x
                            </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h4 className="text-base font-bold text-white mb-1.5">
                                {step.title}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* LaTeX Math Formula Card (Styled MathJax / Computer Modern aesthetic) */}
                        <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-xl p-4 shadow-inner text-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">
                                Persamaan Fisika &amp; Penurunan:
                            </div>
                            <div className="font-mono text-sm md:text-base text-yellow-300 font-semibold tracking-wide whitespace-pre-wrap leading-loose">
                                {step.formulaLatex}
                            </div>
                        </div>

                        {/* Bulleted Sub-Notes */}
                        <div className="space-y-1.5 pt-1">
                            {step.subNotes.map((note, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                    <span>{note}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-2">
                        <button
                            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentStepIndex === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
                        </button>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                                    isPlaying
                                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                                }`}
                            >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                {isPlaying ? "Jeda" : "Auto Play"}
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentStepIndex(0);
                                    setIsPlaying(false);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                                title="Reset Langkah"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            onClick={() =>
                                setCurrentStepIndex((prev) => Math.min(problem.steps.length - 1, prev + 1))
                            }
                            disabled={currentStepIndex === problem.steps.length - 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors"
                        >
                            Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrubber Timeline Bar */}
            <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Linimasa Pembahasan Manim</span>
                    <span>Langkah {currentStepIndex + 1} / {problem.steps.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {problem.steps.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setCurrentStepIndex(idx);
                                setIsPlaying(false);
                            }}
                            className={`h-2 rounded-full transition-all ${
                                idx === currentStepIndex
                                    ? "bg-gradient-to-r from-cyan-400 to-yellow-400 ring-2 ring-cyan-400/50"
                                    : idx < currentStepIndex
                                    ? "bg-cyan-600"
                                    : "bg-slate-800"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
