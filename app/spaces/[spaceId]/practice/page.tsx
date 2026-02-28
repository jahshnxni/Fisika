import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PracticeClient from "./PracticeClient";

export default async function SpacePracticePage({
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
        <PracticeClient
            spaceId={spaceId}
            lessons={space.lessons.map(l => ({
                id: l.id,
                title: l.title,
                scaffoldedMdx: l.scaffoldedMdx,
            }))}
        />
    );
}
