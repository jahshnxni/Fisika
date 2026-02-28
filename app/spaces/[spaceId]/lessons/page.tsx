import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import AutoBuildGate from "../_components/AutoBuildGate";

/** Render a single Markdown line to JSX */
function MdLine({ line, i }: { line: string; i: number }) {
    const t = line.trim();
    if (!t) return <div key={i} className="h-2" />;

    // Bold inline: **text**
    const renderText = (s: string) => {
        const parts = s.split(/\*\*(.*?)\*\*/g);
        return parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p);
    };

    if (t.startsWith("### ")) return <h5 key={i} className="text-base font-bold text-violet-300 mt-5 mb-1">{t.slice(4)}</h5>;
    if (t.startsWith("## ")) return <h4 key={i} className="text-lg font-bold text-blue-300 mt-7 mb-2 pb-1 border-b border-white/10">{t.slice(3)}</h4>;
    if (t.startsWith("# ")) return <h3 key={i} className="text-2xl font-bold text-white mt-8 mb-3">{t.slice(2)}</h3>;
    if (t.startsWith("- ") || t.startsWith("* ")) return <li key={i} className="ml-6 list-disc text-slate-300 leading-relaxed mb-1">{renderText(t.slice(2))}</li>;
    if (/^\d+\.\s/.test(t)) return <li key={i} className="ml-6 list-decimal text-slate-300 leading-relaxed mb-1">{renderText(t.replace(/^\d+\.\s/, ""))}</li>;
    if (t.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-violet-500/60 pl-4 text-slate-400 italic my-2">{t.slice(2)}</blockquote>;
    if (t.startsWith("```") || t === "```") return null;
    return <p key={i} className="text-slate-300 leading-relaxed mb-2">{renderText(t)}</p>;
}

function renderMdx(raw: string) {
    // Normalize both escaped \\n (from JSON string) and real \n
    const normalized = raw.replace(/\\n/g, "\n");
    return normalized.split("\n").map((line, i) => <MdLine key={i} line={line} i={i} />);
}

export default async function SpaceLessonsPage({
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
        <AutoBuildGate spaceId={spaceId}>
            <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto">
                <div className="mb-12 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Materi Fundamental</h1>
                        <p className="text-slate-400">Modul teori yang dibangun bertahap dari pemahaman dasar hingga lanjut.</p>
                    </div>
                </div>

                <div className="space-y-10">
                    {space.lessons.length === 0 ? (
                        <p className="text-slate-500 italic">Materi belum tersedia.</p>
                    ) : space.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                            <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-4 relative z-10">
                                <span className="text-blue-400 text-lg font-semibold">Bab {idx + 1}</span>
                                {lesson.title}
                            </h2>

                            <div className="relative z-10">
                                {renderMdx(lesson.contentMdx)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AutoBuildGate>
    );
}
