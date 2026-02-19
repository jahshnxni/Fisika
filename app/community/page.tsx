import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Trophy } from "lucide-react";
import CreatePost from "@/components/community/CreatePost";
import PostCard from "@/components/community/PostCard";
import { getPosts, PostWithUser } from "@/lib/community";
import prisma from "@/lib/prisma";
import CommunityFeed from "@/components/dashboard/CommunityFeed";

export default async function CommunityPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, image: true, role: true, isVerified: true }
    });

    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-cosmic-950 text-slate-100 font-sans selection:bg-primary/30 pb-24">
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary mb-2 flex items-center gap-3">
                        <Users className="w-10 h-10 text-primary" />
                        Komunitas Fisikawan
                    </h1>
                    <p className="text-slate-400 text-lg">Bagikan penemuanmu, tanyakan soal sulit, dan diskusi dengan sesama pelajar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Feed (Left) */}
                    <div className="lg:col-span-8 space-y-6">
                        <CreatePost />

                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-slate-500">Belum ada postingan. Jadilah yang pertama!</p>
                                </div>
                            ) : (
                                posts.map((post: PostWithUser) => (
                                    <PostCard key={post.id} post={post} currentUser={currentUser} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Leaderboard/Activity Widget reusing existing component but styled for sidebar */}
                        <div className="sticky top-24">
                            <CommunityFeed />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
