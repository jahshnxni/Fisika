"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: "ACCOMPLISHMENT" | "SYSTEM" | "INFO" | "LEAGUE_UP" | "LEVEL_UP"
) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
        revalidatePath("/dashboard"); // Revalidate dashboard or topbar
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}

export async function getUnreadNotifications(userId: string) {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                isRead: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });
        return notifications;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

export async function getAllNotifications(userId: string) {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });
        return notifications;
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

export async function markAllNotificationsAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        revalidatePath("/dashboard"); // Or wherever notifications are shown
        return { success: true };
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        return { success: false };
    }
}
