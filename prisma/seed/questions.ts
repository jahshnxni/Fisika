// Question generator using template-based approach
// Generates ~600 questions per unit (total ~3000)

interface QuestionTemplate {
    template: (vars: Record<string, number>) => string;
    optionsTemplate: (vars: Record<string, number>, correct: number) => string[];
    correctTemplate: (vars: Record<string, number>) => number;
    explanationTemplate: (vars: Record<string, number>, correct: number) => string;
    difficulty: string;
    tags: string[];
    skillSlug: string;
    unitSlug: string;
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateVariants(template: QuestionTemplate, count: number) {
    const questions: any[] = [];
    for (let i = 0; i < count; i++) {
        const vars: Record<string, number> = {};
        // Generate random variables based on difficulty
        if (template.difficulty === "EASY") {
            vars.h = randInt(1, 20);
            vars.rho = randChoice([1000, 800, 1200, 900]);
            vars.g = 10;
            vars.A1 = randInt(2, 10);
            vars.A2 = randInt(20, 100);
            vars.F1 = randInt(50, 500);
            vars.m = randInt(1, 10);
            vars.v = randInt(1, 10);
            vars.T1 = randInt(20, 80);
            vars.T2 = randInt(100, 400);
            vars.f = randInt(100, 1000);
            vars.lambda = randInt(1, 10);
            vars.c = randInt(1000, 5000);
            vars.n = randInt(1, 5);
        } else if (template.difficulty === "MEDIUM") {
            vars.h = randInt(5, 50);
            vars.rho = randChoice([1000, 800, 1200, 13600, 900, 1030]);
            vars.g = randChoice([9.8, 10]);
            vars.A1 = randInt(2, 20);
            vars.A2 = randInt(30, 200);
            vars.F1 = randInt(100, 2000);
            vars.m = randInt(1, 20);
            vars.v = randInt(2, 30);
            vars.T1 = randInt(0, 100);
            vars.T2 = randInt(200, 800);
            vars.f = randInt(50, 5000);
            vars.lambda = randInt(1, 20);
            vars.c = randInt(500, 6000);
            vars.P = randInt(100000, 500000);
            vars.n = randInt(1, 10);
        } else {
            vars.h = randInt(10, 100);
            vars.rho = randChoice([1000, 800, 1200, 13600, 1030, 920]);
            vars.g = 9.8;
            vars.A1 = randInt(1, 30);
            vars.A2 = randInt(50, 500);
            vars.F1 = randInt(200, 5000);
            vars.m = randInt(1, 50);
            vars.v = randInt(5, 50);
            vars.T1 = randInt(-20, 200);
            vars.T2 = randInt(300, 1200);
            vars.f = randInt(20, 20000);
            vars.lambda = randInt(1, 50);
            vars.c = randInt(200, 8000);
            vars.P = randInt(50000, 1000000);
            vars.n = randInt(1, 20);
        }

        const correct = template.correctTemplate(vars);
        const options = template.optionsTemplate(vars, correct);

        questions.push({
            questionMd: template.template(vars),
            options: JSON.stringify(options),
            correctIndex: 0, // correct answer is always first, we shuffle later
            explanationMd: template.explanationTemplate(vars, correct),
            difficulty: template.difficulty,
            tags: JSON.stringify(template.tags),
            skillSlug: template.skillSlug,
            unitSlug: template.unitSlug,
            category: template.unitSlug,
        });
    }

    // Shuffle options for each question
    return questions.map(q => {
        const opts = JSON.parse(q.options) as string[];
        const correctOpt = opts[0];
        // Fisher-Yates shuffle
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        const newCorrectIndex = opts.indexOf(correctOpt);
        return { ...q, options: JSON.stringify(opts), correctIndex: newCorrectIndex };
    });
}

// ===================== FLUIDA STATIS TEMPLATES =====================
const fluidaStatisTemplates: QuestionTemplate[] = [
    // Hydrostatic - EASY
    ...Array.from({ length: 20 }, (_, i) => ({
        template: (v: Record<string, number>) => `Seekor ikan berenang di kedalaman ${v.h} m dalam air ($\\rho=${v.rho}$ kg/m³, $g=${v.g}$ m/s²). Berapa tekanan hidrostatisnya?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toLocaleString()} Pa`, `${Math.round(c * 1.5).toLocaleString()} Pa`, `${Math.round(c * 0.5).toLocaleString()} Pa`, `${Math.round(c * 2).toLocaleString()} Pa`],
        correctTemplate: (v: Record<string, number>) => v.rho * v.g * v.h,
        explanationTemplate: (v: Record<string, number>, c: number) => `$P_h = \\rho g h = ${v.rho} \\cdot ${v.g} \\cdot ${v.h} = ${c}$ Pa`,
        difficulty: "EASY", tags: ["CALCULATION", "HYDROSTATIC"], skillSlug: "tekanan-hidrostatis", unitSlug: "fluida-statis",
    })),
    // Hydrostatic - MEDIUM
    ...Array.from({ length: 20 }, (_, i) => ({
        template: (v: Record<string, number>) => `Tekanan hidrostatis di suatu titik adalah ${v.P} Pa. Jika $\\rho=${v.rho}$ dan $g=${v.g}$, berapa kedalamannya?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(1)} m`, `${(c * 2).toFixed(1)} m`, `${(c * 0.5).toFixed(1)} m`, `${(c * 1.3).toFixed(1)} m`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.P / (v.rho * v.g) * 10) / 10,
        explanationTemplate: (v: Record<string, number>, c: number) => `$h = P/(\\rho g) = ${v.P}/(${v.rho} \\cdot ${v.g}) = ${c}$ m`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "HYDROSTATIC"], skillSlug: "tekanan-hidrostatis", unitSlug: "fluida-statis",
    })),
    // Pascal - EASY
    ...Array.from({ length: 20 }, (_, i) => ({
        template: (v: Record<string, number>) => `Dongkrak hidrolik: piston kecil luas ${v.A1} cm² ditekan ${v.F1} N. Piston besar luas ${v.A2} cm². Berapa gaya pada piston besar?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} N`, `${Math.round(c * 0.7)} N`, `${Math.round(c * 1.5)} N`, `${Math.round(c * 0.3)} N`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.F1 * v.A2 / v.A1),
        explanationTemplate: (v: Record<string, number>, c: number) => `$F_2 = F_1 \\cdot A_2/A_1 = ${v.F1} \\cdot ${v.A2}/${v.A1} = ${c}$ N`,
        difficulty: "EASY", tags: ["CALCULATION", "PASCAL"], skillSlug: "hukum-pascal", unitSlug: "fluida-statis",
    })),
    // Archimedes - EASY
    ...Array.from({ length: 20 }, (_, i) => ({
        template: (v: Record<string, number>) => `Benda volume ${v.A1 * 100} cm³ dicelupkan seluruhnya ke air ($\\rho=1000$, $g=10$). Berapa gaya apung?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} N`, `${Math.round(c * 1.5)} N`, `${Math.round(c * 0.5)} N`, `${Math.round(c * 2)} N`],
        correctTemplate: (v: Record<string, number>) => Math.round(1000 * 10 * v.A1 * 100 / 1000000 * 100) / 100,
        explanationTemplate: (v: Record<string, number>, c: number) => `$F_a = \\rho g V = 1000 \\cdot 10 \\cdot ${(v.A1 * 100 / 1000000).toFixed(4)} = ${c}$ N`,
        difficulty: "EASY", tags: ["CALCULATION", "ARCHIMEDES"], skillSlug: "hukum-archimedes", unitSlug: "fluida-statis",
    })),
    // HARD conceptual
    ...Array.from({ length: 10 }, () => ({
        template: () => `Dua wadah berbeda bentuk diisi air setinggi sama. Di dasar wadah mana tekanan hidrostatis lebih besar?`,
        optionsTemplate: () => ["Sama besar (Paradoks Hidrostatis)", "Wadah yang volumenya lebih besar", "Wadah yang luasnya lebih kecil", "Tidak bisa ditentukan"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Tekanan hidrostatis hanya bergantung pada $\\rho$, $g$, dan $h$. Bentuk dan volume wadah tidak mempengaruhi!`,
        difficulty: "HARD", tags: ["HOTS", "CONCEPT"], skillSlug: "tekanan-hidrostatis", unitSlug: "fluida-statis",
    })),
];

// ===================== FLUIDA DINAMIS TEMPLATES =====================
const fluidaDinamisTemplates: QuestionTemplate[] = [
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Air mengalir di pipa berdiameter ${v.A1 * 2} cm dengan kecepatan ${v.v} m/s. Berapa debitnya? (Gunakan π = 3,14)`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(4)} m³/s`, `${(c * 2).toFixed(4)} m³/s`, `${(c * 0.5).toFixed(4)} m³/s`, `${(c * 3).toFixed(4)} m³/s`],
        correctTemplate: (v: Record<string, number>) => Math.round(3.14 * (v.A1 / 100) ** 2 * v.v * 10000) / 10000,
        explanationTemplate: (v: Record<string, number>, c: number) => `$Q = \\pi r^2 v = 3,14 \\cdot (${v.A1 / 100})^2 \\cdot ${v.v} = ${c}$ m³/s`,
        difficulty: "EASY", tags: ["CALCULATION", "DEBIT"], skillSlug: "debit-kontinuitas", unitSlug: "fluida-dinamis",
    })),
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Pipa berdiameter ${v.A1 * 2} cm (kecepatan ${v.v} m/s) menyempit menjadi ${v.A1} cm. Berapa kecepatan di bagian sempit?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} m/s`, `${c / 2} m/s`, `${c * 2} m/s`, `${Math.round(c * 0.75)} m/s`],
        correctTemplate: (v: Record<string, number>) => v.v * 4,
        explanationTemplate: (v: Record<string, number>, c: number) => `$A_1 v_1 = A_2 v_2$; Diameter setengah → luas 1/4 → kecepatan 4x = ${c} m/s`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "CONTINUITY"], skillSlug: "debit-kontinuitas", unitSlug: "fluida-dinamis",
    })),
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Air keluar dari lubang di tangki pada kedalaman ${v.h} m dari permukaan ($g=${v.g}$). Berapa kecepatan air keluar? (Toricelli)`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(1)} m/s`, `${(c * 1.5).toFixed(1)} m/s`, `${(c * 0.5).toFixed(1)} m/s`, `${(c * 2).toFixed(1)} m/s`],
        correctTemplate: (v: Record<string, number>) => Math.round(Math.sqrt(2 * v.g * v.h) * 10) / 10,
        explanationTemplate: (v: Record<string, number>, c: number) => `$v = \\sqrt{2gh} = \\sqrt{2 \\cdot ${v.g} \\cdot ${v.h}} = ${c}$ m/s`,
        difficulty: "EASY", tags: ["CALCULATION", "TORICELLI"], skillSlug: "toricelli-venturi", unitSlug: "fluida-dinamis",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Udara mengalir di atas sayap pesawat ${v.v + 20} m/s dan di bawah ${v.v} m/s. $\\rho_{udara}=1,2$. Berapa beda tekanan?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} Pa`, `${Math.round(c * 1.3)} Pa`, `${Math.round(c * 0.7)} Pa`, `${Math.round(c * 2)} Pa`],
        correctTemplate: (v: Record<string, number>) => Math.round(0.5 * 1.2 * ((v.v + 20) ** 2 - v.v ** 2)),
        explanationTemplate: (v: Record<string, number>, c: number) => `$\\Delta P = \\frac{1}{2}\\rho(v_2^2 - v_1^2) = 0,5 \\cdot 1,2 \\cdot (${(v.v + 20) ** 2} - ${v.v ** 2}) = ${c}$ Pa`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "BERNOULLI"], skillSlug: "hukum-bernoulli", unitSlug: "fluida-dinamis",
    })),
];

// ===================== GELOMBANG TEMPLATES =====================
const gelombangTemplates: QuestionTemplate[] = [
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Gelombang memiliki $\\lambda = ${v.lambda}$ m dan $f = ${v.f}$ Hz. Berapa cepat rambatnya?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} m/s`, `${Math.round(c * 1.5)} m/s`, `${Math.round(c * 0.5)} m/s`, `${Math.round(c * 2)} m/s`],
        correctTemplate: (v: Record<string, number>) => v.lambda * v.f,
        explanationTemplate: (v: Record<string, number>, c: number) => `$v = \\lambda f = ${v.lambda} \\cdot ${v.f} = ${c}$ m/s`,
        difficulty: "EASY", tags: ["CALCULATION", "WAVE"], skillSlug: "gelombang-mekanik", unitSlug: "gelombang",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Pipa organa tertutup panjang ${(v.lambda / 4).toFixed(2)} m ($v_{bunyi}=340$ m/s). Berapa frekuensi nada dasar?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(0)} Hz`, `${Math.round(c * 2)} Hz`, `${Math.round(c * 0.5)} Hz`, `${Math.round(c * 3)} Hz`],
        correctTemplate: (v: Record<string, number>) => Math.round(340 / (4 * v.lambda / 4)),
        explanationTemplate: (v: Record<string, number>, c: number) => `$f_1 = v/(4L) = 340/(4 \\cdot ${(v.lambda / 4).toFixed(2)}) = ${c.toFixed(0)}$ Hz`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "SOUND"], skillSlug: "gelombang-bunyi", unitSlug: "gelombang",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Cahaya $\\lambda = ${v.lambda * 100}$ nm melewati celah ganda $d = 0,${v.A1}$ mm. Layar ${v.m} m. Jarak terang pusat ke terang pertama?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(3)} m`, `${(c * 2).toFixed(3)} m`, `${(c * 0.5).toFixed(3)} m`, `${(c * 3).toFixed(3)} m`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.lambda * 100e-9 * v.m / (v.A1 * 1e-4) * 1000) / 1000,
        explanationTemplate: (v: Record<string, number>, c: number) => `$y = \\lambda L / d = ${v.lambda * 100} \\times 10^{-9} \\cdot ${v.m} / (${v.A1} \\times 10^{-4}) = ${c}$ m`,
        difficulty: "HARD", tags: ["CALCULATION", "LIGHT"], skillSlug: "gelombang-cahaya", unitSlug: "gelombang",
    })),
];

// ===================== SUHU KALOR TEMPLATES =====================
const suhuKalorTemplates: QuestionTemplate[] = [
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Konversi ${v.T1}°C ke Fahrenheit!`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c}°F`, `${c + 20}°F`, `${c - 20}°F`, `${Math.round(c * 1.2)}°F`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.T1 * 9 / 5 + 32),
        explanationTemplate: (v: Record<string, number>, c: number) => `$°F = 9/5 \\cdot ${v.T1} + 32 = ${c}°F$`,
        difficulty: "EASY", tags: ["CALCULATION", "TEMPERATURE"], skillSlug: "suhu-termometer", unitSlug: "suhu-kalor",
    })),
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Berapa kalor untuk menaikkan suhu ${v.m} kg air dari ${v.T1}°C ke ${v.T1 + 50}°C? ($c=4200$ J/kg°C)`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toLocaleString()} J`, `${Math.round(c * 1.5).toLocaleString()} J`, `${Math.round(c * 0.5).toLocaleString()} J`, `${Math.round(c * 2).toLocaleString()} J`],
        correctTemplate: (v: Record<string, number>) => v.m * 4200 * 50,
        explanationTemplate: (v: Record<string, number>, c: number) => `$Q = mc\\Delta T = ${v.m} \\cdot 4200 \\cdot 50 = ${c}$ J`,
        difficulty: "EASY", tags: ["CALCULATION", "HEAT"], skillSlug: "kalor-asas-black", unitSlug: "suhu-kalor",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Batang baja ${v.m} m dipanaskan ${v.T1}°C ($\\alpha = 12 \\times 10^{-6}$). Berapa pertambahan panjang?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c.toFixed(4)} m`, `${(c * 2).toFixed(4)} m`, `${(c * 0.5).toFixed(4)} m`, `${(c * 3).toFixed(4)} m`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.m * 12e-6 * v.T1 * 10000) / 10000,
        explanationTemplate: (v: Record<string, number>, c: number) => `$\\Delta L = L_0 \\alpha \\Delta T = ${v.m} \\cdot 12 \\times 10^{-6} \\cdot ${v.T1} = ${c}$ m`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "EXPANSION"], skillSlug: "pemuaian", unitSlug: "suhu-kalor",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Dinding kaca tebal ${v.A1} mm, luas ${v.m} m², $k=1$ W/m·K. Suhu dalam ${v.T1 + 20}°C, luar ${v.T1}°C. Laju kalor?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} W`, `${Math.round(c * 1.5)} W`, `${Math.round(c * 0.5)} W`, `${Math.round(c * 2)} W`],
        correctTemplate: (v: Record<string, number>) => Math.round(1 * v.m * 20 / (v.A1 / 1000)),
        explanationTemplate: (v: Record<string, number>, c: number) => `$Q/t = kA\\Delta T / L = 1 \\cdot ${v.m} \\cdot 20 / ${v.A1 / 1000} = ${c}$ W`,
        difficulty: "HARD", tags: ["CALCULATION", "HEAT_TRANSFER"], skillSlug: "perpindahan-kalor", unitSlug: "suhu-kalor",
    })),
];

// ===================== TERMODINAMIKA TEMPLATES =====================
const termodinamikaTemplates: QuestionTemplate[] = [
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Gas menerima ${v.F1} J kalor dan melakukan usaha ${Math.round(v.F1 * 0.4)} J. Berapa $\\Delta U$?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} J`, `${v.F1} J`, `${Math.round(v.F1 * 0.4)} J`, `${Math.round(c * 1.5)} J`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.F1 - v.F1 * 0.4),
        explanationTemplate: (v: Record<string, number>, c: number) => `$\\Delta U = Q - W = ${v.F1} - ${Math.round(v.F1 * 0.4)} = ${c}$ J`,
        difficulty: "EASY", tags: ["CALCULATION", "THERMO1"], skillSlug: "hukum-1-termodinamika", unitSlug: "termodinamika",
    })),
    ...Array.from({ length: 20 }, () => ({
        template: (v: Record<string, number>) => `Mesin Carnot: $T_H = ${v.T2}$ K, $T_C = ${Math.round(v.T2 * 0.4)}$ K. Berapa efisiensinya?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c}%`, `${Math.round(c * 0.7)}%`, `${Math.min(100, Math.round(c * 1.3))}%`, `${Math.round(c * 0.5)}%`],
        correctTemplate: (v: Record<string, number>) => Math.round((1 - (v.T2 * 0.4) / v.T2) * 100),
        explanationTemplate: (v: Record<string, number>, c: number) => `$\\eta = 1 - T_C/T_H = 1 - ${Math.round(v.T2 * 0.4)}/${v.T2} = ${c}\\%$`,
        difficulty: "EASY", tags: ["CALCULATION", "CARNOT"], skillSlug: "hukum-2-carnot", unitSlug: "termodinamika",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Gas ideal isobarik ($P = ${v.n} \\times 10^5$ Pa). Volume: ${v.A1} L → ${v.A1 + v.m} L. Kalor masuk ${v.F1} J. $\\Delta U$?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [`${c} J`, `${v.F1} J`, `${Math.round(c * 1.5)} J`, `${Math.round(c * 0.5)} J`],
        correctTemplate: (v: Record<string, number>) => Math.round(v.F1 - v.n * 1e5 * v.m * 1e-3),
        explanationTemplate: (v: Record<string, number>, c: number) => `$W = P\\Delta V = ${v.n}\\times10^5 \\cdot ${v.m}\\times10^{-3}$; $\\Delta U = Q - W = ${c}$ J`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "THERMO1"], skillSlug: "hukum-1-termodinamika", unitSlug: "termodinamika",
    })),
    ...Array.from({ length: 15 }, () => ({
        template: (v: Record<string, number>) => `Mesin kalor menyerap ${v.F1} J dan membuang ${Math.round(v.F1 * 0.6)} J. (a) Usaha? (b) Efisiensi?`,
        optionsTemplate: (v: Record<string, number>, c: number) => [
            `W=${Math.round(v.F1 * 0.4)} J, η=${c}%`,
            `W=${Math.round(v.F1 * 0.6)} J, η=${Math.round(c * 1.5)}%`,
            `W=${Math.round(v.F1 * 0.3)} J, η=${Math.round(c * 0.5)}%`,
            `W=${Math.round(v.F1 * 0.5)} J, η=50%`
        ],
        correctTemplate: (v: Record<string, number>) => 40,
        explanationTemplate: (v: Record<string, number>, c: number) => `$W = Q_H - Q_C = ${v.F1} - ${Math.round(v.F1 * 0.6)} = ${Math.round(v.F1 * 0.4)}$ J; $\\eta = W/Q_H = ${c}\\%$`,
        difficulty: "MEDIUM", tags: ["CALCULATION", "CARNOT"], skillSlug: "hukum-2-carnot", unitSlug: "termodinamika",
    })),
];

export function generateAllQuestions() {
    const allTemplates = [
        ...fluidaStatisTemplates,
        ...fluidaDinamisTemplates,
        ...gelombangTemplates,
        ...suhuKalorTemplates,
        ...termodinamikaTemplates,
    ];

    const allQuestions: any[] = [];

    // Generate ~7 variants per template to reach ~3000 total
    for (const template of allTemplates) {
        const variants = generateVariants(template, 7);
        allQuestions.push(...variants);
    }

    return allQuestions;
}
