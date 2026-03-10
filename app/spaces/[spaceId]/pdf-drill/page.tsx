import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Layers, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ConceptVideoPlayer from "@/components/features/ConceptVideoPlayer";

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

                                <div className="mt-6">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            p: ({ children, ...props }: any) => <p className="mb-4 leading-relaxed text-slate-200 text-[15px]" {...props}>{children}</p>,
                                            ul: ({ children, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-200 ml-4" {...props}>{children}</ul>,
                                            ol: ({ children, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-200 ml-4" {...props}>{children}</ol>,
                                            li: ({ children, ...props }: any) => <li className="text-[15px]" {...props}>{children}</li>,
                                            strong: ({ children, ...props }: any) => <strong className="text-white font-bold" {...props}>{children}</strong>,
                                            h3: ({ children, ...props }: any) => <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props}>{children}</h3>,
                                            h4: ({ children, ...props }: any) => <h4 className="text-lg font-bold text-orange-300 mt-6 mb-3" {...props}>{children}</h4>,
                                            code: ({ inline, className, children, ...props }: any) => (
                                                inline ? <code className="bg-slate-800 text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code> :
                                                    <pre className="bg-slate-900 p-4 rounded-xl overflow-x-auto my-4 border border-slate-700 text-sm"><code className={className} {...props}>{children}</code></pre>
                                            ),
                                        }}
                                    >
                                        {lesson.pdfWalkthrough}
                                    </ReactMarkdown>
                                </div>

                                {/* Video Component for the Storyboard */}
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4">Video Pembahasan Interaktif</h3>
                                    <ConceptVideoPlayer
                                        courseId={spaceId}
                                        topic={lesson.title}
                                        customStoryboardText={lesson.pdfWalkthrough}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
