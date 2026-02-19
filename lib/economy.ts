import prisma from "@/lib/prisma";

export const COIN_REWARDS = {
    DAILY_LOGIN: 10,
    LESSON_COMPLETE: 20,
    DRILL_CORRECT: 2, // Per correct answer
    DRILL_PERFECT: 20, // Bonus
    FOCUS_SESSION: 50, // Per 25 mins
    FIRST_5_BONUS: 2, // Multiplier
    PEER_REVIEW: 10,
};

export async function addCoins(userId: string, amount: number, category: string, description: string) {
    try {
        // limit large transactions as sanity check
        if (amount > 1000) {
            console.warn(`Suspiciously large coin add attempt: ${amount} for user ${userId}`);
            return false;
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { coins: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "EARN",
                    category,
                    description
                }
            })
        ]);
        return true;
    } catch (error) {
        console.error("Failed to add coins:", error);
        return false;
    }
}

export async function spendCoins(userId: string, amount: number, category: string, description: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { coins: true }
        });

        if (!user || user.coins < amount) {
            return { success: false, error: "Insufficient funds" };
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { coins: { decrement: amount } }
            }),
            prisma.transaction.create({
                data: {
                    userId,
                    amount: -amount, // Negative for spending
                    type: "SPEND",
                    category,
                    description
                }
            })
        ]);
        return { success: true };
    } catch (error) {
        console.error("Failed to spend coins:", error);
        return { success: false, error: "Transaction failed" };
    }
}

export async function getBalance(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coins: true }
    });
    return user?.coins || 0;
}

export type ShopItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    type: "THEME" | "TITLE" | "POWERUP";
    value: string; // e.g. "cyberpunk", "The Einstein"
    icon: string;
};

export const SHOP_ITEMS: ShopItem[] = [
    { id: "theme_cyberpunk", name: "Cyberpunk 2077", description: "Tema Neon futuristik untuk jiwa pemberontak.", price: 500, type: "THEME", value: "cyberpunk", icon: "🌆" },
    { id: "theme_pastel", name: "Dreams of Pastel", description: "Warna lembut untuk ketenangan pikiran.", price: 300, type: "THEME", value: "pastel", icon: "🎨" },
    { id: "theme_dark_knight", name: "Dark Knight", description: "Mode ultra-gelap untuk fokus maksimal.", price: 400, type: "THEME", value: "dark_knight", icon: "🦇" },
    { id: "title_einstein", name: "The Einstein", description: "Gelar kehormatan untuk sang jenius.", price: 1000, type: "TITLE", value: "The Einstein", icon: "🧠" },
    { id: "title_polyglot", name: "Indonesian Polyglot", description: "Dikuasai banyak bahasa fisika.", price: 800, type: "TITLE", value: "Polyglot", icon: "🗣️" },
    { id: "powerup_lifeline", name: "Extra Life", description: "Satu kesempatan salah saat ujian.", price: 50, type: "POWERUP", value: "lifeline", icon: "❤️" },
];
