"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Trophy, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Card";

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    xpGained: number;
    level: number;
}

const LevelUpModal = ({ isOpen, onClose, xpGained, level }: LevelUpModalProps) => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <ReactConfetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.2}
                    />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="bg-cosmic-800 border-2 border-primary/50 rounded-2xl p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-primary blur-2xl opacity-50 rounded-full"></div>
                                <Trophy className="w-24 h-24 text-warning relative z-10 drop-shadow-lg" />
                            </motion.div>

                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-warning to-yellow-200 mb-2">
                                LEVEL UP!
                            </h2>
                            <p className="text-slate-300 mb-6">Kamu naik ke Level <span className="text-primary font-bold text-xl">{level}</span></p>

                            <div className="flex items-center gap-2 bg-cosmic-900/50 p-3 rounded-lg border border-cosmic-700 mb-8 w-full justify-center">
                                <Star className="w-5 h-5 text-warning fill-current" />
                                <span className="font-bold text-lg">+{xpGained} XP</span>
                            </div>

                            <Button
                                onClick={onClose}
                                className="w-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform font-bold text-lg py-4"
                            >
                                LANJUTKAN!
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LevelUpModal;
