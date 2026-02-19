"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { addCoins, spendCoins, COIN_REWARDS, SHOP_ITEMS } from "@/lib/economy";

export async function buyItem(itemId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, error: "Item not found" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, error: "User not found" };

    // Check inventory
    const inventory = JSON.parse(user.inventory || "[]") as string[];
    if (inventory.includes(itemId) && item.type !== "POWERUP") {
        return { success: false, error: "Item already owned" };
    }

    // Attempt purchase
    const result = await spendCoins(user.id, item.price, "SHOP", `Membeli ${item.name}`);
    if (!result.success) return result;

    // Add to inventory
    const newInventory = [...inventory, itemId];
    await prisma.user.update({
        where: { id: user.id },
        data: { inventory: JSON.stringify(newInventory) }
    });

    revalidatePath("/shop");
    revalidatePath("/profile");
    return { success: true };
}

export async function equipItem(itemId: string, type: "THEME" | "TITLE") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, error: "User not found" };

    const inventory = JSON.parse(user.inventory || "[]") as string[];
    if (!inventory.includes(itemId)) {
        // Special case: Default theme is always owned
        if (itemId !== "cosmic" && type === "THEME") return { success: false, error: "Item not owned" };
    }

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    // Allow equipping default theme "cosmic" even if not in explicit inventory (it's default)
    const value = itemId === "cosmic" ? "cosmic" : item?.value;

    if (!value) return { success: false, error: "Invalid item" };

    if (type === "THEME") {
        await prisma.user.update({ where: { id: user.id }, data: { equippedTheme: value } });
    } else if (type === "TITLE") {
        await prisma.user.update({ where: { id: user.id }, data: { equippedTitle: value } });
    }

    revalidatePath("/");
    return { success: true };
}

export async function rewardFocusSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, error: "User not found" };

    // Rate Limit Check based on last transaction? 
    // Ideally we check DB for last FOCUS reward.
    const lastFocus = await prisma.transaction.findFirst({
        where: {
            userId: user.id,
            category: "FOCUS",
            createdAt: { gte: new Date(Date.now() - 20 * 60 * 1000) } // 20 mins grace period (session is 25m)
        }
    });

    if (lastFocus) {
        return { success: false, error: "Too soon! Finish your session properly." };
    }

    await addCoins(user.id, COIN_REWARDS.FOCUS_SESSION, "FOCUS", "Sesi Fokus 25 Menit Selesai");

    revalidatePath("/");
    return { success: true };
}
