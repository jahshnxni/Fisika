import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { buyItem, equipItem } from "@/app/actions/economy";
import { SHOP_ITEMS } from "@/lib/economy";
import { ShoppingBag, Star, Zap, Palette, Check, Lock } from "lucide-react";
import Image from "next/image";
import ShopItemCard from "@/components/features/ShopItemCard";
import EduCoin from "@/components/gamification/EduCoin";

export default async function ShopPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { coins: true, inventory: true, equippedTheme: true, equippedTitle: true }
    });

    if (!user) redirect("/login");

    const inventory = JSON.parse(user.inventory || "[]") as string[];

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-yellow-400" />
                        Edu-Shop
                    </h1>
                    <p className="text-slate-400 mt-2">Tukarkan Edu-Coins hasil kerja kerasmu dengan item eksklusif!</p>
                </div>

                <div className="bg-cosmic-900/80 backdrop-blur border border-yellow-500/30 px-6 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Saldo Anda</span>
                    <div className="text-5xl font-black text-yellow-400 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        <EduCoin className="w-12 h-12" />
                        {user.coins.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Shop Sections */}
            <div className="space-y-12">

                {/* Themes */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Palette className="w-6 h-6 text-purple-400" /> Tema Dashboard
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SHOP_ITEMS.filter(i => i.type === "THEME").map(item => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                isOwned={inventory.includes(item.id) || item.id === "theme_cosmic"} // Default checks
                                isEquipped={user.equippedTheme === item.value}
                                userCoins={user.coins}
                            />
                        ))}
                    </div>
                </section>

                {/* Titles */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-400" /> Gelar (Titles)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SHOP_ITEMS.filter(i => i.type === "TITLE").map(item => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                isOwned={inventory.includes(item.id)}
                                isEquipped={user.equippedTitle === item.value}
                                userCoins={user.coins}
                            />
                        ))}
                    </div>
                </section>

                {/* Powerups */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-red-400" /> Powerups
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SHOP_ITEMS.filter(i => i.type === "POWERUP").map(item => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                isOwned={false} // Powerups are consumable, always buyable
                                userCoins={user.coins}
                            />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
