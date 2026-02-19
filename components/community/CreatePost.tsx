"use client";

import { useState, useRef } from "react";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { createPost } from "@/lib/community";
import { useRouter } from "next/navigation";

export default function CreatePost() {
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setLoading(true);
        // Format tags: Remove #, split by comma/space, join with comma
        const formattedTags = tags
            .replace(/#/g, '')
            .split(/[\s,]+/)
            .filter(t => t.length > 0)
            .join(',');

        const res = await createPost(content, image || undefined, formattedTags || undefined);

        if (res.success) {
            setContent("");
            setTags("");
            setImage(null);
            router.refresh();
        } else {
            alert(res.error || "Gagal memposting. Coba lagi.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-cosmic-900/40 backdrop-blur border border-white/5 rounded-2xl p-4 mb-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[80px]"
                    placeholder="Apa yang kamu pelajari hari ini?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <input
                    type="text"
                    className="w-full bg-transparent text-blue-400 placeholder-slate-600 text-sm focus:outline-none mb-2"
                    placeholder="Tambahkan tags (pisahkan dengan koma, contoh: fluida, mekanika)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                {image && (
                    <div className="relative mt-2 mb-4 w-fit">
                        <img src={image} alt="Upload preview" className="max-h-48 rounded-lg border border-white/10" />
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-white/5 rounded-full transition-colors"
                            title="Upload Gambar"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (!content.trim() && !image)}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Posting
                    </button>
                </div>
            </form>
        </div>
    );
}
