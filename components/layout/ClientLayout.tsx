"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { status } = useSession();

    // Public routes that don't need the dashboard layout
    // "/" is special: It's public ONLY if unauthenticated (Landing Page)
    // If authenticated, "/" is Dashboard (Private)
    const isPublic = ["/login", "/register", "/landing"].includes(pathname) || (pathname === "/" && status === "unauthenticated");

    if (isPublic) {
        return <main className="min-h-screen relative overflow-hidden bg-cosmic-950 text-white">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-cosmic-950 text-white selection:bg-primary/30 font-sans">
            <Sidebar />
            <main className="flex-1 lg:ml-64 relative z-0 min-h-screen flex flex-col transition-all duration-300 pb-20 lg:pb-0">
                <TopBar />
                <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
