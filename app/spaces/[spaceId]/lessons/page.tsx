import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BookOpen } from "lucide-react";

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

    if (!space) {
        return <div className="p-8 text-white">Space tidak ditemukan.</div>;
    }

    return (
        <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto">
            <div className="mb-12 flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Materi Fundamental
                    </h1>
                    <p className="text-slate-400">
                        Modul teori yang dibangun bertahap dari pemahaman dasar hingga lanjut.
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {space.lessons.length === 0 ? (
                    <p className="text-slate-500 italic">Materi belum digenerasi oleh AI.</p>
                ) : (
                    space.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-4">
                                <span className="text-blue-400 text-lg">Bab {idx + 1}</span>
                                {lesson.title}
                            </h2>

                            <div className="prose prose-invert prose-blue max-w-none">
                                {/* Basic MDX rendering without heavy libraries for robust Server Components */}
                                {lesson.contentMdx.split("\\n").map((paragraph, i) => {
                                    if (paragraph.trim() === "") return <br key={i} />;
                                    if (paragraph.startsWith("# ")) return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.replace("# ", "")}</h3>;
                                    if (paragraph.startsWith("## ")) return <h4 key={i} className="text-lg font-bold text-white mt-5 mb-2">{paragraph.replace("## ", "")}</h4>;
                                    if (paragraph.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-slate-300">{paragraph.replace("- ", "")}</li>;
                                    return <p key={i} className="text-slate-300 mb-4">{paragraph}</p>;
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
