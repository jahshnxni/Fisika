import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DrillRunner from "@/components/DrillRunner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ unitSlug: string }>
}

export default async function DrillUnitPage({ params }: PageProps) {
    const { unitSlug } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const unit = await prisma.unit.findUnique({
        where: { slug: unitSlug },
        include: {
            questions: {
                orderBy: { difficulty: "asc" },
            }
        }
    });

    if (!unit || unit.questions.length === 0) {
        return (
            <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl mb-4">📭</h1>
                <h2 className="text-2xl font-bold mb-2">Belum Ada Soal</h2>
                <p className="text-slate-400 mb-8">Kategori ini sedang dalam pengembangan.</p>
                <Link href="/drill" className="text-primary hover:underline font-bold">← Kembali</Link>
            </div>
        );
    }

    // Parse JSON strings and prepare questions
    const parsedQuestions = unit.questions.map((q: any) => ({
        ...q,
        options: JSON.parse(q.options),
        tags: JSON.parse(q.tags),
    }));

    // Sort by difficulty: EASY first, then MEDIUM, then HARD
    const difficultyOrder: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };
    parsedQuestions.sort((a: any, b: any) => (difficultyOrder[a.difficulty] ?? 1) - (difficultyOrder[b.difficulty] ?? 1));

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto p-4">
                <Link
                    href="/drill"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 group transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Drill</span>
                </Link>
            </div>
            <DrillRunner
                unitSlug={unit.slug}
                unitTitle={unit.title}
                questions={parsedQuestions}
            />
        </div>
    );
}
