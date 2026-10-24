import prisma from "@/lib/prisma";

/**
 * Check if a unit is unlocked for a user.
 * Mode Bebas Akses: Semua materi terbuka langsung tanpa sistem penguncian level.
 */
export async function isUnitUnlocked(userId: string, unitOrder: number): Promise<boolean> {
    return true;
}

/**
 * Get detailed progress for a user on a specific unit.
 */
export async function getUnitProgress(userId: string, unitId: string) {
    const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: {
            skills: {
                include: { lessons: true, questions: true }
            }
        }
    });

    if (!unit) return null;

    const allLessons = unit.skills.flatMap(
        (s: { lessons: { id: string }[] }) => s.lessons
    );
    const allLessonIds = allLessons.map((l: { id: string }) => l.id);

    const completedLessons = await prisma.userProgress.count({
        where: {
            userId,
            lessonId: { in: allLessonIds },
            isCompleted: true,
        }
    });

    const drillAttempts = await prisma.drillAttempt.count({
        where: { userId, unitSlug: unit.slug }
    });

    const bestDrill = await prisma.drillAttempt.findFirst({
        where: { userId, unitSlug: unit.slug },
        orderBy: { score: "desc" },
    });

    return {
        totalLessons: allLessons.length,
        completedLessons,
        lessonProgress: allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 0,
        drillAttempts,
        bestDrillScore: bestDrill?.score ?? 0,
        bestDrillTotal: bestDrill?.total ?? 0,
    };
}

/**
 * Mark a lesson as complete for a user and award XP.
 */
export async function markLessonComplete(userId: string, lessonId: string) {
    await prisma.userProgress.upsert({
        where: {
            userId_lessonId: { userId, lessonId }
        },
        update: { isCompleted: true },
        create: {
            userId,
            lessonId,
            isCompleted: true,
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 10 } }
    });

    return { success: true };
}
