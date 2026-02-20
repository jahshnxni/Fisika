"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Atom, Zap, Globe, Sparkles, Star, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import StarryBackground from "@/components/ui/StarryBackground";

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-cosmic-950 text-white selection:bg-primary/30 selection:text-white">
            <StarryBackground />

            {/* Sci-Fi Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none"></div>

            {/* Mouse Halo */}
            {mounted && (
                <div
                    className="fixed w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out will-change-transform mix-blend-screen"
                    style={{ left: mousePosition.x, top: mousePosition.y }}
                ></div>
            )}

            {/* Floating Debris / Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/10 rounded-full"
                        initial={{
                            x: Math.random() * 1000,
                            y: Math.random() * 1000,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: Math.random() * 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [null, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: Math.random() * 4 + 1 + "px",
                            height: Math.random() * 4 + 1 + "px",
                            left: Math.random() * 100 + "%",
                            top: Math.random() * 100 + "%",
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 flex-1 flex items-center justify-center relative z-10 w-full pt-20 lg:pt-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full max-w-7xl">

                    {/* Left Column: Content */}
                    <div className="space-y-8 text-center lg:text-left relative">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cosmic-800/80 border border-primary/30 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-primary/50 transition-all cursor-default group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            <span className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-300 to-accent tracking-wide uppercase">
                                Revolusi Belajar Fisika No. 1
                            </span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-2 relative"
                        >
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] relative z-20">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-sm">
                                    Physica
                                </span>
                                {/* Fixed Background Clip Text */}
                                <span
                                    className="block animate-aurora bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-[200%_auto] text-transparent filter drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] pb-4 md:pb-0"
                                    style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                                >
                                    Mastery
                                </span>
                            </h1>

                            {/* Decorative Blur behind title */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/10 blur-[100px] -z-10 rounded-full mix-blend-screen opacity-50"></div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Jelajahi alam semesta fisika dengan simulasi interaktif{" "}
                            <span className="relative inline-block group cursor-pointer mx-1">
                                <span className="absolute inset-0 bg-yellow-400/20 blur-lg group-hover:blur-xl transition-all rounded-full opacity-0 group-hover:opacity-100"></span>
                                <span className="relative font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 z-10" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                                    "God-Tier"
                                </span>
                            </span>
                            , materi mendalam, dan gamifikasi seru.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mt-10"
                        >
                            <Link href="/register" className="w-full sm:w-auto group">
                                <button className="w-full relative px-8 py-4 bg-transparent rounded-xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                                    {/* Button Glow Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-aurora opacity-100 bg-[200%_auto]"></div>
                                    <div className="absolute inset-[1px] bg-cosmic-900/90 rounded-[10px] z-0 backdrop-blur-sm group-hover:bg-cosmic-900/80 transition-colors"></div>

                                    {/* Content */}
                                    <span className="relative z-10 flex items-center justify-center gap-3 bg-gradient-to-r from-white to-white bg-clip-text text-transparent group-hover:text-white transition-colors">
                                        Mulai Petualangan <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                    </span>

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 z-20"></div>
                                </button>
                            </Link>

                            <Link href="/login" className="w-full sm:w-auto">
                                <button className="w-full px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-bold text-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all hover:border-white/20 flex items-center justify-center gap-2 group shadow-lg">
                                    <Rocket className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity group-hover:-translate-y-1 transform duration-300" />
                                    Masuk Akun
                                </button>
                            </Link>
                        </motion.div>

                        {/* Marquee Features (Mini) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="pt-10 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-mono text-slate-500"
                        >
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"><Globe className="w-3 h-3 text-blue-400" /> 500+ Simulasi</span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"><Atom className="w-3 h-3 text-purple-400" /> Materi Dalam</span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"><Zap className="w-3 h-3 text-yellow-400" /> Gamifikasi XP</span>
                        </motion.div>
                    </div>

                    {/* Right Column: Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:flex items-center justify-center h-[600px]"
                    >
                        {/* Central Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-primary/30 to-accent/10 rounded-full blur-[100px] animate-pulse-slow"></div>

                        {/* Main Orbit System */}
                        <div className="relative w-[500px] h-[500px] perspective-[1000px] pointer-events-none">
                            {/* Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white shadow-[0_0_100px_rgba(255,255,255,0.4)] rounded-full z-10 animate-float flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative overflow-hidden ring-1 ring-white/20">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                    <Atom className="w-20 h-20 text-white animate-spin-slow opacity-80" />
                                </div>
                            </div>

                            {/* Orbits */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-white/10"
                                style={{ transform: 'rotateX(70deg)' }}
                            >
                                <div className="absolute top-0 left-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan] -translate-x-1/2 -translate-y-1/2"></div>
                            </motion.div>

                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[50px] rounded-full border border-white/10 border-dashed"
                                style={{ transform: 'rotateY(70deg)' }}
                            >
                                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_15px_fuchsia] -translate-x-1/2 translate-y-1/2"></div>
                            </motion.div>

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[100px] rounded-full border border-white/5"
                            >
                                <div className="absolute top-1/2 right-0 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] translate-x-1/2 -translate-y-1/2"></div>
                            </motion.div>
                        </div>

                        {/* Floating Cards (Glassmorphism) */}
                        <motion.div
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-0 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-w-[200px] z-20 hover:scale-105 transition-transform"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white shadow-lg">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="font-bold text-sm bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Interaktif</div>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [20, -20, 20] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 left-0 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20 hover:scale-105 transition-transform"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg text-white shadow-lg">
                                    <Star className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">Gamifikasi</div>
                                    <div className="text-[10px] text-yellow-300 font-mono">+2000 XP</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 w-full text-center z-10 opacity-50">
                <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500">
                    PHYSICA MASTERY v0.4 • DESIGNED FOR THE FUTURE
                </span>
            </div>
        </div>
    );
}
