"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDashboardStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, xp: true, streak: true }
    });

    if (!user) return null;

    // 1. Material Progress (Lessons)
    const totalLessons = await prisma.lesson.count();
    const completedLessons = await prisma.userProgress.count({
        where: {
            userId: user.id,
            isCompleted: true,
            lessonId: { not: null }
        }
    });

    // 2. Questions Answered (Drills)
    const drillStats = await prisma.drillAttempt.aggregate({
        where: { userId: user.id },
        _sum: { total: true }
    });
    const totalQuestionsAnswered = drillStats._sum.total || 0;

    // 3. Daily Activity for "Questions Answered Today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const drillStatsToday = await prisma.drillAttempt.aggregate({
        where: {
            userId: user.id,
            createdAt: { gte: today }
        },
        _sum: { total: true }
    });
    const questionsAnsweredToday = drillStatsToday._sum.total || 0;

    // 4. Daily Challenges Calculation
    // Challenge 1: Log in (Freebie if they are here, but let's say "Complete 1 Lesson")
    const lessonActivity = await prisma.activity.findFirst({
        where: {
            userId: user.id,
            type: "LESSON_COMPLETE",
            createdAt: { gte: today }
        }
    });

    // Challenge 2: Complete 1 Drill
    const drillToday = await prisma.drillAttempt.findFirst({
        where: {
            userId: user.id,
            createdAt: { gte: today }
        }
    });

    // Challenge 3: Perfect Score
    const perfectToday = await prisma.activity.findFirst({
        where: {
            userId: user.id,
            type: "DRILL_PERFECT",
            createdAt: { gte: today }
        }
    });

    const challenges = [
        {
            id: "daily-1",
            title: "Selesaikan 1 Materi",
            progress: lessonActivity ? 1 : 0,
            goal: 1,
            completed: !!lessonActivity,
            reward: "10 XP"
        },
        {
            id: "daily-2",
            title: "Selesaikan 1 Latihan",
            progress: drillToday ? 1 : 0,
            goal: 1,
            completed: !!drillToday,
            reward: "20 XP"
        },
        {
            id: "daily-3",
            title: "Raih Nilai Sempurna",
            progress: perfectToday ? 1 : 0,
            goal: 1,
            completed: !!perfectToday,
            reward: "Bonus Chest"
        }
    ];

    return {
        completedLessons,
        totalLessons,
        totalQuestionsAnswered,
        questionsAnsweredToday,
        challenges
    };
}

export async function getDailyPath() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) return [];

    const units = await prisma.unit.findMany({
        orderBy: { order: "asc" },
        include: {
            skills: {
                include: {
                    lessons: {
                        select: { id: true }
                    }
                }
            }
        }
    });

    const progress = await prisma.userProgress.findMany({
        where: {
            userId: user.id,
            isCompleted: true
        },
        select: { lessonId: true }
    });

    const completedLessonIds = new Set(progress.map((p: { lessonId: string | null }) => p.lessonId).filter((id): id is string => id !== null));

    // Determine status for each unit
    const nodes = units.map((unit: any, index: number) => {
        const unitLessonIds = unit.skills.flatMap((s: any) => s.lessons.map((l: any) => l.id));
        const isUnitCompleted = unitLessonIds.length > 0 && unitLessonIds.every((id: string) => completedLessonIds.has(id));

        // Check previous unit status to determine if this one is unlocked
        const prevUnit = units[index - 1];
        let isUnlocked = true;
        if (prevUnit) {
            const prevUnitLessonIds = prevUnit.skills.flatMap((s: any) => s.lessons.map((l: any) => l.id));
            const isPrevCompleted = prevUnitLessonIds.every((id: string) => completedLessonIds.has(id));
            isUnlocked = isPrevCompleted;
        }

        let status = "locked";
        if (isUnitCompleted) status = "completed";
        else if (isUnlocked) status = "current";

        // Map colors based on index or slug (preset)
        const colors = [
            "from-blue-400 to-blue-600",
            "from-cyan-400 to-cyan-600",
            "from-purple-400 to-purple-600",
            "from-orange-400 to-orange-600",
            "from-red-400 to-red-600"
        ];

        return {
            id: unit.id,
            title: unit.title,
            status,
            type: "planet",
            color: colors[index % colors.length],
            slug: unit.slug
        };
    });

    return nodes;
}
