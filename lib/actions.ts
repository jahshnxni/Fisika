"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notification";

async function checkAndNotifyMilestones(userId: string, oldXp: number, newXp: number) {
    // Level Up Check (Every 100 XP)
    const oldLevel = Math.floor(oldXp / 100) + 1;
    const newLevel = Math.floor(newXp / 100) + 1;

    if (newLevel > oldLevel) {
        await createNotification(
            userId,
            "Level Up! 🚀",
            `Selamat! Kamu naik ke Level ${newLevel}. Terus belajar untuk mencapai puncak!`,
            "LEVEL_UP"
        );
    }

    // League Check (Thresholds: 200, 500, 1000, 2000)
    const leagues = [
        { threshold: 200, name: "Silver" },
        { threshold: 500, name: "Gold" },
        { threshold: 1000, name: "Sapphire" },
        { threshold: 2000, name: "Diamond" },
    ];

    for (const league of leagues) {
        if (oldXp < league.threshold && newXp >= league.threshold) {
            await createNotification(
                userId,
                `Liga Baru Terbuka! 🏆`,
                `Kamu berhasil masuk ke Liga ${league.name}! Tunjukkan kemampuanmu.`,
                "LEAGUE_UP"
            );
        }
    }
}

export async function submitQuizResult(skillId: string, score: number, totalQuestions: number) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { error: "Unauthorized" };

    let xpGained = 10;
    if (score === totalQuestions) xpGained += 5;

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
    if (!user) return { error: "User not found" };

    const oldXp = user.xp;

    await prisma.user.update({
        where: { email: session.user.email! },
        data: {
            xp: { increment: xpGained },
        }
    });

    await checkAndNotifyMilestones(user.id, oldXp, oldXp + xpGained);

    revalidatePath('/learn');
    return { success: true, xpGained };
}

export async function submitDrillResult(unitSlug: string, score: number, total: number, maxDifficulty: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    let xpGained = Math.floor(score * 2);
    if (score === total) xpGained += 10;

    await prisma.drillAttempt.create({
        data: {
            userId: user.id,
            unitSlug,
            score,
            total,
            maxDifficulty,
        }
    });

    const oldXp = user.xp;

    await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpGained } }
    });

    await checkAndNotifyMilestones(user.id, oldXp, oldXp + xpGained);

    // Log Activity
    if (score === total) {
        await prisma.activity.create({
            data: {
                userId: user.id,
                type: "DRILL_PERFECT",
                details: `Sempurna di ${unitSlug}`,
            }
        });

        await createNotification(
            user.id,
            "Latihan Sempurna! 🎯",
            `Luar biasa! Kamu menjawab semua soal dengan benar di ${unitSlug}.`,
            "ACCOMPLISHMENT"
        );
    }

    // --- ECONOMY & COINS ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attemptsToday = await prisma.drillAttempt.aggregate({
        where: {
            userId: user.id,
            createdAt: { gte: today }
        },
        _sum: { total: true }
    });

    const questionsAnsweredToday = attemptsToday._sum.total || 0;

    // "The First 5" Bonus Logic
    // We treat the first 5 questions of the day as 2x value (2 coins -> 4 coins)
    // Bonus = +2 coins per correct answer in the "Golden Zone"
    const bonusSlotsRemaining = Math.max(0, 5 - questionsAnsweredToday);
    // We assume the correct answers are distributed evenly or generously assume they fall in the first slots
    // To be fair/generous: The first N correct answers get the bonus, up to bonusSlotsRemaining
    const correctInBonusZone = Math.min(score, bonusSlotsRemaining);

    const baseCoins = score * 2;
    const first5Bonus = correctInBonusZone * 2;
    const perfectBonus = score === total ? 20 : 0;

    const totalCoins = baseCoins + first5Bonus + perfectBonus;

    if (totalCoins > 0) {
        await prisma.user.update({
            where: { id: user.id },
            data: { coins: { increment: totalCoins } }
        });

        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: totalCoins,
                type: "EARN",
                category: "DRILL",
                description: `Hasil Latihan: ${score}/${total} Benar${first5Bonus > 0 ? " (Bonus First 5)" : ""}${perfectBonus > 0 ? " (Perfect Score)" : ""}`
            }
        });

        await createNotification(
            user.id,
            "Edu-Coins Didapat! 🪙",
            `Kamu mendapatkan ${totalCoins} koin dari latihan ini!`,
            "ACCOMPLISHMENT"
        );
    }

    revalidatePath('/drill');
    revalidatePath('/dashboard');
    revalidatePath('/');
    revalidatePath('/profile');
    return { success: true, xpGained, coinsEarned: totalCoins };
}

export async function markLessonComplete(lessonId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    await prisma.userProgress.upsert({
        where: {
            userId_lessonId: {
                userId: user.id,
                lessonId,
            }
        },
        update: { isCompleted: true },
        create: {
            userId: user.id,
            lessonId,
            isCompleted: true,
        }
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 10 } }
    });

    // Fetch lesson title for activity log
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (lesson) {
        await prisma.activity.create({
            data: {
                userId: user.id,
                type: "LESSON_COMPLETE",
                details: lesson.title,
            }
        });
    }

    revalidatePath('/learn');
    revalidatePath('/dashboard');
    revalidatePath('/');
    return { success: true };
}

export async function isUnitUnlocked(userId: string, unitOrder: number): Promise<boolean> {
    if (unitOrder <= 1) return true;

    const previousUnit = await prisma.unit.findFirst({
        where: { order: unitOrder - 1 },
        include: {
            skills: {
                include: {
                    lessons: true,
                }
            }
        }
    });

    if (!previousUnit) return true;

    const allLessonIds = previousUnit.skills.flatMap((s: { lessons: { id: string }[] }) => s.lessons.map((l: { id: string }) => l.id));
    if (allLessonIds.length === 0) return true;

    const completedCount = await prisma.userProgress.count({
        where: {
            userId,
            lessonId: { in: allLessonIds },
            isCompleted: true,
        }
    });

    return completedCount >= Math.ceil(allLessonIds.length * 0.5);
}

export async function getUserStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    try {
        // Try fetching everything including economy fields
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                xp: true,
                hearts: true,
                maxHearts: true,
                streak: true,
                image: true,
                name: true,
                coins: true,
                equippedTheme: true,
                equippedTitle: true,
            }
        });
        return user;
    } catch (error) {
        console.error("Database schema mismatch, falling back to basic stats:", error);
        // Fallback: Fetch only basic fields if economy columns don't exist yet
        const basicUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                xp: true,
                hearts: true,
                maxHearts: true,
                streak: true,
                image: true,
                name: true,
            }
        });

        if (!basicUser) return null;

        return {
            ...basicUser,
            coins: 0,
            equippedTheme: "cosmic",
            equippedTitle: null,
        };
    }
}

export async function unlockAllCosmetics() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    try {
        const cosmetic = await prisma.userCosmetics.upsert({
            where: { userId: user.id },
            update: {
                unlockedSkins: "[\"default_junior\", \"skin_fluida\", \"skin_wave\", \"skin_thermo\", \"skin_einstein\"]",
                stardust: { increment: 1000 }
            },
            create: {
                userId: user.id,
                currentSkin: "skin_einstein",
                unlockedSkins: "[\"default_junior\", \"skin_fluida\", \"skin_wave\", \"skin_thermo\", \"skin_einstein\"]",
                stardust: 1000
            }
        });

        // Add Pets
        const petTypes = ["pet_aquabot", "pet_echobat", "pet_piston"];
        for (const petId of petTypes) {
            const existing = await prisma.userPet.findFirst({
                where: { userCosmeticsId: cosmetic.id, petId }
            });

            if (!existing) {
                await prisma.userPet.create({
                    data: {
                        userCosmeticsId: cosmetic.id,
                        petId,
                        name: petId.replace("pet_", "").toUpperCase(),
                        level: 5
                    }
                });
            }
        }

        revalidatePath('/profile');
        return { success: true };
    } catch (e) {
        console.error("Unlock failed", e);
        return { error: "Failed to unlock" };
    }
}
