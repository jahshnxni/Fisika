
export type League = {
    name: string;
    minXp: number;
    color: string;
    description: string;
    icon: string; // Emoji fallback
};

export const LEAGUES: League[] = [
    { name: "Meteor", minXp: 0, color: "#94a3b8", description: "Awal mula perjalanan.", icon: "🪨" },
    { name: "Komet", minXp: 500, color: "#38bdf8", description: "Meluncur dengan kecepatan.", icon: "☄️" },
    { name: "Planet", minXp: 1500, color: "#4ade80", description: "Memiliki orbit sendiri.", icon: "🌍" },
    { name: "Bintang", minXp: 3000, color: "#facc15", description: "Bersinar terang.", icon: "⭐" },
    { name: "Nebula", minXp: 5000, color: "#c084fc", description: "Tempat lahirnya bintang.", icon: "🌌" },
    { name: "Supernova", minXp: 8000, color: "#f97316", description: "Ledakan energi dahsyat.", icon: "💥" },
    { name: "Black Hole", minXp: 12000, color: "#1e293b", description: "Gravitasi tak terlawan.", icon: "⚫" },
    { name: "Pulsar", minXp: 17000, color: "#22d3ee", description: "Berputar sangat cepat.", icon: "💠" },
    { name: "Multiverse", minXp: 25000, color: "#e879f9", description: "Melampaui satu alam semesta.", icon: "🌀" },
    { name: "Legend Fisika", minXp: 40000, color: "#ffd700", description: "Dewa Fisika Sesungguhnya.", icon: "👑" },
];

export function getLeague(xp: number): League {
    // Reverse find to get highest matching league
    return LEAGUES.slice().reverse().find(l => xp >= l.minXp) || LEAGUES[0];
}

export function getNextLeague(xp: number): League | null {
    return LEAGUES.find(l => l.minXp > xp) || null;
}

export function getVerifiedColor(leagueName: string): string {
    switch (leagueName) {
        case "Legend Fisika": return "url(#rainbowGradient)"; // Special handling likely needed in SVG
        case "Multiverse": return "#e879f9";
        case "Pulsar": return "#22d3ee";
        case "Black Hole": return "#000000"; // Might need white border
        case "Supernova": return "#f97316";
        case "Nebula": return "#c084fc";
        case "Bintang": return "#facc15";
        case "Planet": return "#4ade80";
        case "Komet": return "#38bdf8";
        default: return "#94a3b8";
    }
}
