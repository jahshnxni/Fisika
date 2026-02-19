import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isUnitUnlocked, getUnitProgress } from "@/lib/progress";
import { Lock, CheckCircle, Star, ChevronRight, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default async function LearnPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    const units = await prisma.unit.findMany({
        include: {
            skills: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                        take: 1,
                    }
                }
            },
        },
        orderBy: { order: "asc" },
    });

    // Get unlock status and progress for each unit
    const unitsWithProgress = await Promise.all(
        units.map(async (unit) => {
            const unlocked = await isUnitUnlocked(user.id, unit.order);
            const progress = await getUnitProgress(user.id, unit.id);
            return { ...unit, unlocked, progress };
        })
    );

    return (
        <div className="space-y-12 pb-24">
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent inline-block">
                    Peta Penjelajahan Fisika
                </h1>
                <p className="text-slate-400">Selesaikan setiap planet materi untuk membuka galaksi berikutnya.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-24 relative">
                {/* Connection Line Background */}
                <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-primary via-purple-500/50 to-cosmic-900 -z-10 rounded-full hidden md:block" />

                {unitsWithProgress.map((unit: any, unitIndex: number) => (
                    <div key={unit.id} className="relative group">

                        {/* Unit Header / Card */}
                        <div className={`ml-0 md:ml-24 transition-all duration-500 transform ${unit.unlocked ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-60 grayscale'}`}>
                            <div className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${unit.unlocked
                                    ? 'bg-gradient-to-br from-cosmic-800/80 to-cosmic-900/80 border-white/10 shadow-lg shadow-primary/5 hover:border-primary/30'
                                    : 'bg-cosmic-900/50 border-white/5'
                                }`}>
                                {/* Decor */}
                                {unit.unlocked && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />}

                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-mono font-bold text-accent uppercase tracking-widest">Unit {unit.order}</span>
                                            {unit.unlocked && unit.progress?.lessonProgress === 100 && (
                                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/20 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Selesai
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">{unit.title}</h2>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">{unit.description}</p>

                                        {/* Progress Bar */}
                                        {unit.unlocked && (
                                            <div className="w-full bg-cosmic-950/50 rounded-full h-2 mb-2 overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                                    style={{ width: `${unit.progress?.lessonProgress || 0}%` }}
                                                />
                                            </div>
                                        )}

                                        {!unit.unlocked && (
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-4 bg-cosmic-950/30 p-2 rounded-lg w-fit">
                                                <Lock className="w-4 h-4" />
                                                <span>Selesaikan Unit {unit.order - 1} untuk membuka</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${unit.unlocked ? 'bg-gradient-to-br from-white/10 to-transparent border border-white/10' : 'bg-cosmic-950 border border-white/5 opacity-50'}`}>
                                        {unit.icon || '🪐'}
                                    </div>
                                </div>
                            </div>

                            {/* Skills / Lessons Grid */}
                            {unit.unlocked && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 animate-in slide-in-from-left-4 fade-in duration-700 delay-150">
                                    {unit.skills.map((skill: any, idx: number) => {
                                        const firstLesson = skill.lessons[0];
                                        const href = firstLesson ? `/lesson/${firstLesson.slug}` : `/practice/${skill.id}`;

                                        return (
                                            <Link key={skill.id} href={href} className="group/skill">
                                                <div className="bg-cosmic-800/40 hover:bg-cosmic-800/80 border border-white/5 hover:border-primary/40 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover/skill:translate-x-[100%] transition-transform duration-1000" />

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover/skill:bg-primary group-hover/skill:text-white transition-colors">
                                                            {idx === 0 ? <Play className="w-5 h-5 ml-1" /> : <Star className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm group-hover/skill:text-primary transition-colors">{skill.title}</h4>
                                                            <div className="flex items-center text-[10px] text-slate-400 gap-1 mt-0.5">
                                                                <span>Mulai Belajar</span>
                                                                <ChevronRight className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Timeline Connector Dot (Desktop Only) */}
                        <div className={`absolute left-8 top-8 w-6 h-6 rounded-full border-4 border-cosmic-950 z-10 hidden md:block transform -translate-x-[50%] transition-all duration-500 ${unit.unlocked
                                ? 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.6)] scale-110'
                                : 'bg-slate-700'
                            }`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
