import { SkillData } from './units';

export const SKILLS: SkillData[] = [
    // --- UNIT 1: KINEMATIKA ---
    {
        title: "Pengukuran & Angka Penting",
        slug: "pengukuran-angka-penting",
        description: "Membaca mikrometer sekrup, jangka sorong, dan aturan angka penting.",
        order: 1,
        unitSlug: "kinematika"
    },
    {
        title: "Gerak Lurus & Relatif",
        slug: "gerak-lurus-relatif",
        description: "Analisis GLB, GLBB, grafik v-t, gerak relatif perahu, dan gerak vertikal roket air.",
        order: 2,
        unitSlug: "kinematika"
    },
    {
        title: "Gerak Parabola & Melingkar",
        slug: "gerak-parabola-melingkar",
        description: "Lintasan jump shot bola basket dan dinamika gerak lengkung dua dimensi.",
        order: 3,
        unitSlug: "kinematika"
    },

    // --- UNIT 2: DINAMIKA ---
    {
        title: "Hukum Newton & Gaya",
        slug: "hukum-newton-gaya",
        description: "Hukum kelembaman, resultan gaya 2D pada perahu nelayan di laut.",
        order: 1,
        unitSlug: "dinamika"
    },
    {
        title: "Momentum & Impuls",
        slug: "momentum-impuls",
        description: "Teorema impuls-momentum pada pukulan karateka pemecah hebel beton.",
        order: 2,
        unitSlug: "dinamika"
    },
    {
        title: "Dinamika Rotasi & Momen Inersia",
        slug: "dinamika-rotasi",
        description: "Torsi kunci pas pengencang baut, momen inersia batang, dan percepatan sudut.",
        order: 3,
        unitSlug: "dinamika"
    },

    // --- UNIT 3: FLUIDA ---
    {
        title: "Fluida Statis & Archimedes",
        slug: "fluida-statis",
        description: "Hukum Pascal kursi hidrolik dokter gigi dan tangki ballast kapal selam.",
        order: 1,
        unitSlug: "fluida"
    },
    {
        title: "Fluida Dinamis & Bernoulli",
        slug: "fluida-dinamis",
        description: "Persamaan kontinuitas dan prinsip gaya angkat aerodinamika sayap burung.",
        order: 2,
        unitSlug: "fluida"
    },

    // --- UNIT 4: GELOMBANG ---
    {
        title: "Gelombang Bunyi & Akustik",
        slug: "gelombang-bunyi",
        description: "Resonansi kolom udara pipa PVC organa terbuka/tertutup dan nada dasar.",
        order: 1,
        unitSlug: "gelombang"
    },
    {
        title: "Gelombang Cahaya & Alat Optik",
        slug: "gelombang-cahaya-optik",
        description: "Ilusi pembiasan fatamorgana lapangan panas dan koreksi mata hipermetropi.",
        order: 2,
        unitSlug: "gelombang"
    },

    // --- UNIT 5: KALOR DAN TERMODINAMIKA ---
    {
        title: "Kalor & Perpindahannya",
        slug: "kalor-perpindahan",
        description: "Eksperimen konduksi kalor batang logam, tetesan lilin, dan kontrol variabel.",
        order: 1,
        unitSlug: "kalor-termodinamika"
    },
    {
        title: "Pemanasan Global",
        slug: "pemanasan-global",
        description: "Keseimbangan radiasi termal bumi, emisi gas rumah kaca, dan anomali suhu kota.",
        order: 2,
        unitSlug: "kalor-termodinamika"
    },
    {
        title: "Teori Kinetik Gas Ideal",
        slug: "gas-ideal",
        description: "Hukum Boyle-Gay Lussac dan pemampatan silinder gas ideal bertekanan.",
        order: 3,
        unitSlug: "kalor-termodinamika"
    },
    {
        title: "Termodinamika & Siklus Carnot",
        slug: "termodinamika-carnot",
        description: "Usaha 4 proses termodinamika dan efisiensi penghematan kalor mesin.",
        order: 4,
        unitSlug: "kalor-termodinamika"
    },

    // --- UNIT 6: KELISTRIKAN ---
    {
        title: "Listrik Statis & Medan Listrik",
        slug: "listrik-statis",
        description: "Hukum Coulomb dan analisis titik medan listrik nol pada printer laser elektrostatik.",
        order: 1,
        unitSlug: "kelistrikan"
    },
    {
        title: "Rangkaian Arus Searah & Energi",
        slug: "rangkaian-dc-daya",
        description: "Hukum Ohm, modifikasi resistor seri-paralel, dan audit efisiensi tagihan listrik.",
        order: 2,
        unitSlug: "kelistrikan"
    },
    {
        title: "Kemagnetan & Gaya Lorentz",
        slug: "kemagnetan-lorentz",
        description: "Gaya Lorentz pada muatan bergerak, kaidah tangan kanan, lintasan siklotron, dan spektrometer massa.",
        order: 3,
        unitSlug: "kelistrikan"
    },
];
