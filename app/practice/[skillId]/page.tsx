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

    // Progressive Drill Query Logic
    // Fetch all questions for this skill to shuffle
    const allQuestions = await prisma.question.findMany({
        where: { skillId: skillId }
    });

    const skill = await prisma.skill.findUnique({
        where: { id: skillId }
    });

    if (!skill || allQuestions.length === 0) {
        return (
            <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Belum ada soal 😅</h1>
                <p className="text-slate-400 mb-8">Pembuat soal sedang bertapa.</p>
                <Link href="/learn" className="text-primary hover:underline">Kembali ke Menu</Link>
            </div>
        )
    }

    // Shuffle helper function
    const shuffleArray = <T,>(array: T[]) => array.sort(() => Math.random() - 0.5);

    // Group questions by difficulty
    const easyQ = shuffleArray(allQuestions.filter(q => q.difficulty === 'EASY')).slice(0, 3);
    const normalQ = shuffleArray(allQuestions.filter(q => q.difficulty === 'NORMAL')).slice(0, 3);
    const hardQ = shuffleArray(allQuestions.filter(q => q.difficulty === 'HARD')).slice(0, 2);
    const extremeQ = shuffleArray(allQuestions.filter(q => q.difficulty === 'EXTREME')).slice(0, 2);

    // Combine them in progressive order: Easy -> Normal -> Hard -> Extreme
    const progressiveQuestions = [...easyQ, ...normalQ, ...hardQ, ...extremeQ];

    // Adapt to component structure
    const parsedQuestions = progressiveQuestions.map(q => ({
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
