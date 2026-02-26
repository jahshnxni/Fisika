import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, PenTool, MessageSquare, Cpu, Layers } from "lucide-react";
import SpaceSidebar from "./SpaceSidebar";

export default async function SpaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ spaceId: string }>;
}) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    let space = null;
    try {
        space = await prisma.courseSpace.findUnique({
            where: { id: spaceId },
        });
    } catch (e) {
        console.error("Layout failed to load space:", e);
    }

    if (!space) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                Ruang Belajar tidak ditemukan.
                <Link href="/spaces" className="text-primary mt-4">Kembali</Link>
            </div>
        );
    }

    // Engine 3: UI Builder theme application
    const themeStyles: Record<string, string> = {
        "blue-fluid": "bg-blue-950",
        "purple-wave": "bg-fuchsia-950 text-fuchsia-50",
        "red-thermo": "bg-rose-950",
        cosmic: "bg-cosmic-950",
        notebook: "bg-amber-50/10 text-slate-800",
        modern: "bg-slate-900",
        science: "bg-teal-950", // fallbacks
    };

    const accentStyles: Record<string, string> = {
        "blue-fluid": "text-blue-400 bg-blue-500/10 border-blue-500/20",
        "purple-wave": "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
        "red-thermo": "text-rose-400 bg-rose-500/10 border-rose-500/20",
        cosmic: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        notebook: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        modern: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        science: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    };

    const currentTheme = space.theme || "cosmic";
    const activeThemeStyle = themeStyles[currentTheme] || themeStyles["cosmic"];
    const activeAccentStyle = accentStyles[currentTheme] || accentStyles["cosmic"];

    return (
        <div className={`min-h-screen flex flex-col md:flex-row ${activeThemeStyle} font-sans transition-colors duration-500`}>
            {/* Responsive Sidebar */}
            <SpaceSidebar
                spaceId={spaceId}
                title={space.title}
                sourceName={space.sourcePdfName || "Dokumen"}
                isGenerated={space.isGenerated}
                accentStyles={activeAccentStyle}
            />

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto w-full mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}
