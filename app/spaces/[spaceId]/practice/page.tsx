import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PenTool, CheckCircle, HelpCircle } from "lucide-react";

export default async function SpacePracticePage({
    params
}: {
    params: Promise<{ spaceId: string }>
}) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const space = await prisma.courseSpace.findUnique({
        where: { id: spaceId },
        include: { lessons: { orderBy: { order: "asc" } } }
    });

    if (!space) return <div className="p-8 text-white">Space tidak ditemukan.</div>;

    return (
        <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto">
            <div className="mb-12 flex items-center gap-4">
                <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                    <PenTool className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Latihan Bertingkat
                    </h1>
                    <p className="text-slate-400">
                        Puluhan contoh soal yang dirancang secara Scaffolded (Naik Level Bertahap).
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {space.lessons.length === 0 ? (
                    <p className="text-slate-500 italic">Belum ada soal latihan.</p>
                ) : (
                    space.lessons.map((lesson) => {
                        let examples: Array<{ level: string, question: string, answer: string }> = [];
                        try {
                            examples = JSON.parse(lesson.scaffoldedMdx || "[]");
                        } catch (e) { }

                        if (examples.length === 0) return null;

                        return (
                            <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-fuchsia-400" />
                                    {lesson.title}
                                </h2>

                                <div className="space-y-6">
                                    {examples.map((ex, i) => (
                                        <div key={i} className={`p-5 rounded-xl border ${ex.level === "EASY" ? "bg-green-500/10 border-green-500/20" :
                                                ex.level === "MEDIUM" ? "bg-yellow-500/10 border-yellow-500/20" :
                                                    ex.level === "HARD" ? "bg-orange-500/10 border-orange-500/20" :
                                                        "bg-red-500/10 border-red-500/20"
                                            }`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded bg-black/50 uppercase tracking-widest ${ex.level === "EASY" ? "text-green-400" :
                                                        ex.level === "MEDIUM" ? "text-yellow-400" :
                                                            ex.level === "HARD" ? "text-orange-400" :
                                                                "text-red-400"
                                                    }`}>
                                                    Level: {ex.level}
                                                </span>
                                            </div>
                                            <div className="text-slate-200 font-medium mb-4 flex gap-3">
                                                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                                                <p>{ex.question}</p>
                                            </div>
                                            <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-slate-300 text-sm italic">
                                                <span className="font-bold text-white not-italic mb-1 block">Jawaban:</span>
                                                {ex.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
