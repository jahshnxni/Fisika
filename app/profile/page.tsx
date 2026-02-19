import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Zap, Heart, Flame, Shield, Award, Edit2, Share2, Target, Lock } from "lucide-react";
import { Suspense } from "react";
import CanvasWrapper from "@/components/3d/CanvasWrapper";
import SceneLights from "@/components/3d/SceneLights";
import JuniorPhysicist from "@/components/3d/JuniorPhysicist";
import PetRenderer from "@/components/3d/PetRenderer";
import { getLeague, getNextLeague, LEAGUES } from "@/lib/gamification";
import LeagueBadge from "@/components/gamification/LeagueBadge";
import VerifiedBadge from "@/components/gamification/VerifiedBadge";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    const activityCount = await prisma.activity.count({
        where: { userId: user.id }
    });

    const drillAttemptCount = await prisma.drillAttempt.count({
        where: { userId: user.id }
    });

    const drillStats = await prisma.drillAttempt.aggregate({
        where: { userId: user.id },
        _sum: {
            total: true,
            score: true,
        }
    });

    const totalQuestionsAnswered = drillStats._sum.total || 0;
    const totalCorrect = drillStats._sum.score || 0;
    const accuracy = totalQuestionsAnswered > 0
        ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
        : 0;

    const studyHours = Math.max(0, Math.floor(activityCount * 0.25)); // Avoid negative, though unlikely

    const higherRankUsers = await prisma.user.count({
        where: { xp: { gt: user.xp } }
    });
    const rank = higherRankUsers + 1;

    const level = Math.floor(user.xp / 100) + 1;
    const xpInLevel = user.xp % 100;
    const nextLevelXp = 100;

    // --- League Calculation ---
    const league = getLeague(user.xp);
    const nextLeague = getNextLeague(user.xp);
    const progressToNextLeague = nextLeague
        ? ((user.xp - league.minXp) / (nextLeague.minXp - league.minXp)) * 100
        : 100;

    const isLegend = league.name === "Legend Fisika";


    // --- Badge Unlocking Logic ---
    const hasPerfectDrill = await prisma.activity.findFirst({
        where: { userId: user.id, type: "DRILL_PERFECT" }
    });

    const fluidaDrills = await prisma.drillAttempt.count({
        where: { userId: user.id, unitSlug: { contains: "fluida" } }
    });

    const badges = [
        { name: "Pelajar Baru", desc: "Daftar akun pertama kali", unlocked: true, icon: "🎓" },
        { name: "Ahli Fluida", desc: "Selesaikan Latihan Fluida", unlocked: fluidaDrills > 0, icon: "💧" },
        { name: "Sempurna", desc: "100% Benar di Latihan", unlocked: !!hasPerfectDrill, icon: "🎯" },
        { name: "Semangat 7 Hari", desc: "Streak 7 hari berturut-turut", unlocked: user.streak >= 7, icon: "🔥" },
        { name: "Master Fisika", desc: "Capai Level 10", unlocked: level >= 10, icon: "⚛️" },
        { name: "Raja Drill", desc: "50x Latihan Soal", unlocked: drillAttemptCount >= 50, icon: "⚔️" },
    ];

    // --- Mega-Project: 3D Character Data ---
    // Safe fetch for cosmetics (might fail if DB not synced/restarted)
    let cosmetics = null;
    try {
        cosmetics = await prisma.userCosmetics.findUnique({
            where: { userId: user.id },
            include: { pets: true }
        });
    } catch (e) {
        console.warn("UserCosmetics table not found or accessible yet.");
    }

    const currentSkin = cosmetics?.currentSkin || "default_junior";

    // Find active pet if any
    const activePetId = cosmetics?.currentPetId;
    const activePet = cosmetics?.pets.find(p => p.id === activePetId);
    const petType = activePet?.petId || null; // e.g. "pet_aquabot"


    return (
        <div className="pb-24 space-y-8">
            {/* Profile Header / Banner with Galaxy Theme */}
            <div className={`relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-1000 ${isLegend ? 'bg-gradient-to-br from-yellow-900 via-cosmic-950 to-purple-900' : 'bg-gradient-to-br from-indigo-900 to-cosmic-900'}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div
                    className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full -mr-20 -mt-20 opacity-50 transition-colors duration-1000"
                    style={{ backgroundColor: league.color }}
                />

                <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center gap-8">

                    {/* 3D CHARACTER SCENE (Replaces Avatar Ring) */}
                    <div className="relative group w-64 h-64 md:w-80 md:h-80 shrink-0">
                        {/* Border/Glow */}
                        <div className="absolute inset-0 rounded-full bg-cosmic-950/50 blur-xl"></div>

                        {/* 3D Canvas */}
                        <div className="w-full h-full relative z-10">
                            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">Loading 3D...</div>}>
                                <CanvasWrapper cameraPosition={[0, 0.5, 4.5]} fov={50}>
                                    <SceneLights />
                                    <JuniorPhysicist skin={currentSkin} action="wave" />
                                    {petType && (
                                        <group position={[1.2, -0.2, 0.5]}>
                                            <PetRenderer type={petType} action="wave" />
                                        </group>
                                    )}
                                </CanvasWrapper>
                            </Suspense>
                        </div>

                        {/* League Badge Overlay */}
                        <div className="absolute -bottom-2 right-10 z-20">
                            <LeagueBadge league={league} size="md" />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                            {user.name || "Pencari Ilmu"}
                            <VerifiedBadge league={league} />
                        </h1>
                        <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">{user.email}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-primary font-medium">Bergabung {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                        </p>

                        {/* Current Skin/Pet Info */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs">
                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300">
                                Skin: <span className="text-white font-bold">{currentSkin.replace('skin_', '').toUpperCase()}</span>
                            </span>
                            {petType && (
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300">
                                    Pet: <span className="text-accent font-bold">{activePet?.name || petType.replace('pet_', '').toUpperCase()}</span>
                                    <span className="ml-1 text-slate-500">(Lvl {activePet?.level || 1})</span>
                                </span>
                            )}
                        </div>

                        {/* XP Bar & League Progress */}
                        <div className="mt-6 max-w-lg">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="" style={{ color: league.color }}>{league.name}</span>
                                {nextLeague ? (
                                    <span className="text-slate-400">Menuju <span style={{ color: nextLeague.color }}>{nextLeague.name}</span> ({Math.floor(nextLeague.minXp - user.xp)} XP lagi)</span>
                                ) : (
                                    <span className="text-yellow-400 animate-pulse">MAX LEVEL REACHED</span>
                                )}
                            </div>
                            <div className="h-4 w-full bg-cosmic-950 rounded-full overflow-hidden border border-white/10 relative">
                                <div
                                    className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-1000 relative overflow-hidden"
                                    style={{ width: `${progressToNextLeague}%`, background: `linear-gradient(90deg, ${league.color}, ${nextLeague?.color || league.color})` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shine_2s_infinite]"></div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-center text-slate-500 font-mono">
                                Total XP: {user.xp.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Link href="/settings" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white" title="Edit Profil">
                            <Edit2 className="w-5 h-5" />
                        </Link>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white" title="Bagikan Profil">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total XP", value: user.xp.toLocaleString(), icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                    { label: "Streak Hari", value: user.streak, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                    { label: "Latihan Selesai", value: drillAttemptCount, icon: Target, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
                    { label: "Liga Saat Ini", value: league.name, icon: Trophy, style: { color: league.color, borderColor: league.color } } // Use new league color
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border backdrop-blur-sm flex flex-col items-center justify-center text-center gap-2 transition-transform hover:-translate-y-1`} style={stat.style ? { borderColor: `${league.color}30`, backgroundColor: `${league.color}10` } : {}}>
                        <stat.icon className={`w-8 h-8 mb-1`} style={{ color: stat.style ? league.color : undefined }} />
                        <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Content Split: Badges & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Badges Section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* League Progression Badges */}
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            Progression Liga
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {LEAGUES.map((l, idx) => {
                                const isUnlocked = user.xp >= l.minXp;
                                const isCurrent = league.name === l.name;

                                return (
                                    <div key={idx} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-center gap-2 border transition-all relative group overflow-hidden ${isUnlocked
                                        ? `bg-cosmic-900/40 border-white/10 hover:border-[${l.color}]`
                                        : 'bg-cosmic-950/30 border-white/5 opacity-40 grayscale'
                                        }`} style={isUnlocked ? { borderColor: isCurrent ? l.color : undefined } : {}}>

                                        {isCurrent && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}

                                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                                            <LeagueBadge league={l} size="sm" />
                                        </div>

                                        <div className="z-10">
                                            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isUnlocked ? l.color : '#64748b' }}>
                                                {l.name}
                                            </div>
                                            {isUnlocked && <div className="text-[9px] text-slate-500">Unlocked</div>}
                                            {!isUnlocked && <div className="text-[9px] text-slate-600 flex items-center justify-center gap-1"><Lock className="w-2 h-2" /> {l.minXp} XP</div>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Achievement Badges */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-400" />
                                Pencapaian Khusus
                            </h2>
                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                                {badges.filter(b => b.unlocked).length} / {badges.length} Terbuka
                            </span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {badges.map((badge, idx) => (
                                <div key={idx} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center gap-2 border transition-all ${badge.unlocked
                                    ? 'bg-gradient-to-br from-cosmic-800 to-cosmic-900 border-purple-500/30 shadow-lg shadow-purple-500/5 hover:border-purple-500/60 cursor-pointer'
                                    : 'bg-cosmic-950/50 border-white/5 opacity-50 grayscale'
                                    }`}>
                                    <div className="text-3xl mb-1">{badge.icon}</div>
                                    <div className="text-[10px] font-bold leading-tight">{badge.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Mini Feed (Different from Dashboard) */}
                <div className="bg-cosmic-900/40 border border-white/5 rounded-2xl p-6 h-fit">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        Statistik Tempur
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">Total Soal Dijawab</span>
                            <span className="font-bold text-white">{totalQuestionsAnswered}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">Akurasi Rata-rata</span>
                            <span className={`font-bold ${accuracy >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">Jam Belajar</span>
                            <span className="font-bold text-white">{studyHours} Jam</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">Rank GlobaI</span>
                            <span className="font-bold text-yellow-500">#{rank}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
