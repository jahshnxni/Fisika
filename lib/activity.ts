"use server";
import prisma from "@/lib/prisma";

export type ActivityType = "LESSON_COMPLETE" | "DRILL_PERFECT" | "LEVEL_UP" | "BADGE_EARNED" | "LOGIN_STREAK";

export async function logActivity(userId: string, type: ActivityType, details: string) {
    try {
        await prisma.activity.create({
            data: {
                userId,
                type,
                details,
            },
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

export async function getRecentActivities() {
    try {
        const activities = await prisma.activity.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return activities;
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return [];
    }
}

export async function getLeaderboard() {
    try {
        const users = await prisma.user.findMany({
            take: 5,
            orderBy: {
                xp: 'desc', // Rank by XP
            },
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                streak: true,
            },
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }
}
