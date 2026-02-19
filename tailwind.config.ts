import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            colors: {
                cosmic: {
                    950: "#020617", // Deepest Space
                    900: "#0f172a", // Background Main
                    800: "#1e293b", // Card Background
                    700: "#334155", // Border
                },
                primary: {
                    DEFAULT: "#8b5cf6", // Violet Neon
                    hover: "#7c3aed",
                    glow: "rgba(139, 92, 246, 0.5)"
                },
                accent: {
                    DEFAULT: "#06b6d4", // Cyan Neon
                    hover: "#0891b2",
                    glow: "rgba(6, 182, 212, 0.5)"
                },
                success: {
                    DEFAULT: "#22c55e",
                    glow: "rgba(34, 197, 94, 0.5)"
                },
                warning: "#eab308",
                error: "#ef4444",
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
