"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User, LogOut, Zap, Heart, Target } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { icon: Home, label: "Beranda", href: "/learn" },
        { icon: BookOpen, label: "Materi", href: "/learn" },
        { icon: Target, label: "Drill Soal", href: "/drill" },
        { icon: Trophy, label: "Pencapaian", href: "/profile" },
        { icon: User, label: "Profil", href: "/profile" },
    ];

    // Dummy data if session not loaded yet
    const xp = 1250;
    const hearts = 5;

    // Hide sidebar on public pages
    const publicPaths = ["/", "/login", "/register"];
    if (publicPaths.includes(pathname)) {
        return null;
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-cosmic-950 border-r border-cosmic-800 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent animate-pulse-slow"></div>
                <span className="hidden lg:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tighter">
                    Physica
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-cosmic-800/50 border border-cosmic-700 text-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                                    : "text-slate-400 hover:text-white hover:bg-cosmic-800/30"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "animate-bounce")} />
                            <span className="hidden lg:block font-medium tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Gamification Stats (Mobile safe) */}
            <div className="px-4 py-6 border-t border-cosmic-800 space-y-4">
                <div className="hidden lg:flex items-center justify-between p-3 bg-cosmic-900 rounded-lg border border-cosmic-800">
                    <div className="flex items-center gap-2 text-warning">
                        <Zap className="w-5 h-5 fill-current" />
                        <span className="font-bold font-mono">{xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-danger">
                        <Heart className="w-5 h-5 fill-current" />
                        <span className="font-bold font-mono">{hearts}</span>
                    </div>
                </div>

                {/* User & Logout */}
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
                        {/* Placeholder Avatar */}
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="User" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                                {session?.user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div className="hidden lg:block flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Guest"}</p>
                        <p className="text-xs text-slate-500 truncate">{session?.user?.email || "Belum Login"}</p>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 text-slate-400 hover:text-danger transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
