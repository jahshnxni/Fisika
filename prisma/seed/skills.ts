import { SkillData } from './units';

export const SKILLS: SkillData[] = [
    // --- UNIT 1: FLUIDA STATIS ---
    { title: "Tekanan Hidrostatis", slug: "tekanan-hidrostatis", description: "Mengapa bendungan dibuat tebal di bawah?", order: 1, unitSlug: "fluida-statis" },
    { title: "Hukum Pascal", slug: "hukum-pascal", description: "Prinsip di balik rem hidrolik dan dongkrak mobil.", order: 2, unitSlug: "fluida-statis" },
    { title: "Hukum Archimedes", slug: "hukum-archimedes", description: "Mengapa kapal baja bisa terapung?", order: 3, unitSlug: "fluida-statis" },

    // --- UNIT 2: FLUIDA DINAMIS ---
    { title: "Debit & Kontinuitas", slug: "debit-kontinuitas", description: "Aliran fluida dan hukum kekekalan massa.", order: 1, unitSlug: "fluida-dinamis" },
    { title: "Hukum Bernoulli", slug: "hukum-bernoulli", description: "Rahasia pesawat terbang dan parfum semprot.", order: 2, unitSlug: "fluida-dinamis" },
    { title: "Toricelli & Venturimeter", slug: "toricelli-venturi", description: "Kecepatan air keluar lubang dan pengukur kecepatan aliran.", order: 3, unitSlug: "fluida-dinamis" },
    { title: "Aerodinamika", slug: "aerodinamika", description: "Prinsip Bernoulli pada sayap pesawat, gaya angkat, dan angin.", order: 4, unitSlug: "fluida-dinamis" },

    // --- UNIT 3: GELOMBANG ---
    { title: "Gelombang Mekanik", slug: "gelombang-mekanik", description: "Gelombang transversal dan longitudinal.", order: 1, unitSlug: "gelombang" },
    { title: "Gelombang Bunyi", slug: "gelombang-bunyi", description: "Frekuensi, resonansi, dan efek Doppler.", order: 2, unitSlug: "gelombang" },
    { title: "Gelombang Cahaya", slug: "gelombang-cahaya", description: "Interferensi, difraksi, dan polarisasi.", order: 3, unitSlug: "gelombang" },

    // --- UNIT 4: SUHU & KALOR ---
    { title: "Suhu & Termometer", slug: "suhu-termometer", description: "Skala suhu dan cara mengukurnya.", order: 1, unitSlug: "suhu-kalor" },
    { title: "Pemuaian", slug: "pemuaian", description: "Benda memuai saat dipanaskan.", order: 2, unitSlug: "suhu-kalor" },
    { title: "Kalor & Asas Black", slug: "kalor-asas-black", description: "Energi panas dan kesetimbangan termal.", order: 3, unitSlug: "suhu-kalor" },
    { title: "Perpindahan Kalor", slug: "perpindahan-kalor", description: "Konduksi, konveksi, dan radiasi.", order: 4, unitSlug: "suhu-kalor" },

    // --- UNIT 5: TERMODINAMIKA ---
    { title: "Hukum I Termodinamika", slug: "hukum-1-termodinamika", description: "Kekekalan energi dalam sistem termodinamika.", order: 1, unitSlug: "termodinamika" },
    { title: "Proses Termodinamika", slug: "proses-termodinamika", description: "Isotermal, isobarik, isokhorik, dan adiabatik.", order: 2, unitSlug: "termodinamika" },
    { title: "Hukum II & Siklus Carnot", slug: "hukum-2-carnot", description: "Entropi dan efisiensi mesin kalor.", order: 3, unitSlug: "termodinamika" },
];
