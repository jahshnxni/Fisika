import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SpacesClient from "./SpacesClient";

export default async function SpacesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect("/login");
    }

    let existingSpaces: any[] = [];

    // Defensive query because DB connection might fail on the user's dev machine
    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                courseSpaces: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });
        if (user) {
            existingSpaces = user.courseSpaces;
        }
    } catch (e) {
        console.error("Failed to load spaces:", e);
    }

    return (
        <main className="min-h-screen pt-24 pb-32">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                        AI Space Builder
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Ubah PDF materi atau soal buram menjadi <span className="text-white font-bold">Ruang Kursus Interaktif</span> yang estetis. AI kami akan menyusun silabus, latihan bertahap, dan kuis secara otomatis!
                    </p>
                </div>

                <SpacesClient initialSpaces={existingSpaces} />
            </div>
        </main>
    );
}
