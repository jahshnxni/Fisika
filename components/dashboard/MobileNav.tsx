"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Target, User, Users, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Beranda", href: "/" },
        { icon: BookOpen, label: "Materi", href: "/learn" },
        { icon: Target, label: "Latihan", href: "/drill" },
        { icon: Bot, label: "AI Tutor", href: "/ai" },
        { icon: Users, label: "Komunitas", href: "/community" },
        { icon: User, label: "Profil", href: "/profile" },
        { icon: Settings, label: "Pengaturan", href: "/settings" },
    ];

    // Hide if not on main pages (optional, depending on UX preference)
    // For now, always show on mobile unless specifically hidden by layout logic

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-cosmic-950/90 backdrop-blur-xl border-t border-white/10 lg:hidden pb-safe">
            <nav className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[64px]",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};

export default MobileNav;
