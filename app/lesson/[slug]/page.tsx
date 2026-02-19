import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import MDXContent from "@/components/MDXContent";
import { Button } from "@/components/ui/Card";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import LessonCompleteButton from "@/components/LessonCompleteButton";
import LessonCompanion from "./LessonCompanion";

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: PageProps) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const lesson = await prisma.lesson.findUnique({
        where: { slug },
        include: { skill: true }
    });

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 mb-4">
                    Materi Tidak Ditemukan 🔭
                </h1>
                <Link href="/learn" className="text-primary hover:text-accent font-bold underline decoration-2 underline-offset-4">
                    Kembali ke Peta Belajar
                </Link>
            </div>
        );
    }

    // Derive topic from skill slug or title for character matching
    const topic = lesson.skill.slug || lesson.skill.title || "";

    return (
        <div className="max-w-4xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 group transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Materi</span>
                </Link>

                <div className="flex items-center gap-3 mb-2 text-accent">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm font-bold tracking-widest uppercase">{lesson.skill.title}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                    {lesson.title}
                </h1>

                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>

            {/* Content Area */}
            <div className="glass-panel rounded-2xl p-6 md:p-10 text-lg leading-relaxed text-slate-200 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-strong:text-accent prose-code:text-primary prose-code:bg-cosmic-800/50 prose-code:px-1 prose-code:rounded">
                    <MDXContent source={lesson.contentMdx} />
                </article>
            </div>

            {/* Study Companion — client component wrapper */}
            <LessonCompanion topic={topic} skillTitle={lesson.skill.title} />

            {/* Bottom Nav */}
            <div className="mt-12 flex justify-between items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <LessonCompleteButton lessonId={lesson.id} />
                <Link href={`/practice/${lesson.skillId}`}>
                    <Button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform rounded-xl font-bold text-white shadow-lg shadow-primary/25">
                        <span>Lanjut Latihan</span>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
