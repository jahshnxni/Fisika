import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SpaceGeneratorClient from "./SpaceGeneratorClient";
import RebuildButton from "./RebuildButton";
import { Cpu, BookOpen, Layers } from "lucide-react";

export default async function SpacePage({
    params
}: {
    params: Promise<{ spaceId: string }>
}) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    let space = null;
    try {
        space = await prisma.courseSpace.findUnique({
            where: { id: spaceId },
            include: {
                lessons: true,
            }
        });
    } catch (e) {
        console.error("Page failed to load space:", e);
    }

    if (!space) {
        return <div className="p-8 text-white">Space tidak ditemukan.</div>;
    }

    // Engine 2 Activation Screen
    if (!space.isGenerated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <SpaceGeneratorClient spaceId={space.id} />
            </div>
        );
    }

    // Dashboard Overview Layer
    const conceptGraph = JSON.parse(space.conceptGraph || "{}");
    const topics = conceptGraph.topics || ["Fundamental", "Konsep Lanjut", "Aplikasi"];

    return (
        <div className="p-8 md:p-12 pb-32 max-w-5xl mx-auto">
            <div className="mb-12">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {space.title}
                    </h1>
                    <RebuildButton spaceId={space.id} />
                </div>
                <p className="text-lg text-slate-300">
                    Selamat datang di ruang belajar khusus yang diekstrak dari <span className="text-accent font-bold">{space.sourcePdfName}</span>.
                    AI telah menyusun peta konsep dan membedah materi ini untuk Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full hover:bg-white/10 transition-colors">
                    <BookOpen className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{space.lessons.length} Bab Materi</h3>
                    <p className="text-slate-400 text-sm flex-1">Modul teori yang dibangun bertahap dari pemahaman dasar hingga lanjut.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full hover:bg-white/10 transition-colors">
                    <Layers className="w-8 h-8 text-orange-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Contoh Bertingkat</h3>
                    <p className="text-slate-400 text-sm flex-1">Puluhan Scaffolded Examples (Easy-Extreme) yang di-generate AI.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full hover:bg-white/10 transition-colors">
                    <Cpu className="w-8 h-8 text-fuchsia-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Resolusi PDF</h3>
                    <p className="text-slate-400 text-sm flex-1">Pembahasan mendalam dari soal-soal tersulit di dokumen asli Anda.</p>
                </div>
            </div>

            {/* Peta Konsep Visual (Mockup List for MVP) */}
            <h2 className="text-2xl font-bold text-white mb-6">Peta Konsep Pembelajaran</h2>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="flex flex-col space-y-4 relative z-10">
                    {topics.map((topic: string, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-white shadow-lg">
                                {i + 1}
                            </div>
                            <div className="h-[2px] w-8 bg-white/20 hidden sm:block"></div>
                            <div className="bg-white/5 p-4 rounded-xl flex-1 border border-white/10 hover:border-accent hover:shadow-[0_0_15px_rgba(232,121,249,0.1)] transition-all cursor-crosshair">
                                <h4 className="font-bold text-lg text-white">{topic}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
