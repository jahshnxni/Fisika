"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Trash2, Eye, ShieldCheck, BadgeCheck, Gavel } from "lucide-react";
import { likePost, addComment, getComments, deletePost, trackView, restrictUser, CommentWithUser, PostWithUser } from "@/lib/community";
import { useRouter } from "next/navigation";
import TimeAgo from "@/components/ui/TimeAgo";

export default function PostCard({ post, currentUser }: { post: PostWithUser, currentUser: any }) {
    const router = useRouter();
    const [liked, setLiked] = useState(post.likedByMe);
    const [likesCount, setLikesCount] = useState(post._count.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        trackView(post.id);
    }, [post.id]);

    const handleLike = async () => {
        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikesCount(prev => isNowLiked ? prev + 1 : prev - 1);
        await likePost(post.id);
    };

    const handleDelete = async () => {
        if (!confirm("Hapus postingan ini?")) return;
        setIsDeleting(true);
        const res = await deletePost(post.id);
        if (res.success) {
            router.refresh();
        } else {
            alert("Gagal menghapus postingan.");
            setIsDeleting(false);
        }
    };

    const handleBan = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghukum ${post.user.name}? User ini tidak akan bisa memposting selama 24 jam.`)) return;
        const res = await restrictUser(post.user.id, 24);
        if (res.success) {
            alert("User berhasil dihukum.");
        } else {
            alert(res.error || "Gagal menghukum user.");
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoadingComments(true);
            const data = await getComments(post.id);
            setComments(data);
            setLoadingComments(false);
        }
        setShowComments(!showComments);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const tempComment: CommentWithUser = {
            id: Date.now().toString(),
            content: newComment,
            createdAt: new Date(),
            user: {
                id: currentUser.id,
                name: currentUser.name || "You",
                image: currentUser.image || null,
                role: currentUser.role,
                isVerified: currentUser.isVerified
            }
        };

        setComments([...comments, tempComment]);
        setNewComment("");
        await addComment(post.id, newComment);
    };

    const isAdmin = currentUser?.role === "ADMIN";
    const isAuthor = currentUser?.id === post.user.id;

    if (isDeleting) return null;

    return (
        <div className="bg-cosmic-900/40 backdrop-blur border border-white/5 rounded-2xl p-4 mb-4 hover:border-white/10 transition-colors group">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cosmic-800 border-2 border-transparent group-hover:border-primary/50 transition-colors overflow-hidden relative">
                        {post.user.image ? (
                            <img src={post.user.image} alt={post.user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-white">
                                {post.user.name?.[0] || "?"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-white text-sm hover:underline cursor-pointer">{post.user.name}</h4>
                            {post.user.isVerified && (
                                <div className="relative group/badge">
                                    <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] bg-black/80 text-white rounded opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Verified</span>
                                </div>
                            )}
                            {post.user.role === "ADMIN" && (
                                <div className="flex items-center gap-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/30 font-bold shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                    <ShieldCheck className="w-3 h-3" /> ADMIN
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-slate-400">
                            <TimeAgo date={post.createdAt} />
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Admin Actions */}
                    {isAdmin && !isAuthor && (
                        <button
                            onClick={handleBan}
                            className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                            title="Hukum User (Banned 24 Jam)"
                        >
                            <Gavel className="w-4 h-4" />
                        </button>
                    )}

                    {(isAuthor || isAdmin) && (
                        <button
                            onClick={handleDelete}
                            className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-full"
                            title="Hapus Postingan"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <p className="text-slate-200 text-sm mb-3 whitespace-pre-wrap leading-relaxed">
                {post.content}
            </p>

            {/* Tags */}
            {post.tags && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="text-xs font-medium text-blue-400 bg-blue-400/5 px-2 py-1 rounded-md hover:bg-blue-400/10 cursor-pointer transition-colors">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            )}

            {/* Image */}
            {post.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-4 border border-white/5 bg-black/20">
                    <img src={post.imageUrl} alt="Post content" className="w-full object-cover max-h-[400px]" loading="lazy" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 border-t border-white/5 pt-3">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-400'}`}
                >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                </button>

                <button
                    onClick={toggleComments}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post._count.comments}</span>
                </button>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-400 ml-auto" title="Dilihat">
                    <Eye className="w-4 h-4" />
                    <span>{post._count.views}</span>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4 mb-4">
                        {loadingComments ? (
                            <p className="text-center text-xs text-slate-500">Memuat komentar...</p>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 group/comment">
                                    <div className="w-8 h-8 rounded-full bg-cosmic-800 border border-white/10 overflow-hidden shrink-0">
                                        {comment.user.image ? (
                                            <img src={comment.user.image} alt={comment.user.name || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white">
                                                {comment.user.name?.[0] || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 flex-1 border border-transparent group-hover/comment:border-white/10 transition-colors">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-xs text-white">{comment.user.name}</span>
                                                {comment.user.isVerified && <BadgeCheck className="w-3 h-3 text-blue-400 fill-blue-400/10" />}
                                                {comment.user.role === "ADMIN" && <ShieldCheck className="w-3 h-3 text-orange-400" />}
                                            </div>
                                            <span className="text-[10px] text-slate-500">
                                                <TimeAgo date={comment.createdAt} />
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xs text-slate-500">Belum ada komentar. Jadilah yang pertama!</p>
                        )}
                    </div>

                    {/* Comment Input */}
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Tulis komentar..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="p-2 bg-primary rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
