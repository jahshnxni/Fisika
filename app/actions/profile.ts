"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    name?: string;
    image?: string;
    enableNotifications?: boolean;
    enableSound?: boolean;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...data
            }
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
