// Question generator using template-based approach
// Generates questions for 5 units, 4 tiers per unit

interface QuestionTemplate {
    template: (vars: Record<string, number>) => string;
    optionsTemplate: (vars: Record<string, number>, correct: number) => string[];
    correctTemplate: (vars: Record<string, number>) => number;
    explanationTemplate: (vars: Record<string, number>, correct: number) => string;
    difficulty: string; // EASY, NORMAL, HARD, EXTREME
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
        const vars: Record<string, number> = {
            v: randInt(2, 50), h: randInt(2, 50),
            rho: randChoice([1000, 800, 1030, 13600]), g: 10,
            P: randInt(1e5, 5e5), A1: randInt(2, 20), A2: randInt(30, 100),
            F1: randInt(50, 2000), m: randInt(1, 50), T1: randInt(10, 50),
            T2: randInt(80, 500), f: randInt(50, 1000), lambda: randInt(1, 20),
            n: randInt(1, 5), c: randInt(1000, 5000)
        };
        const correct = template.correctTemplate(vars);
        const options = template.optionsTemplate(vars, correct);

        questions.push({
            questionMd: template.template(vars),
            options: JSON.stringify(options),
            correctIndex: 0,
            explanationMd: template.explanationTemplate(vars, correct),
            difficulty: template.difficulty,
            tags: JSON.stringify(template.tags),
            skillSlug: template.skillSlug,
            unitSlug: template.unitSlug,
            category: template.unitSlug,
        });
    }

    // Shuffle options
    return questions.map(q => {
        const opts = JSON.parse(q.options) as string[];
        const correctOpt = opts[0];
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return { ...q, options: JSON.stringify(opts), correctIndex: opts.indexOf(correctOpt) };
    });
}

const templates: QuestionTemplate[] = [
    // UNIT 1: FLUIDA STATIS
    {
        template: (v) => `Seekor ikan berenang di kedalaman ${v.h} m dalam air ($\\rho=1000$ kg/m³, $g=10$ m/s²). Pertanyaan yang benar mengenai ikan ini adalah...`,
        optionsTemplate: () => ["Makin dalam ia berenang, tekanan makin besar", "Tekanannya selalu sama di manapun", "Tekanan hidrostatis tidak tergantung massa jenis", "Ikan tak merasakan tekanan apa-apa"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Tekanan hidrostatis $P = \\rho g h$. Karena berbanding lurus dengan kedalaman ($h$), makin dalam tekanannya makin besar.`,
        difficulty: "EASY", tags: ["LITERASI", "KONSEP"], skillSlug: "tekanan-hidrostatis", unitSlug: "fluida-statis"
    },
    {
        template: (v) => `Pipa U diisi air ($\\rho=1000$ kg/m³) dan minyak tak diketahui. Jika tinggi kolom air ${v.h} cm dan tinggi minyak ${Math.round(v.h * 1.25)} cm seimbang, berapakah massa jenis minyak?`,
        optionsTemplate: (v, c) => [`${c} kg/m³`, `${c - 100} kg/m³`, `${c + 200} kg/m³`, `1000 kg/m³`],
        correctTemplate: (v) => Math.round(1000 * v.h / (v.h * 1.25)),
        explanationTemplate: (v, c) => `$\\rho_m h_m = \\rho_a h_a \\implies \\rho_m = (1000 \\times ${v.h}) / ${Math.round(v.h * 1.25)} = ${c}$ kg/m³.`,
        difficulty: "NORMAL", tags: ["NUMERASI", "PASCAL"], skillSlug: "hukum-pascal", unitSlug: "fluida-statis"
    },
    {
        template: (v) => `Sebuah balok es ($\\rho = 900$ kg/m³) mengapung di lautan ($\\rho = 1030$ kg/m³). Jika volume es yang menonjol adalah ${v.A1} m³, berapakah volume total gunung es tersebut?`,
        optionsTemplate: (v, c) => [`${c.toFixed(1)} m³`, `${(c * 0.5).toFixed(1)} m³`, `${(c * 2).toFixed(1)} m³`, `${(c + 10).toFixed(1)} m³`],
        correctTemplate: (v) => Math.round((v.A1 * 1030) / (1030 - 900) * 10) / 10,
        explanationTemplate: (v, c) => `$\\rho_{es} V_{tot} = \\rho_{air} V_{tercelup}$. Selisihnya adalah bagian menonjol. $v_{tot} = ${c}$ m³.`,
        difficulty: "HARD", tags: ["KONTEKSTUAL", "ARCHIMEDES"], skillSlug: "hukum-archimedes", unitSlug: "fluida-statis"
    },
    {
        template: (v) => `Balok emas murni bermassa ${v.m} kg diukur beratnya di dalam suatu sumur berisi cairan rahasia. Ternyata berat balok memudar drastis menjadi hanya ${Math.round(v.m * 10 * 0.4)} Newton berkat gaya apung cairan (g=10 m/s², $\\rho_{emas}=19.300$ kg/m³). Berapakah massa jenis absolut cairan misterius itu?`,
        optionsTemplate: (v, c) => [`${c} kg/m³`, `${c + 1000} kg/m³`, `${c - 500} kg/m³`, `1000 kg/m³`],
        correctTemplate: (v) => Math.round(((v.m * 10 - v.m * 10 * 0.4) / (v.m / 19300)) / 10),
        explanationTemplate: (v, c) => `$W_{air} = W_{udara} - F_a$. Cairan misterius memberikan $F_a = ${v.m * 10 * 0.6}$ N. Volume balok = ${v.m}/19300 m³. Karena $F_a = \\rho_{cair} g V$, maka $\\rho_{cair} = ${c}$ kg/m³.`,
        difficulty: "EXTREME", tags: ["UTBK", "ANALISIS"], skillSlug: "hukum-archimedes", unitSlug: "fluida-statis"
    },

    // UNIT 2: FLUIDA DINAMIS & AERODINAMIKA
    {
        template: (v) => `Apa alasan mendasar sayap pesawat harus memiliki bagian atas yang melengkung dan bagian bawah yang rata?`,
        optionsTemplate: () => ["Agar aliran udara atas lebih cepat", "Agar pesawat lebih berat", "Hanya estetika bodi pesawat", "Mencegah turbulensi belakang"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Sesuai Asas Bernoulli, lengkungan memicu udara bergerak lebih cepat di atas sayap (Kecepatan Naik = Tekanan Turun). Perbedaan Tekanan bawah > atas menghasilkan Gaya Angkat (Lift).`,
        difficulty: "EASY", tags: ["LITERASI", "KONSEP"], skillSlug: "aerodinamika", unitSlug: "fluida-dinamis"
    },
    {
        template: (v) => `Pipa air menyempit dari luas penampang ${v.A2} cm² ke ${v.A1} cm². Jika kecepatan di pipa besar ${v.n} m/s, kecepatan semburan di ujung sempit adalah...`,
        optionsTemplate: (v, c) => [`${c.toFixed(1)} m/s`, `${(c / 2).toFixed(1)} m/s`, `${(c * 2).toFixed(1)} m/s`, `${(v.n).toFixed(1)} m/s`],
        correctTemplate: (v) => (v.A2 * v.n) / v.A1,
        explanationTemplate: (v, c) => `Kekekalan Debit Asas Kontinuitas: $A_1 v_1 = A_2 v_2 \\implies v_2 = (${v.A2} \\times ${v.n}) / ${v.A1} = ${c}$ m/s.`,
        difficulty: "NORMAL", tags: ["NUMERASI", "KONTINUITAS"], skillSlug: "debit-kontinuitas", unitSlug: "fluida-dinamis"
    },
    {
        template: (v) => `Sebuah atap seng seluas ${v.A1} m² tiba-tiba terangkat copot terbang saat angin puting beliung mengamuk berhembus ${v.v} m/s tepat merata di atas genteng (sementara sejenak diam asri di plafon rumah $v=0$). Jika massa jenis udara hampa $1,2$ kg/m³, berapakah total beban material atap dan strukturnya yang dipaksa lepas dari rumah itu? ($g=10$)`,
        optionsTemplate: (v, c) => [`${c.toLocaleString()} kg`, `${Math.round(c * 1.5).toLocaleString()} kg`, `${Math.round(c * 0.5).toLocaleString()} kg`, `100 kg`],
        correctTemplate: (v) => Math.round((0.5 * 1.2 * v.v ** 2 * v.A1) / 10),
        explanationTemplate: (v, c) => `Gaya angkat Bernoulli: $F = \\frac{1}{2} \\rho_{ud} v^2 A = 0,5 \\times 1,2 \\times ${v.v}^2 \\times ${v.A1}$ N. Konversi berat jadi beban struktur $m = F/g = ${c}$ kg!`,
        difficulty: "HARD", tags: ["KONTEKSTUAL", "BERNOULLI"], skillSlug: "hukum-bernoulli", unitSlug: "fluida-dinamis"
    },
    {
        template: (v) => `Tangki bocor raksasa diisi air setinggi ${v.h + 10} meter. Ada satu lubang pasak sempit di sisi dinding tangki persis di kedalaman ${v.h} meter dari permukaan riak air. Laju air bocor muncrat membentur tanah dalam lintasan parabola menakjubkan. Berapa Total Jarak pancaran Horisontal (X_max) sampai air sukses menjebol aspal?`,
        optionsTemplate: (v, c) => [`${c.toFixed(2)} m`, `${(c / 2).toFixed(2)} m`, `${(c * 1.5).toFixed(2)} m`, `${(Math.sqrt(c)).toFixed(2)} m`],
        correctTemplate: (v) => 2 * Math.sqrt(v.h * 10),
        explanationTemplate: (v, c) => `Rumus ajaib jangkauan Toricelli mutlak: $X_{maks} = 2 \\sqrt{h_{jatuh} \\times y_{dinding}}$. Jatuh cairan $h_1=${v.h}$, ke tanah $h_2 = 10$. Maka $x = 2\\sqrt{${v.h} \\times 10} = ${c}$ m.`,
        difficulty: "EXTREME", tags: ["UTBK", "TORICELLI"], skillSlug: "toricelli-venturi", unitSlug: "fluida-dinamis"
    },

    // UNIT 3: GELOMBANG
    {
        template: (v) => `Yang merambat atau berpindah dalam proses terjadinya "Gelombang Stasioner Mekanik" adalah...`,
        optionsTemplate: () => ["Energi getarannya", "Medium air/udaranya", "Ujung talinya", "Massa dari batunya"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Gelombang *HANYA PENGANTAR ENERGI*, bukan pemindah partikel zat secara harfiah total melintasi ruang!`,
        difficulty: "EASY", tags: ["LITERASI", "KONSEP"], skillSlug: "gelombang-mekanik", unitSlug: "gelombang"
    },
    {
        template: (v) => `Orang memukul drum di stadion. Bunyi ($\`v=340\`$ m/s) menggema merambat lalu terpantul tebing penonton raksasa sehingga terdengar pasca waktu ${v.n} sekon. Jarak posisi sakti tebing mantul ini adalah...`,
        optionsTemplate: (v, c) => [`${c} m`, `${c * 2} m`, `${c / 2} m`, `340 m`],
        correctTemplate: (v) => (340 * v.n) / 2,
        explanationTemplate: (v, c) => `Bunyi gema menempuh lintasan pergi & pulang bolak-balik. $s = (v \\times t) / 2 = 340 \\times ${v.n} / 2 = ${c}$ m.`,
        difficulty: "NORMAL", tags: ["NUMERASI", "BUNYI"], skillSlug: "gelombang-bunyi", unitSlug: "gelombang"
    },
    {
        template: (v) => `Sirine ambulans garang frekuensi ${v.f + 500} Hz melonjak bergerak tancap gas maju gesit dengan kecepatan ${v.v} m/s nekat membuntuti rombongan di depan pelarian. Karena kemacetan panjang, rombongan di depannya merapat pasrah tak bertenaga tiarap. Berapa nada pilu desing sirine yang ditangkap telinga supir depan? (Cepat Rambat Udara = 340 m/s)`,
        optionsTemplate: (v, c) => [`${c.toFixed(1)} Hz`, `${(v.f + 500).toFixed(1)} Hz`, `${(c * 0.8).toFixed(1)} Hz`, `${(c * 1.2).toFixed(1)} Hz`],
        correctTemplate: (v) => ((v.f + 500) * 340) / (340 - v.v),
        explanationTemplate: (v, c) => `Efek Doppler radikal pelarian: $f_P = f_S \\times (v \\pm v_P) / (v \\pm v_S)$. Pengamat diam $v_P=0$. Sumber mendekat (-/minus = $v_S$). Maka $f_p = ${(v.f + 500)} \\times 340 / (340 - ${v.v}) = ${c}$ Hz.`,
        difficulty: "HARD", tags: ["KONTEKSTUAL", "DOPPLER"], skillSlug: "gelombang-bunyi", unitSlug: "gelombang"
    },
    {
        template: (v) => `Sepasang celah ganda sejarak $d=0,${v.A1}$ mm disoroti Laser Intervensi Mutlak berfrekuensi gila $\\nu = ${v.f} \\times 10^{14}$ Hz. Pola terang lantas dilukis merambat merata dalam gelap gulita sejauh perwajahan layar ${v.A2 / 10} m. Carilah rentang celah interval orde dari celah terang ke-2 dan puncak gelap ke-3! ($c=3\\times 10^8$)`,
        optionsTemplate: (v, c) => [`${c.toFixed(4)} m`, `${(c * 2).toFixed(4)} m`, `${(c / 2).toFixed(4)} m`, `0 m`],
        correctTemplate: (v) => {
            let lambda = (3e8) / (v.f * 1e14);
            let d = v.A1 * 1e-3;
            let L = v.A2 / 10;
            // Interval yT2 ke yG3 adalah = setengah lambda / yG3 terletak di 2.5, yT2 terletak di 2.0. Jarak pinggang= 0.5 * delta Y
            return (0.5 * lambda * L) / d;
        },
        explanationTemplate: (v, c) => `Jarak terang orde ke-2 ke orde gelap ke-3 (yg terletak di antara T2 dan T3) bernilai genap persis MENGKOKOH setengah Lebar Fringe $\\frac{1}{2}y$. L= ${v.A2 / 10}m, $d=${v.A1}mm$. Jarak beda interval = ${c} meter.`,
        difficulty: "EXTREME", tags: ["UTBK", "CAHAYA"], skillSlug: "gelombang-cahaya", unitSlug: "gelombang"
    },

    // UNIT 4: SUHU & KALOR
    {
        template: (v) => `Besaran yang menyatakan derajat panas murni dinginnya keadaan energi suatu objek adalah...`,
        optionsTemplate: () => ["Suhu mutlak", "Kalor", "Energi Pembakaran", "Koefisien Muai"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Suhu menyatakan Derajat atau tingkat keadaan gerak molekular benda, sedangkan Kalor adalah energi yang BERPINDAH akibat perbedaan suhu itu.`,
        difficulty: "EASY", tags: ["LITERASI", "KONSEP"], skillSlug: "suhu-termometer", unitSlug: "suhu-kalor"
    },
    {
        template: (v) => `Rebus air bermassa ${v.m} kg agar mendidih butuh suplemen kalor sebuas... ($c = 4200$ J/kg°C; Suhu awal t = ${v.T1}°C hingga $100°\\text{C}$ air murni)`,
        optionsTemplate: (v, c) => [`${c.toLocaleString()} J`, `${Math.round(c / 2).toLocaleString()} J`, `${Math.round(c * 1.5).toLocaleString()} J`, `100.000 J`],
        correctTemplate: (v) => v.m * 4200 * (100 - v.T1),
        explanationTemplate: (v, c) => `$Q = m c \\Delta T$. Massa ${v.m} dikali kalor jenis air 4200 dan selisih rentang panas $(100 - ${v.T1})$. Kalor buas dikonsumsi = ${c} J.`,
        difficulty: "NORMAL", tags: ["NUMERASI", "KALOR"], skillSlug: "kalor-asas-black", unitSlug: "suhu-kalor"
    },
    {
        template: (v) => `Sebatang balok alumunium silang tebal ($k=200$ W/mK) mendadak diledakkan salah satu sisi kirinya dengan lava pijar $500^\\circ\\text{C}$ sementara ujung kanannya mati celup beku kaku di balok Es $0^\\circ\\text{C}$. Rentangnya ${v.h} meter padat dan melintang silang luas $0,${v.A1}$ m². Laju lahar hantaran kalor Konduksi bengis detik demi detik per rambat adalah...`,
        optionsTemplate: (v, c) => [`${c.toLocaleString()} W`, `${Math.round(c * 2).toLocaleString()} W`, `${Math.round(c / 2).toLocaleString()} W`, `50.000 W`],
        correctTemplate: (v) => Math.round((200 * (v.A1 / 10) * 500) / v.h),
        explanationTemplate: (v, c) => `$Laju Hantaran (H) = \\frac{k \\cdot A \\cdot \\Delta T}{L}$. Laju ganas = $200 \\times ${(v.A1 / 10)} \\times 500 / ${v.h} = ${c}$ Watt menyeduh udara!`,
        difficulty: "HARD", tags: ["KONTEKSTUAL", "KONDUKSI"], skillSlug: "perpindahan-kalor", unitSlug: "suhu-kalor"
    },
    {
        template: (v) => `Secangkir seram air teh keramat $200$ gram ($C=1$ kal/g°C) bergolak uap $90^\\circ\\text{C}$ diceburin sebongkah es brutal merayap massanya ${v.m * 10} gram tepat di kutub bersuhu ekstrem $-10^\\circ\\text{C}$. Jika $C_{es}=0,5$ kal/g°C dan L=80 kal/g. Apakah suhu akhir takdir sejuk campurannya?`,
        optionsTemplate: (v, c) => [`${c.toFixed(2)}^\\circ\\text{C}`, `${(c + 20).toFixed(2)}^\\circ\\text{C}`, `0^\\circ\\text{C} murni`, `100^\\circ\\text{C} murni`],
        correctTemplate: (v) => {
            let lepas = 200 * 1 * 90; // 18000
            let terimaEsLeleh = (v.m * 10) * 0.5 * 10 + (v.m * 10) * 80; // energy fully melt
            if (lepas < terimaEsLeleh) return 0; // if it can't even melt all the ice
            // Q lepas = Q terima
            // 200*1*(90-T) = terimaEsLeleh + m_es*1*(T-0) -> T = ...
            let temp = (lepas - terimaEsLeleh) / (200 + (v.m * 10));
            return temp < 0 ? 0 : temp;
        },
        explanationTemplate: (v, c) => `Pondasi ASAS BLACK sakti: Total Q_Lepas = Total Q_Terima. Cangkir es seram melemah menelan kalor (pemanasan dan LEBUR) sisanya diseduh bersinergi sisa air panas mendulang Kesetaraan Thermal Asas Black. Suhu kompromi murtad = ${c.toFixed(2)}^\\circ\\text{C}!`,
        difficulty: "EXTREME", tags: ["UTBK", "ASAS BLACK"], skillSlug: "kalor-asas-black", unitSlug: "suhu-kalor"
    },

    // UNIT 5: TERMODINAMIKA
    {
        template: (v) => `Apa pedoman Hukum I Termodinamika itu sejatinya?`,
        optionsTemplate: () => ["Kekekalan murni Energi sistem alam", "Energi dapat dimusnahkan oleh alien", "Mesin dapat efisien absolut 100%", "Gas selalu memuai kalau ditekan keras"],
        correctTemplate: () => 0,
        explanationTemplate: () => `Hukum Pertama Termo tak lain adalah terjemahan Hukum Kekekalan Energi: $\\Delta U = Q - W$. Energi dilarang musnah atau diciptakan, ia mutlak kekal hanya bertransformasi posisi & rupa.`,
        difficulty: "EASY", tags: ["LITERASI", "KONSEP"], skillSlug: "hukum-1-termodinamika", unitSlug: "termodinamika"
    },
    {
        template: (v) => `Mesin turbo jet gas mulia melakukan manuver ekspansi mengamuk isobarik rileks konstan $P = 1,${v.n} \\times 10^5$ Pa dari tangki lapang volume awal ${v.A1} Liter mendesak jadi ${v.A2} Liter. Usaha sang pendorong kejam itu adalah senilai beringas...`,
        optionsTemplate: (v, c) => [`${c.toLocaleString()} J`, `${Math.round(c * 1.5).toLocaleString()} J`, `${Math.round(c / 2).toLocaleString()} J`, `1000 J`],
        correctTemplate: (v) => Math.round((1 + v.n / 10) * 1e5 * ((v.A2 - v.A1) * 1e-3)),
        explanationTemplate: (v, c) => `$W = P \\times (V_2 - V_1)$. Pastikan Konversi gahar Liter ke $m^3$ dibagi seribu. $W_{beringas} = ${c} J$.`,
        difficulty: "NORMAL", tags: ["NUMERASI", "USAHA"], skillSlug: "proses-termodinamika", unitSlug: "termodinamika"
    },
    {
        template: (v) => `Mesin Carnot memamerkan taring pamer menyerap buas kawah sirkuit $1.000$ Joule dari tungku membara $T_H = 800\\text{ K}$ dan loyo pasrah mendesah memuntahkan ampasnya ke knalpot sejuk $T_C = ${v.T2}\\text{ K}$. Efisiensi mutlak tirani mesin itu beserta nominal Usaha nyatanya adalah...`,
        optionsTemplate: (v, c) => [
            `Efisiensi ${100 - Math.round(v.T2 / 8)}%, Usaha ${Math.round(1000 * (1 - v.T2 / 800))} J`,
            `Efisiensi 50%, Usaha 500 J`,
            `Efisiensi ${Math.round(v.T2 / 8)}%, Usaha ${Math.round(1000 * (v.T2 / 800))} J`,
            `Efisiensi 100%, Usaha 1000 J`
        ],
        correctTemplate: (v) => 0, // Placeholder
        explanationTemplate: (v, c) => `Efisiensi Absolut Carnot $\\eta = 1 - (T_C / T_H) = 1 - (${v.T2}/800)$. Usaha kasta W = $\\eta \\times Q_{High}$.`,
        difficulty: "HARD", tags: ["KONTEKSTUAL", "CARNOT"], skillSlug: "hukum-2-carnot", unitSlug: "termodinamika"
    },
    {
        template: (v) => `Siklus termodinamika tertutup kompleks gas DIATOMIK ($\\'gamma\\' = 1,4$) ditekan mampat dalam rupa kompresi Adiabatik buta akselerasi kilat tanpa izin pertukaran Kalor! Volume terpancung $V_1 = ${v.A2}$ m³ meleyot remuk menjadi $V_2 = ${v.A1}$ m³. Memiliki tebusan awalan rileks menampung suhu kamar persis $27^\\circ\\text{C}$! Hitung tebusan mendidih Temperatur Akhir pasca-kejutan maut adiabatik mutlak ini!`,
        optionsTemplate: (v, c) => [`${c.toFixed(2)} K`, `${(c - 200).toFixed(2)} K`, `${(c * 1.5).toFixed(2)} K`, `300 K`],
        correctTemplate: (v) => 300 * Math.pow((v.A2 / v.A1), (1.4 - 1)),
        explanationTemplate: (v, c) => `Hukum murni Kompresi Paksa racikan Adiabatik buta: $T_1 V_1^{\\gamma - 1} = T_2 V_2^{\\gamma - 1}$. Suhu pasca-kejutan gila memuncak tragis sebuas seram $T_{akhir} = ${c} K$ akibat efek jepit partikel tanpa ampun beralas $f=5$.`,
        difficulty: "EXTREME", tags: ["UTBK", "ADIABATIK"], skillSlug: "proses-termodinamika", unitSlug: "termodinamika"
    }
];

export function generateAllQuestions() {
    const allQuestions: any[] = [];
    for (const template of templates) {
        const variants = generateVariants(template, 25); // 25 variant for each tier x 20 = 500 questions
        allQuestions.push(...variants);
    }
    return allQuestions;
}
