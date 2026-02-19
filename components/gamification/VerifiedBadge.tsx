"use client";

import { League } from "@/lib/gamification";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifiedBadge({ league }: { league: League }) {
    const isLegend = league.name === "Legend Fisika";
    const isMultiverse = league.name === "Multiverse";

    // Legend gets a special rendered SVG
    if (isLegend) {
        return (
            <motion.div
                className="relative inline-block align-middle ml-1"
                whileHover={{ scale: 1.2 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="verifiedGold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FCD34D" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                    </defs>
                    <path d="M10.6026 3.01138C10.9892 2.30232 11.9687 2.27705 12.3925 2.96531L13.8425 5.32049C14.0042 5.58309 14.3168 5.71714 14.6146 5.65147L17.2847 5.06263C18.065 4.89052 18.7366 5.64168 18.4735 6.39343L17.5732 8.96557C17.4728 9.25244 17.5684 9.56947 17.8094 9.74836L19.9698 11.3521C20.6011 11.8208 20.5283 12.8016 19.8407 13.1444L17.4872 14.3179C17.2248 14.4487 17.0784 14.7397 17.1257 15.0366L17.5494 17.6979C17.6732 18.4754 16.9205 19.0718 16.2163 18.7543L13.806 17.6675C13.5372 17.5463 13.2267 17.6322 13.0396 17.8797L11.3621 20.0984C10.8719 20.7466 9.88219 20.6385 9.55342 19.9011L8.42841 17.3779C8.30294 17.0965 7.9893 16.9366 7.65384 16.983L4.64613 17.3985C3.76722 17.5199 3.09756 16.6346 3.42238 15.7818L4.53386 12.8637C4.65781 12.5383 4.52084 12.176 4.19566 12.0016L1.28014 10.4384C0.428169 9.98157 0.449755 8.74079 1.32051 8.30656L3.90561 7.01777C4.21528 6.86337 4.38202 6.51268 4.31724 6.17604L3.77888 3.37893C3.60946 2.49861 4.54452 1.81598 5.38555 2.19398L7.96205 3.35205C8.27111 3.49097 8.62921 3.40938 8.84705 3.14361L10.6026 3.01138Z" fill="url(#verifiedGold)" />
                    <path d="M9 12L11 14L15 10" stroke="#78350F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="inline-block align-middle ml-1"
            whileHover={{ scale: 1.1, rotate: 10 }}
        >
            <BadgeCheck
                className="w-5 h-5"
                style={{
                    color: isMultiverse ? "#e879f9" : league.color,
                    fill: isMultiverse ? "rgba(232, 121, 249, 0.2)" : "rgba(255,255,255,0.1)"
                }}
            />
        </motion.div>
    );
}
