import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Layers, FileText } from "lucide-react";
import DrillItem from "@/components/features/DrillItem";

export default async function SpacePdfDrillPage({
    params
}: {
    params: Promise<{ spaceId: string }>
}) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const space = await prisma.courseSpace.findUnique({
        where: { id: spaceId },
        include: { lessons: { orderBy: { order: "asc" } } }
    });

    if (!space) return <div className="p-8 text-white">Space tidak ditemukan.</div>;

    return (
        <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto">
            <div className="mb-12 flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Layers className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Bahas Soal PDF Asli
                    </h1>
                    <p className="text-slate-400">
                        Penyelesaian mendalam untuk contoh kasus tersulit yang ditemukan langsung di dokumen Anda.
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {space.lessons.length === 0 ? (
                    <p className="text-slate-500 italic">Belum ada pembahasan soal PDF.</p>
                ) : (
                    space.lessons.map((lesson, idx) => (
                        <DrillItem key={lesson.id} lesson={lesson} spaceId={spaceId} />
                    ))
                )}
            </div>
        </div>
    );
}
