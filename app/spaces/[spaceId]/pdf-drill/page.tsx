import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Layers, FileText } from "lucide-react";

export default async function SpacePdfDrillPage({
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
                <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Layers className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Bahas Soal PDF Asli
                    </h1>
                    <p className="text-slate-400">
                        Penyelesaian mendalam untuk contoh kasus tersulit yang ditemukan langsung di dokumen Anda.
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {space.lessons.length === 0 ? (
                    <p className="text-slate-500 italic">Belum ada pembahasan soal PDF.</p>
                ) : (
                    space.lessons.map((lesson, idx) => {
                        if (!lesson.pdfWalkthrough || lesson.pdfWalkthrough.trim() === "") return null;

                        return (
                            <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                    Studi Kasus: {lesson.title}
                                </h2>

                                <div className="mt-6 prose prose-invert prose-orange max-w-none">
                                    {lesson.pdfWalkthrough.split("\\n").map((paragraph, i) => {
                                        if (paragraph.trim() === "") return <br key={i} />;
                                        if (paragraph.startsWith("# ")) return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.replace("# ", "")}</h3>;
                                        if (paragraph.startsWith("## ")) return <h4 key={i} className="text-lg font-bold text-white mt-5 mb-2">{paragraph.replace("## ", "")}</h4>;
                                        if (paragraph.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-slate-300">{paragraph.replace("- ", "")}</li>;
                                        return <p key={i} className="text-slate-300 mb-4">{paragraph}</p>;
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
