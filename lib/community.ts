"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Types ---
export type PostWithUser = {
    id: string;
    content: string;
    imageUrl: string | null;
    tags: string | null;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        image: string | null;
        role: string;
        isVerified: boolean;
    };
    _count: {
        comments: number;
        likes: number;
        views: number;
    };
    // Include if current user liked
    likedByMe?: boolean;
};

export type CommentWithUser = {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        image: string | null;
        role: string;
        isVerified: boolean;
    };
};

export type Liker = {
    id: string;
    user: {
        name: string | null;
        image: string | null;
    };
};

// --- Actions ---

export async function createPost(content: string, imageUrl?: string, tags?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    if (user.isRestricted) {
        return { error: "Akun Anda dibatasi dari memposting." };
    }

    try {
        await prisma.post.create({
            data: {
                userId: user.id,
                content,
                imageUrl,
                tags,
            }
        });

        revalidatePath('/community');
        return { success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { error: "Failed to create post" };
    }
}

export async function getPosts(page: number = 1, limit: number = 10) {
    const session = await getServerSession(authOptions);
    let currentUserId = null;

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        currentUserId = user?.id;
    }

    try {
        const posts = await prisma.post.findMany({
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, image: true, role: true, isVerified: true }
                },
                _count: {
                    select: { comments: true, likes: true, views: true }
                },
                likes: currentUserId ? {
                    where: { userId: currentUserId },
                    select: { userId: true }
                } : false
            }
        });

        // Transform to add likedByMe
        return posts.map((post: any) => ({
            ...post,
            likedByMe: post.likes && post.likes.length > 0
        })) as PostWithUser[];

    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
}

export async function likePost(postId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: user.id
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId: user.id
                }
            });
        }

        revalidatePath('/community');
        return { success: !existingLike };
    } catch (error) {
        return { error: "Failed to like post" };
    }
}

export async function addComment(postId: string, content: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    if (user.isRestricted) {
        return { error: "Akun Anda dibatasi dari berkomentar." };
    }

    try {
        await prisma.comment.create({
            data: {
                postId,
                userId: user.id,
                content
            }
        });
        revalidatePath('/community');
        return { success: true };
    } catch (error) {
        return { error: "Failed to add comment" };
    }
}

export async function getComments(postId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true, image: true, role: true, isVerified: true }
                }
            }
        });
        return comments as CommentWithUser[];
    } catch (error) {
        return [];
    }
}

export async function deletePost(postId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    // Allow author OR admin
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: "Post not found" };

    if (post.userId !== user.id && user.role !== "ADMIN") {
        return { error: "Forbidden" };
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath('/community');
    return { success: true };
}

export async function trackView(postId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return; // Only track logged in users for unique views

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return;

    try {
        await prisma.postView.upsert({
            where: {
                postId_userId: {
                    postId,
                    userId: user.id
                }
            },
            create: {
                postId,
                userId: user.id
            },
            update: {} // Do nothing if already exists
        });
    } catch (e) {
        // Ignore errors
    }
}

export async function getLikers(postId: string) {
    try {
        const likes = await prisma.like.findMany({
            where: { postId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            take: 20
        });
        return likes as Liker[];
    } catch (e) {
        return [];
    }
}

export async function restrictUser(userId: string, hours: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser || currentUser.role !== "ADMIN") {
        return { error: "Hanya Admin yang dapat melakukan tindakan ini." };
    }

    try {
        const mutedUntil = new Date();
        mutedUntil.setHours(mutedUntil.getHours() + hours);

        await prisma.user.update({
            where: { id: userId },
            data: {
                isRestricted: true,
                mutedUntil: mutedUntil
            }
        });

        // Optional: Send notification to user
        await prisma.notification.create({
            data: {
                userId: userId,
                title: "Akun Dibatasi",
                message: `Akun Anda telah dibatasi dari memposting selama ${hours} jam karena pelanggaran komunitas.`,
                type: "SYSTEM"
            }
        });

        revalidatePath('/community');
        return { success: true };
    } catch (error) {
        return { error: "Gagal membatasi pengguna." };
    }
}

export async function unrestrictUser(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser || currentUser.role !== "ADMIN") {
        return { error: "Forbidden" };
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            isRestricted: false,
            mutedUntil: null
        }
    });

    revalidatePath('/community');
    return { success: true };
}
