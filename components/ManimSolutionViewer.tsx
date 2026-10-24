"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Sparkles, BookOpen, Layers } from "lucide-react";

interface SolutionStep {
    stepNumber: number;
    title: string;
    description: string;
    formulaLatex: string;
    subNotes: string[];
    diagramType: "inclined-plane" | "archimedes" | "atwood" | "connected-blocks" | "elevator" | "rotational" | "lorentz";
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
        id: "connected-blocks",
        title: "Dinamika 3 Benda Berangkai Diikat Tali (Soal TKA)",
        topic: "Dinamika Gerak Lurus & Hukum Newton",
        problemStatement:
            "Tiga balok A (m_A = 2 kg), B (m_B = 3 kg), dan C (m_C = 5 kg) dihubungkan tali tak bermassa di atas lantai kasar dengan koefisien gesek \u03bc = 0.2. Balok C ditarik gaya mendatar F = 60 N ke arah kanan. Tentukan percepatan sistem, gaya normal dan gaya gesek masing-masing balok, serta tegangan tali T_AB dan T_BC! (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Gaya Normal & Gaya Gesek Masing-Masing Balok",
                description:
                    "Karena tidak ada gerak vertikal, gaya normal tiap benda mengimbangi gaya beratnya.",
                formulaLatex: "N_A = m_A g = 2 \\times 10 = 20\\text{ N} \\implies f_A = \\mu N_A = 0.2 \\times 20 = 4\\text{ N} \\\\[4pt] N_B = m_B g = 3 \\times 10 = 30\\text{ N} \\implies f_B = \\mu N_B = 0.2 \\times 30 = 6\\text{ N} \\\\[4pt] N_C = m_C g = 5 \\times 10 = 50\\text{ N} \\implies f_C = \\mu N_C = 0.2 \\times 50 = 10\\text{ N} \\\\[4pt] \\Sigma f = f_A + f_B + f_C = 4 + 6 + 10 = 20\\text{ N}",
                subNotes: [
                    "Total massa sistem: m_total = 2 + 3 + 5 = 10 kg",
                    "Total gaya gesekan yang menghambat sistem adalah 20 N ke arah kiri",
                ],
                diagramType: "connected-blocks",
                highlightVariables: { "N_A": "20 N", "N_B": "30 N", "N_C": "50 N", "\u03a3f": "20 N" },
            },
            {
                stepNumber: 2,
                title: "2. Menghitung Percepatan Sistem Bersama (a)",
                description:
                    "Terapkan Hukum II Newton pada sistem keseluruhan: \u03a3F_total = m_total \u00d7 a.",
                formulaLatex: "\\Sigma F = F - \\Sigma f = m_{\\text{total}} \\times a \\\\[6pt] a = \\frac{F - \\Sigma f}{m_A + m_B + m_C} = \\frac{60 - 20}{2 + 3 + 5} = \\frac{40}{10} = \\mathbf{4\\text{ m/s}^2}",
                subNotes: [
                    "Gaya penarik netto: 60 N - 20 N = 40 N",
                    "Ketiga balok bergerak bersama ke kanan dengan percepatan a = 4 m/s\u00b2",
                ],
                diagramType: "connected-blocks",
                highlightVariables: { "F_net": "40 N", "a": "4 m/s\u00b2" },
            },
            {
                stepNumber: 3,
                title: "3. Menentukan Tegangan Tali T_AB",
                description:
                    "Tinjau Free Body Diagram (FBD) balok A: ditarik ke kanan oleh T_AB dan dihambat oleh gesekan f_A.",
                formulaLatex: "\\Sigma F_A = m_A \\times a \\implies T_{AB} - f_A = m_A \\times a \\\\[6pt] T_{AB} = m_A a + f_A = (2 \\times 4) + 4 = 8 + 4 = \\mathbf{12\\text{ N}}",
                subNotes: [
                    "Tali AB hanya bertugas menarik balok A bermassa 2 kg melawan gesekan f_A",
                    "Tegangan tali T_AB terbukti sebesar 12 N",
                ],
                diagramType: "connected-blocks",
                highlightVariables: { "T_AB": "12 N" },
            },
            {
                stepNumber: 4,
                title: "4. Menentukan Tegangan Tali T_BC & Verifikasi",
                description:
                    "Tinjau FBD gabungan balok A dan B yang ditarik oleh T_BC.",
                formulaLatex: "T_{BC} = (m_A + m_B) a + (f_A + f_B) = (2 + 3)(4) + (4 + 6) = 20 + 10 = \\mathbf{30\\text{ N}} \\\\[6pt] \\text{Verifikasi pada Balok C}: \\quad F - T_{BC} - f_C = m_C a \\\\[4pt] 60 - 30 - 10 = 5 \\times 4 \\implies 20 = 20 \\; (\\checkmark)",
                subNotes: [
                    "Tali BC menarik balok A + B dengan total massa 5 kg",
                    "Kedua metode peninjauan menghasilkan nilai identik T_BC = 30 N",
                ],
                diagramType: "connected-blocks",
                highlightVariables: { "T_BC": "30 N", "Verifikasi": "Cocok 100%" },
            },
        ],
    },
    {
        id: "elevator",
        title: "Dinamika Berat Semu di Dalam Lift (Timbangan)",
        topic: "Gaya Normal & Kerangka Non-Inersia",
        problemStatement:
            "Seseorang bermassa m = 60 kg berdiri di atas timbangan badan di dalam lift. Tentukan gaya normal N (angka yang ditunjukkan timbangan) saat: (1) Lift diam, (2) Lift bergerak naik dipercepat a = 3 m/s\u00b2, (3) Lift turun dipercepat a = 3 m/s\u00b2, dan (4) Kabel lift putus / jatuh bebas! (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Kondisi Lift Diam atau GLB (a = 0)",
                description:
                    "Saat lift diam atau bergerak dengan kecepatan tetap, sistem berada dalam kesetimbangan statis.",
                formulaLatex: "\\Sigma F_y = 0 \\implies N - W = 0 \\\\[6pt] N = W = m \\times g = 60 \\times 10 = \\mathbf{600\\text{ N}} \\quad (\\text{Skala: } 60\\text{ kg})",
                subNotes: [
                    "Gaya normal sama persis dengan berat tubuh asli",
                    "Tidak ada efek inersia tambahan yang bekerja pada tubuh",
                ],
                diagramType: "elevator",
                highlightVariables: { "a": "0 m/s\u00b2", "N": "600 N", "Massa Skala": "60 kg" },
            },
            {
                stepNumber: 2,
                title: "2. Lift Bergerak Naik Dipercepat (a = 3 m/s\u00b2)",
                description:
                    "Lantai lift dan timbangan harus mendorong ke atas lebih kuat untuk menghasilkan percepatan ke atas.",
                formulaLatex: "\\Sigma F_y = m \\times a \\implies N - mg = m \\times a \\\\[6pt] N = m(g + a) = 60 \\times (10 + 3) = 60 \\times 13 = \\mathbf{780\\text{ N}} \\quad (\\text{Skala: } 78\\text{ kg})",
                subNotes: [
                    "Tubuh tertekan lebih berat ke lantai lift",
                    "Timbangan menunjukkan pertambahan berat semu sebesar 180 N (+30%)",
                ],
                diagramType: "elevator",
                highlightVariables: { "a": "+3 m/s\u00b2", "N": "780 N", "Massa Skala": "78 kg" },
            },
            {
                stepNumber: 3,
                title: "3. Lift Bergerak Turun Dipercepat (a = 3 m/s\u00b2)",
                description:
                    "Lantai lift bergerak meluncur turun menjauhi kaki penumpang, mengurangi tekanan kontak.",
                formulaLatex: "mg - N = m \\times a \\implies N = m(g - a) \\\\[6pt] N = 60 \\times (10 - 3) = 60 \\times 7 = \\mathbf{420\\text{ N}} \\quad (\\text{Skala: } 42\\text{ kg})",
                subNotes: [
                    "Penumpang merasa melayang lebih ringan",
                    "Timbangan menunjukkan pengurangan gaya kontak sebesar 180 N",
                ],
                diagramType: "elevator",
                highlightVariables: { "a": "-3 m/s\u00b2", "N": "420 N", "Massa Skala": "42 kg" },
            },
            {
                stepNumber: 4,
                title: "4. Kabel Lift Putus / Jatuh Bebas (a = g)",
                description:
                    "Lift dan penumpang sama-sama jatuh bebas dengan percepatan gravitasi g yang identik.",
                formulaLatex: "N = m(g - g) = 60 \\times 0 = \\mathbf{0\\text{ N}} \\quad (\\text{Keadaan Tanpa Bobot / Weightlessness})",
                subNotes: [
                    "Kaki terlepas dari lantai timbangan (melayang di dalam kabin)",
                    "Gaya kontak normal N = 0, timbangan membaca 0 kg",
                ],
                diagramType: "elevator",
                highlightVariables: { "a": "g (10 m/s\u00b2)", "N": "0 N", "Status": "Melayang" },
            },
        ],
    },
    {
        id: "rotational",
        title: "Dinamika Rotasi: Silinder vs Bola Menggelinding",
        topic: "Momen Inersia & Gerak Menggelinding Murni",
        problemStatement:
            "Sebuah bola pejal (I = 2/5 mR\u00b2) dan silinder pejal (I = 1/2 mR\u00b2) dilepas bersamaan dari puncak bidang miring \u03b8 = 30\u00b0 tanpa slip. Tentukan perbandingan percepatan linier keduanya dan buktikan benda manakah yang mencapai dasar lebih dulu! (g = 10 m/s\u00b2)",
        steps: [
            {
                stepNumber: 1,
                title: "1. Penurunan Rumus Umum Menggelinding Tanpa Slip",
                description:
                    "Tinjau translasi \u03a3F = m \u00d7 a dan rotasi \u03a3\u03c4 = I \u00d7 \u03b1 dengan syarat menggelinding murni a = \u03b1 \u00d7 R.",
                formulaLatex: "mg\\sin\\theta - f_s = m a, \\quad f_s \\cdot R = I \\alpha = (k m R^2) \\left(\\frac{a}{R}\\right) \\implies f_s = k m a \\\\[6pt] mg\\sin\\theta - kma = ma \\implies \\mathbf{a = \\frac{g \\sin\\theta}{1 + k}}",
                subNotes: [
                    "k adalah koefisien momen inersia (I = k \u00d7 mR\u00b2)",
                    "Semakin kecil nilai k, semakin besar percepatan linier benda!",
                ],
                diagramType: "rotational",
                highlightVariables: { "Rumus": "a = g sin\u03b8 / (1 + k)" },
            },
            {
                stepNumber: 2,
                title: "2. Perhitungan Percepatan Bola Pejal",
                description:
                    "Bola pejal memiliki konstanta inersia k = 2/5 = 0.4.",
                formulaLatex: "a_{\\text{bola}} = \\frac{g \\sin 30^\\circ}{1 + \\frac{2}{5}} = \\frac{10 \\times 0.5}{\\frac{7}{5}} = \\frac{5}{\\frac{7}{5}} = \\frac{25}{7} \\approx \\mathbf{3.57\\text{ m/s}^2}",
                subNotes: [
                    "a_bola = (5/7) g sin 30\u00b0 \u2248 0.714 g sin 30\u00b0",
                    "Bola pejal mengalokasikan fraksi energi potensial lebih besar ke translasi",
                ],
                diagramType: "rotational",
                highlightVariables: { "k_bola": "0.4", "a_bola": "3.57 m/s\u00b2" },
            },
            {
                stepNumber: 3,
                title: "3. Perhitungan Percepatan Silinder Pejal",
                description:
                    "Silinder pejal memiliki konstanta inersia k = 1/2 = 0.5.",
                formulaLatex: "a_{\\text{silinder}} = \\frac{g \\sin 30^\\circ}{1 + \\frac{1}{2}} = \\frac{5}{\\frac{3}{2}} = \\frac{10}{3} \\approx \\mathbf{3.33\\text{ m/s}^2}",
                subNotes: [
                    "a_silinder = (2/3) g sin 30\u00b0 \u2248 0.667 g sin 30\u00b0",
                    "a_bola (3.57 m/s\u00b2) > a_silinder (3.33 m/s\u00b2)",
                ],
                diagramType: "rotational",
                highlightVariables: { "k_silinder": "0.5", "a_silinder": "3.33 m/s\u00b2" },
            },
            {
                stepNumber: 4,
                title: "4. Rasio Percepatan & Kesimpulan Pemenang",
                description:
                    "Bandingkan waktu tempuh t = \u221a(2s / a) untuk menentukan pemenang balapan.",
                formulaLatex: "\\frac{a_{\\text{bola}}}{a_{\\text{silinder}}} = \\frac{25/7}{10/3} = \\frac{25 \\times 3}{7 \\times 10} = \\frac{15}{14} \\approx 1.07 \\\\[6pt] t = \\sqrt{\\frac{2s}{a}} \\implies t_{\\text{bola}} < t_{\\text{silinder}} \\implies \\mathbf{\\text{BOLA PEJAL TIBA LEBIH DULU}}",
                subNotes: [
                    "Urutan tercepat ke terlambat: Bola Pejal > Silinder Pejal > Bola Berongga > Cincin",
                    "Massa dan jari-jari tidak mempengaruhi urutan, hanya bentuk geometrinya!",
                ],
                diagramType: "rotational",
                highlightVariables: { "Juara": "Bola Pejal", "Rasio": "15 : 14" },
            },
        ],
    },
    {
        id: "lorentz",
        title: "Gaya Magnet Lorentz & Siklotron Melingkar",
        topic: "Kemagnetan & Gaya Lorentz",
        problemStatement:
            "Sebuah partikel bermuatan q = 3.2 \u00d7 10\u207b\u00b9\u2079 C bermassa m = 6.4 \u00d7 10\u207b\u00b2\u2077 kg melaju dengan kecepatan v = 5 \u00d7 10\u2075 m/s tegak lurus masuk ke dalam medan magnet seragam B = 2 Tesla. Tentukan besar gaya Lorentz dan jari-jari lintasan lingkaran partikel!",
        steps: [
            {
                stepNumber: 1,
                title: "1. Menghitung Besar Gaya Magnet Lorentz (F_L)",
                description:
                    "Karena lintasan tegak lurus arah medan magnet (\u03b1 = 90\u00b0), sin 90\u00b0 = 1.",
                formulaLatex: "F_L = q \\cdot v \\cdot B \\cdot \\sin 90^\\circ = (3.2 \\times 10^{-19}) \\times (5 \\times 10^5) \\times 2 \\\\[6pt] F_L = 3.2 \\times 10 \\times 10^{-14} = \\mathbf{3.2 \\times 10^{-13}\\text{ N}}",
                subNotes: [
                    "Arah gaya Lorentz selalu tegak lurus terhadap vektor kecepatan v",
                    "Gaya Lorentz tidak melakukan usaha (W = 0), sehingga kelajuan v konstan",
                ],
                diagramType: "lorentz",
                highlightVariables: { "F_L": "3.2 \u00d7 10\u207b\u00b9\u00b3 N", "W_L": "0 Joule" },
            },
            {
                stepNumber: 2,
                title: "2. Kesetimbangan Gaya Sentripetal & Jari-Jari (R)",
                description:
                    "Gaya Lorentz berperan penuh sebagai gaya sentripetal yang membelokkan lintasan partikel menjadi lingkaran sempurna.",
                formulaLatex: "F_L = F_c \\implies q v B = \\frac{m v^2}{R} \\\\[6pt] R = \\frac{m v}{q B} = \\frac{(6.4 \\times 10^{-27}) \\times (5 \\times 10^5)}{(3.2 \\times 10^{-19}) \\times 2} = \\frac{3.2 \\times 10^{-21}}{6.4 \\times 10^{-19}} = \\mathbf{0.005\\text{ m} = 5\\text{ mm}}",
                subNotes: [
                    "Jari-jari orbit berbanding lurus dengan momentum partikel (p = mv)",
                    "Jari-jari berbanding terbalik dengan kuat medan magnet B",
                ],
                diagramType: "lorentz",
                highlightVariables: { "R": "5 mm", "Bentuk": "Lingkaran" },
            },
        ],
    },
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
        } else if (step.diagramType === "connected-blocks") {
            // Replica of User Diagram: 3 Blocks connected by rope on friction floor pulled by F to right
            const groundY = height - 70;
            
            // Ground surface line and hatching
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(20, groundY);
            ctx.lineTo(width - 20, groundY);
            ctx.stroke();

            // Ground hatching
            ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
            ctx.lineWidth = 1.5;
            for (let hx = 25; hx < width - 20; hx += 16) {
                ctx.beginPath();
                ctx.moveTo(hx, groundY);
                ctx.lineTo(hx - 10, groundY + 10);
                ctx.stroke();
            }

            // Blocks A, B, C positions
            const blockA = { x: 70, y: groundY - 60, w: 60, h: 60, name: "A", mass: "2 kg", color: "#38bdf8" };
            const blockB = { x: 210, y: groundY - 60, w: 65, h: 60, name: "B", mass: "3 kg", color: "#60a5fa" };
            const blockC = { x: 360, y: groundY - 60, w: 70, h: 60, name: "C", mass: "5 kg", color: "#818cf8" };
            const blocks = [blockA, blockB, blockC];

            // Ropes with tension markers
            const drawRope = (b1: typeof blockA, b2: typeof blockA, tensionLabel: string) => {
                const y = groundY - 30;
                ctx.strokeStyle = "#0284c7";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(b1.x + b1.w, y);
                ctx.lineTo(b2.x, y);
                ctx.stroke();

                // Tension inward arrows (><)
                const midX = (b1.x + b1.w + b2.x) / 2;
                ctx.fillStyle = "#38bdf8";
                // Arrow pointing left (acting on B)
                ctx.beginPath();
                ctx.moveTo(midX + 10, y - 5);
                ctx.lineTo(midX, y);
                ctx.lineTo(midX + 10, y + 5);
                ctx.fill();
                // Arrow pointing right (acting on A)
                ctx.beginPath();
                ctx.moveTo(midX - 10, y - 5);
                ctx.lineTo(midX, y);
                ctx.lineTo(midX - 10, y + 5);
                ctx.fill();

                // Tension Text
                ctx.fillStyle = "#38bdf8";
                ctx.font = "bold 12px ui-monospace, Cambria Math";
                ctx.textAlign = "center";
                ctx.fillText(tensionLabel, midX, y - 10);
            };

            drawRope(blockA, blockB, "T_AB");
            drawRope(blockB, blockC, "T_BC");

            // Draw each Block
            blocks.forEach((b) => {
                ctx.save();
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 8;
                const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
                grad.addColorStop(0, "#0284c7");
                grad.addColorStop(0.5, "#38bdf8");
                grad.addColorStop(1, "#1d4ed8");
                ctx.fillStyle = grad;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.strokeStyle = "#e0f2fe";
                ctx.lineWidth = 2;
                ctx.strokeRect(b.x, b.y, b.w, b.h);
                ctx.restore();

                // Block Name Label
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 20px ui-monospace, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h / 2 + 7);

                // Normal Force N_i (upward)
                const cx = b.x + b.w / 2;
                drawManimVector(cx, b.y, cx, b.y - 50, "#0ea5e9", `N_${b.name}`);

                // Weight Force W_i (downward)
                drawManimVector(cx, b.y + b.h, cx, b.y + b.h + 50, "#ef4444", `W_${b.name}`);

                // Friction Force f_i (leftward along base)
                drawManimVector(b.x, groundY - 2, b.x - 30, groundY - 2, "#facc15", `f_${b.name}`);
            });

            // Pull Force F on block C (to the right)
            drawManimVector(blockC.x + blockC.w, groundY - 30, blockC.x + blockC.w + 65, groundY - 30, "#22c55e", "F = 60 N");

            // Acceleration vector a (dashed red arrow at top)
            ctx.save();
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(blockC.x - 20, 35);
            ctx.lineTo(blockC.x + 80, 35);
            ctx.stroke();
            ctx.setLineDash([]);
            // Arrow head
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(blockC.x + 80, 35);
            ctx.lineTo(blockC.x + 70, 30);
            ctx.lineTo(blockC.x + 70, 40);
            ctx.fill();
            ctx.font = "bold 13px ui-monospace";
            ctx.fillText("a \u2192 (4 m/s\u00b2)", blockC.x + 10, 24);
            ctx.restore();

        } else if (step.diagramType === "elevator") {
            const cabinW = 180;
            const cabinH = 220;
            const cabinX = width / 2 - cabinW / 2;
            const cabinY = height / 2 - cabinH / 2 + 10;

            // Lift Cable at top
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            if (currentStepIndex === 3) {
                // Broken cable effect!
                ctx.lineTo(width / 2, cabinY - 25);
                ctx.stroke();
                // Sparks
                ctx.fillStyle = "#facc15";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText("\u26a1 KABEL PUTUS!", width / 2 + 10, cabinY - 15);
            } else {
                ctx.lineTo(width / 2, cabinY);
                ctx.stroke();
            }

            // Cabin Box
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 3;
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.beginPath();
            ctx.roundRect(cabinX, cabinY, cabinW, cabinH, 12);
            ctx.fill();
            ctx.stroke();

            // Floor scale inside cabin
            const scaleW = 90;
            const scaleH = 16;
            const scaleX = width / 2 - scaleW / 2;
            const scaleY = cabinY + cabinH - 24;

            ctx.fillStyle = "#1e293b";
            ctx.strokeStyle = "#22d3ee";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(scaleX, scaleY, scaleW, scaleH, 4);
            ctx.fill();
            ctx.stroke();

            // Scale LCD Display
            const scaleReadout =
                currentStepIndex === 0
                    ? "60.0 kg (600 N)"
                    : currentStepIndex === 1
                    ? "78.0 kg (780 N)"
                    : currentStepIndex === 2
                    ? "42.0 kg (420 N)"
                    : "0.0 kg (0 N)";

            ctx.fillStyle = currentStepIndex === 1 ? "#22c55e" : currentStepIndex === 2 ? "#f59e0b" : currentStepIndex === 3 ? "#ef4444" : "#38bdf8";
            ctx.font = "bold 11px ui-monospace";
            ctx.textAlign = "center";
            ctx.fillText(scaleReadout, width / 2, scaleY + 12);

            // Passenger Stick/Avatar Figure
            const personCenterX = width / 2;
            const personFeetY = currentStepIndex === 3 ? scaleY - 25 : scaleY; // Melayang if free fall!

            // Head
            ctx.strokeStyle = "#f8fafc";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(personCenterX, personFeetY - 95, 14, 0, Math.PI * 2);
            ctx.stroke();

            // Body
            ctx.beginPath();
            ctx.moveTo(personCenterX, personFeetY - 81);
            ctx.lineTo(personCenterX, personFeetY - 35);
            ctx.stroke();

            // Arms
            ctx.beginPath();
            ctx.moveTo(personCenterX - 25, personFeetY - 60);
            ctx.lineTo(personCenterX, personFeetY - 70);
            ctx.lineTo(personCenterX + 25, personFeetY - 60);
            ctx.stroke();

            // Legs
            ctx.beginPath();
            ctx.moveTo(personCenterX, personFeetY - 35);
            ctx.lineTo(personCenterX - 18, personFeetY);
            ctx.moveTo(personCenterX, personFeetY - 35);
            ctx.lineTo(personCenterX + 18, personFeetY);
            ctx.stroke();

            // Force vectors on person
            const personCenterY = personFeetY - 55;
            // Weight W (down)
            drawManimVector(personCenterX, personCenterY, personCenterX, personCenterY + 60, "#ef4444", "W = 600 N");

            // Normal N (up)
            if (currentStepIndex === 0) {
                drawManimVector(personCenterX, personFeetY, personCenterX, personFeetY - 60, "#38bdf8", "N = 600 N");
            } else if (currentStepIndex === 1) {
                drawManimVector(personCenterX, personFeetY, personCenterX, personFeetY - 85, "#22c55e", "N = 780 N");
            } else if (currentStepIndex === 2) {
                drawManimVector(personCenterX, personFeetY, personCenterX, personFeetY - 38, "#f59e0b", "N = 420 N");
            } else if (currentStepIndex === 3) {
                ctx.fillStyle = "#ef4444";
                ctx.font = "bold 13px ui-monospace";
                ctx.fillText("N = 0 (Melayang Bebas)", personCenterX + 55, personFeetY - 10);
            }

            // Direction of acceleration outside cabin
            if (currentStepIndex === 1) {
                drawManimVector(cabinX + cabinW + 25, cabinY + cabinH - 30, cabinX + cabinW + 25, cabinY + 30, "#22c55e", "a = +3 m/s\u00b2");
            } else if (currentStepIndex === 2) {
                drawManimVector(cabinX + cabinW + 25, cabinY + 30, cabinX + cabinW + 25, cabinY + cabinH - 30, "#f59e0b", "a = -3 m/s\u00b2");
            } else if (currentStepIndex === 3) {
                drawManimVector(cabinX + cabinW + 25, cabinY + 30, cabinX + cabinW + 25, cabinY + cabinH, "#ef4444", "a = g = 10 m/s\u00b2");
            }

        } else if (step.diagramType === "rotational") {
            // Rotational Dynamics: Sphere & Cylinder rolling down incline without slip
            const startX = 60;
            const startY = height - 50;
            const rampLen = width - 130;
            const angleRad = (30 * Math.PI) / 180;
            const rampH = rampLen * Math.tan(angleRad) * 0.55;

            // Incline Wedge
            ctx.strokeStyle = "#38bdf8";
            ctx.fillStyle = "rgba(14, 165, 233, 0.08)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + rampLen, startY);
            ctx.lineTo(startX, startY - rampH);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Rolling Solid Sphere (Leader)
            const r = 26;
            const sDist = rampLen * (0.3 + currentStepIndex * 0.15);
            const cx = startX + sDist * Math.cos(angleRad) + r * Math.sin(angleRad);
            const cy = (startY - rampH) + sDist * Math.sin(angleRad) - r * Math.cos(angleRad);

            // Sphere Body with gradient
            const sGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, r);
            sGrad.addColorStop(0, "#fbbf24");
            sGrad.addColorStop(0.8, "#d97706");
            sGrad.addColorStop(1, "#78350f");
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#fef08a";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Rotation lines (spokes) to visually show rolling rotation omega
            const rotAngle = (sDist / r) * 1.5;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 4; i++) {
                const spAngle = rotAngle + (i * Math.PI) / 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + r * Math.cos(spAngle), cy + r * Math.sin(spAngle));
                ctx.stroke();
            }

            // Labels
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px ui-monospace";
            ctx.textAlign = "center";
            ctx.fillText("Bola Pejal (k=0.4)", cx, cy - r - 12);
            ctx.fillText("a = 3.57 m/s\u00b2", cx, cy - r - 26);

            // Linear acceleration vector
            const aLen = 50;
            drawManimVector(cx, cy, cx + aLen * Math.cos(angleRad), cy + aLen * Math.sin(angleRad), "#22c55e", "a_lin");

            // Static friction vector along ramp contact (uphill)
            const contactX = cx - r * Math.sin(angleRad);
            const contactY = cy + r * Math.cos(angleRad);
            drawManimVector(contactX, contactY, contactX - 35 * Math.cos(angleRad), contactY - 35 * Math.sin(angleRad), "#f59e0b", "f_s");

        } else if (step.diagramType === "lorentz") {
            // Lorentz Magnetic Force & Circular Trajectory: F_L = q(v x B) = mv^2 / R
            const centerX = width / 2;
            const centerY = height / 2 + 10;
            const orbitR = 85;

            // Draw Magnetic Field Grid (B into screen: symbols cross X)
            ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
            ctx.font = "14px ui-monospace";
            ctx.textAlign = "center";
            for (let bx = 50; bx < width - 40; bx += 40) {
                for (let by = 40; by < height - 30; by += 40) {
                    ctx.fillText("\u2297", bx, by);
                }
            }
            // B Field Legend
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 13px ui-monospace";
            ctx.fillText("Medan Magnet B \u2297 (Masuk Bidang Gambar, 2 Tesla)", width / 2, 30);

            // Orbit Path (Dashed Circle)
            ctx.strokeStyle = "rgba(147, 197, 253, 0.4)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Particle position on orbit based on step
            const orbitAngle = (currentStepIndex * 0.7 + 0.3) * Math.PI;
            const px = centerX + orbitR * Math.cos(orbitAngle);
            const py = centerY + orbitR * Math.sin(orbitAngle);

            // Positive Ion Particle (+q)
            ctx.save();
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px ui-monospace";
            ctx.textAlign = "center";
            ctx.fillText("+q", px, py + 4);

            // Tangent Velocity Vector v
            const vAngle = orbitAngle + Math.PI / 2;
            const vLen = 60;
            drawManimVector(px, py, px + vLen * Math.cos(vAngle), py + vLen * Math.sin(vAngle), "#38bdf8", "v (5\u00d710\u2075 m/s)");

            // Lorentz Force Vector F_L pointing radially inward to Center (F_c = mv^2/R)
            const fAngle = orbitAngle + Math.PI;
            const fLen = 50;
            drawManimVector(px, py, px + fLen * Math.cos(fAngle), py + fLen * Math.sin(fAngle), "#e11d48", "F_L = F_c");

            // Orbit Radius indicator line
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#facc15";
            ctx.font = "bold 11px ui-monospace";
            ctx.fillText("R = 5 mm", (centerX + px) / 2 - 12, (centerY + py) / 2 - 8);

            // Right hand rule badge
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(20, height - 55, 220, 42, 8);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#e0f2fe";
            ctx.font = "10px ui-monospace";
            ctx.textAlign = "left";
            ctx.fillText("Kaidah Tangan Kanan:", 30, height - 40);
            ctx.fillText("Ibu jari = v | Jari = B \u2297 | Telapak = F_L", 30, height - 23);
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
