"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Target, Users, ShoppingBag, Award, Settings, LogOut, User, Bot, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const Sidebar = React.memo(() => {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: "Kelas Saya", href: "/" },
        { icon: Sparkles, label: "Buat Course AI", href: "/spaces" },
        { icon: BookOpen, label: "Materi", href: "/learn" },
        { icon: Target, label: "Latihan", href: "/drill" },
        { icon: Bot, label: "AI Tutor", href: "/ai" },
        { icon: Users, label: "Komunitas", href: "/community" },
    ];

    const featureItems = [
        { icon: ShoppingBag, label: "Toko Avatar", href: "/shop", disabled: true },
        { icon: Award, label: "Sertifikasi", href: "/certificate", disabled: true },
    ];

    const bottomItems = [
        { icon: User, label: "Profil", href: "/profile" },
        { icon: Settings, label: "Pengaturan", href: "/settings" },
    ];

    return (
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-cosmic-950/80 backdrop-blur-xl border-r border-white/10 flex-col z-50 shadow-2xl">
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-xl font-black text-white">P</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        Physica
                    </span>
                    <span className="text-[10px] text-accent font-bold tracking-widest uppercase">Mastery</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">

                {/* Menu Section */}
                <div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-gradient-to-r from-primary/20 to-transparent text-white border-l-4 border-primary"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary fill-primary/20" : "group-hover:text-primary")} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Features Section */}
                <div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fitur</p>
                    <div className="space-y-1">
                        {featureItems.map((item) => (
                            <div
                                key={item.label}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-not-allowed opacity-50 relative",
                                    "text-slate-500 hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400 border border-slate-700">SOON</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Akun</p>
                    <div className="space-y-1">
                        {bottomItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "text-white bg-white/5"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}

                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group mt-2"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Keluar</span>
                        </button>
                    </div>
                </div>

            </nav>

        </aside>
    );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
