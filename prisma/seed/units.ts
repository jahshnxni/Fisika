export const UNITS = [
    {
        title: "Unit 1: Kinematika",
        description: "Pengukuran presisi, gerak lurus GLB/GLBB, gerak relatif, dan lintasan parabola melingkar.",
        order: 1,
        slug: "kinematika",
        icon: "📏",
    },
    {
        title: "Unit 2: Dinamika",
        description: "Hukum Newton, resultan gaya 2D, momentum, impuls tumbukan, dan dinamika rotasi momen inersia.",
        order: 2,
        slug: "dinamika",
        icon: "⚡",
    },
    {
        title: "Unit 3: Fluida",
        description: "Prinsip fluida diam (Pascal & Archimedes) serta fluida dinamis (Bernoulli & gaya angkat aerodinamika).",
        order: 3,
        slug: "fluida",
        icon: "🌊",
    },
    {
        title: "Unit 4: Gelombang",
        description: "Karakteristik gelombang mekanik bunyi, pipa organa akustik, sifat cahaya, dan koreksi optik lensa.",
        order: 4,
        slug: "gelombang",
        icon: "🔊",
    },
    {
        title: "Unit 5: Kalor dan Termodinamika",
        description: "Perpindahan kalor konduksi, pemanasan global, gas ideal, dan efisiensi siklus termodinamika Carnot.",
        order: 5,
        slug: "kalor-termodinamika",
        icon: "🔥",
    },
    {
        title: "Unit 6: Kelistrikan",
        description: "Listrik statis & printer elektrostatis, serta rangkaian arus searah DC dan audit energi listrik rumah tangga.",
        order: 6,
        slug: "kelistrikan",
        icon: "⚡",
    },
];

export interface SkillData {
    title: string;
    slug: string;
    description: string;
    order: number;
    unitSlug: string;
}

export interface LessonData {
    title: string;
    slug: string;
    order: number;
    skillSlug: string;
    contentMdx: string;
}
