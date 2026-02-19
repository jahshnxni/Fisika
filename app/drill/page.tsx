import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, Target, Zap, Trophy, Flame } from "lucide-react";

export default async function DrillPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) redirect("/login");

    const units = await prisma.unit.findMany({
        orderBy: { order: "asc" },
        include: {
            _count: { select: { questions: true } },
        }
    });

    // Check unlock status for each unit (reusing same logic)
    const unitsWithStatus = await Promise.all(
        units.map(async (unit) => {
            const isUnlocked = unit.order <= 1 ? true : await checkUnlock(user.id, unit.order);
            const attempts = await prisma.drillAttempt.count({
                where: { userId: user.id, unitSlug: unit.slug }
            });
            const bestAttempt = await prisma.drillAttempt.findFirst({
                where: { userId: user.id, unitSlug: unit.slug },
                orderBy: { score: "desc" },
            });
            return { ...unit, isUnlocked, attempts, bestScore: bestAttempt?.score ?? 0, bestTotal: bestAttempt?.total ?? 0 };
        })
    );

    return (
        <div className="pb-24 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent inline-flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary" />
                        Arena Latihan
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-lg">
                        Asah kemampuan fisikamu dengan ribuan soal latihan. Raih skor sempurna untuk mendapatkan bonus XP!
                    </p>
                </div>

                {/* User Stats Summary for Drill */}
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-center px-2">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Total Latihan</div>
                        <div className="text-xl font-bold text-white font-mono">
                            {unitsWithStatus.reduce((acc, u) => acc + u.attempts, 0)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitsWithStatus.map((unit) => (
                    <div key={unit.id} className="relative group">
                        {unit.isUnlocked ? (
                            <Link href={`/drill/${unit.slug}`}>
                                <div className="h-full bg-cosmic-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-cosmic-800/60 hover:border-primary/30 shadow-lg hover:shadow-primary/5 flex flex-col justify-between group-hover:ring-1 ring-primary/20">

                                    {/* Icon & Title */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="space-y-2">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                {unit.icon || '📝'}
                                            </div>
                                            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{unit.title}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Zap className="w-3 h-3 text-yellow-500" />
                                                {unit._count.questions} Soal Tersedia
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats / Action */}
                                    <div className="border-t border-white/5 pt-4">
                                        {unit.attempts > 0 ? (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Skor Terbaik</p>
                                                    <p className="text-lg font-mono font-bold text-accent flex items-baseline gap-1">
                                                        {unit.bestScore}
                                                        <span className="text-xs text-slate-500 font-sans">/{unit.bestTotal}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Latihan</p>
                                                    <div className="flex items-center gap-1 text-slate-300 justify-end">
                                                        <Flame className="w-3 h-3 text-orange-500" />
                                                        <span className="font-bold">{unit.attempts}x</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold text-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                Mulai Latihan
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            // Locked State
                            <div className="h-full bg-cosmic-950/40 border border-white/5 rounded-2xl p-6 opacity-60 cursor-not-allowed relative overflow-hidden">
                                <div className="absolute inset-0 bg-cosmic-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-slate-700" />
                                </div>
                                <div className="flex items-start justify-between mb-6 opacity-50">
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl grayscale">
                                            {unit.icon || '📝'}
                                        </div>
                                        <h3 className="font-bold text-slate-400 text-lg leading-tight">{unit.title}</h3>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-4 opacity-50">
                                    <div className="text-xs text-slate-500 text-center">Terkunci</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

async function checkUnlock(userId: string, unitOrder: number): Promise<boolean> {
    if (unitOrder <= 1) return true;
    const previousUnit = await prisma.unit.findFirst({
        where: { order: unitOrder - 1 },
        include: { skills: { include: { lessons: true } } }
    });
    if (!previousUnit) return true;
    const allLessonIds = previousUnit.skills.flatMap(s => s.lessons.map(l => l.id));
    if (allLessonIds.length === 0) return true;
    const completed = await prisma.drillAttempt.count({
        where: { userId, unitSlug: previousUnit.slug }
    });
    return completed >= 1; // At least 1 drill attempt on previous unit
}
