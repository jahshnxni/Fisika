import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import Link from "next/link";

interface PageProps {
    params: Promise<{ skillId: string }>
}

export default async function PracticePage({ params }: PageProps) {
    const { skillId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const skill = await prisma.skill.findUnique({
        where: { id: skillId },
        include: {
            questions: {
                take: 10,
            }
        }
    });

    if (!skill || skill.questions.length === 0) {
        return (
            <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Belum ada soal 😅</h1>
                <p className="text-slate-400 mb-8">Pembuat soal sedang bertapa.</p>
                <Link href="/learn" className="text-primary hover:underline">Kembali ke Menu</Link>
            </div>
        )
    }

    // SQLite Adaptation: Parse JSON strings back to objects
    const parsedQuestions = skill.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options),
        tags: JSON.parse(q.tags)
    }));

    return (
        <div className="min-h-screen">
            <QuizRunner skillId={skill.id} questions={parsedQuestions} topic={skill.slug} />
        </div>
    );
}
