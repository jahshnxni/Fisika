"use client";

import { buyItem, equipItem } from "@/app/actions/economy";
import { ShopItem } from "@/lib/economy";
import { useState } from "react";
import { Loader2, Check, Lock, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShopItemCardProps {
    item: ShopItem;
    isOwned?: boolean;
    isEquipped?: boolean;
    userCoins: number;
}

export default function ShopItemCard({ item, isOwned, isEquipped, userCoins }: ShopItemCardProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBuy = async () => {
        if (loading) return;
        setLoading(true);
        const res = await buyItem(item.id);
        if (!res.success) {
            alert(res.error || "Gagal membeli item.");
        }
        setLoading(false);
        router.refresh();
    };

    const handleEquip = async () => {
        if (loading) return;
        setLoading(true);
        const res = await equipItem(item.id, item.type as "THEME" | "TITLE");
        if (!res.success) {
            alert(res.error || "Gagal menggunakan item.");
        }
        setLoading(false);
        router.refresh();
    };

    const canAfford = userCoins >= item.price;

    return (
        <div className={`relative group p-6 rounded-2xl border transition-all duration-300 ${isEquipped
            ? "bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            : isOwned
                ? "bg-cosmic-800/50 border-white/10 hover:border-white/20"
                : "bg-cosmic-900/50 border-white/5 hover:border-white/10"
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="text-4xl p-3 bg-white/5 rounded-xl">{item.icon}</div>
                {isEquipped && <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">DIPAKAI</span>}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{item.description}</p>

            <div className="mt-auto">
                {isOwned && item.type !== "POWERUP" ? (
                    <button
                        onClick={handleEquip}
                        disabled={loading || isEquipped}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isEquipped
                            ? "bg-green-500/20 text-green-400 cursor-default"
                            : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEquipped ? <><Check className="w-4 h-4" /> Terpasang</> : "Pasang"}
                    </button>
                ) : (
                    <button
                        onClick={handleBuy}
                        disabled={loading || !canAfford}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!canAfford
                            ? "bg-red-500/10 text-red-400 cursor-not-allowed opacity-50"
                            : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                            }`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                {canAfford ? <ShoppingCart className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                {item.price} Coins
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
