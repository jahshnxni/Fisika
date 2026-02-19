export const UNITS = [
    {
        title: "Unit 1: Fluida Statis",
        description: "Menjelajahi misteri fluida diam, tekanan, dan hukum-hukumnya.",
        order: 1,
        slug: "fluida-statis",
        icon: "🌊",
    },
    {
        title: "Unit 2: Fluida Dinamis",
        description: "Rahasia fluida yang bergerak, dari debit hingga Bernoulli.",
        order: 2,
        slug: "fluida-dinamis",
        icon: "💨",
    },
    {
        title: "Unit 3: Gelombang",
        description: "Dunia gelombang mekanik, bunyi, dan cahaya.",
        order: 3,
        slug: "gelombang",
        icon: "🔊",
    },
    {
        title: "Unit 4: Suhu & Kalor",
        description: "Energi panas, pemuaian, dan perpindahan kalor.",
        order: 4,
        slug: "suhu-kalor",
        icon: "🔥",
    },
    {
        title: "Unit 5: Termodinamika",
        description: "Hukum-hukum yang mengatur energi dan mesin.",
        order: 5,
        slug: "termodinamika",
        icon: "⚙️",
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
