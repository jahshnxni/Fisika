"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Zap, Heart, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getUserStats } from "@/lib/actions";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import EduCoin from "@/components/gamification/EduCoin";

const TopBar = React.memo(() => {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        xp: 0,
        hearts: 5,
        streak: 0,
        coins: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getUserStats();
            if (data) {
                setStats({
                    xp: data.xp,
                    hearts: data.hearts,
                    streak: data.streak,
                    coins: data.coins || 0
                });
            }
        };

        if (session) {
            fetchStats();
            // Optional: Poll every 30 seconds to keep in sync
            const interval = setInterval(fetchStats, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    return (
        <header className="h-20 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-cosmic-950/80 backdrop-blur-md border-b border-white/5">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium focus:w-full md:w-64 md:focus:w-full"
                    />
                </div>
            </div>

            {/* Right Side: Stats & Profile */}
            <div className="flex items-center gap-6">

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4">
                    {/* XP */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400" title="XP">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm">{stats.xp}</span>
                    </div>

                    {/* Hearts */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-400" title="Nyawa">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm">{stats.hearts}</span>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400" title="Streak Harian">
                        <Flame className="w-4 h-4 fill-current animate-pulse" />
                        <span className="font-bold text-sm">{stats.streak}</span>
                    </div>

                    {/* Coins */}
                    <Link href="/shop" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 transition-colors group" title="Edu-Coins">
                        <EduCoin className="w-5 h-5" />
                        <span className="font-bold text-sm text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{stats.coins.toLocaleString()}</span>
                    </Link>
                </div>

                {/* Notifications */}
                {session?.user && (session.user as any).id && (
                    <NotificationDropdown userId={(session.user as any).id} />
                )}

                {/* Profile Avatar */}
                <div className="ml-2 flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-white leading-tight">{session?.user?.name || "Tamu"}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pelajar</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px] shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-cosmic-900 overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session?.user?.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-cosmic-800">
                                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
});

TopBar.displayName = "TopBar";

export default TopBar;
