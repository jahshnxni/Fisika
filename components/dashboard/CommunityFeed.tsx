"use client";

import { Trophy, Users, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentActivities, getLeaderboard } from "@/lib/activity";

type Activity = {
    id: string;
    type: string;
    details: string;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
};

type LeaderboardUser = {
    id: string;
    name: string | null;
    image: string | null;
    xp: number;
    streak: number;
};

const CommunityFeed = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [recentActs, topUsers] = await Promise.all([
                getRecentActivities(),
                getLeaderboard()
            ]);
            setActivities(recentActs as any);
            setLeaderboard(topUsers);
        } catch (error) {
            console.error("Error fetching community data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s for "real-time" feel
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds} detik lalu`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit lalu`;
        const hours = Math.floor(minutes / 60);
        return `${hours} jam lalu`;
    };

    const getActivityText = (type: string) => {
        switch (type) {
            case "LESSON_COMPLETE": return "menyelesaikan";
            case "DRILL_PERFECT": return "sempurna di";
            case "LEVEL_UP": return "naik ke";
            case "BADGE_EARNED": return "meraih";
            case "LOGIN_STREAK": return "memperpanjang streak";
            default: return "melakukan";
        }
    };

    const getAvatarColor = (index: number) => {
        const colors = ["bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-8">
            {/* Community Updates */}
            <div className="p-6 bg-cosmic-900/40 backdrop-blur border border-white/5 rounded-2xl min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Umpan Komunitas
                    </h3>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {activities.length === 0 && !loading ? (
                        <p className="text-slate-500 text-sm text-center py-4">Belum ada aktivitas baru.</p>
                    ) : (
                        activities.map((item, idx) => (
                            <div key={item.id} className="flex gap-3 items-start p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(idx)} flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-lg shrink-0`}>
                                    {item.user.image ? (
                                        <img src={item.user.image} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-bold">{item.user.name?.[0] || "?"}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200">
                                        <span className="font-bold text-white hover:underline">{item.user.name || "User"}</span> {getActivityText(item.type)} <span className="text-accent font-bold">{item.details}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        {formatTime(item.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Live Leaderboard */}
            <div className="p-6 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur border border-indigo-500/20 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Peringkat Global
                    </h3>
                </div>

                <div className="space-y-3">
                    {leaderboard.length === 0 && !loading ? (
                        <p className="text-slate-500 text-sm text-center py-4">Jadilah yang pertama di leaderboard!</p>
                    ) : (
                        leaderboard.map((user, idx) => (
                            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded-full ${idx === 0 ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                    {idx + 1}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-cosmic-800 flex items-center justify-center overflow-hidden border border-white/10">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-white">{user.name?.[0] || "?"}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{user.name || "User Tanpa Nama"}</p>
                                    <p className="text-[10px] text-slate-400">🔥 Streak {user.streak}</p>
                                </div>
                                <div className="text-xs font-mono text-indigo-300 font-bold whitespace-nowrap">
                                    {user.xp} XP
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;
