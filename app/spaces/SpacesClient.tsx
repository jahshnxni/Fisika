"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Loader2, Sparkles, Plus, ArrowRight } from "lucide-react";

export default function SpacesClient({ initialSpaces }: { initialSpaces: any[] }) {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Hanya format PDF yang didukung 😅");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/ai/upload-pdf", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal mengunggah PDF");
            }

            // Redirect to the newly generated space
            router.push(`/spaces/${data.courseId}`);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-16">
            {/* Upload Zone */}
            <div
                className={`max-w-3xl mx-auto rounded-3xl border-2 border-dashed p-10 text-center transition-all ${isDragging
                        ? "border-accent bg-accent/10 scale-[1.02]"
                        : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`p-4 rounded-full ${isDragging ? "bg-accent/20" : "bg-slate-800"}`}>
                        {isUploading ? (
                            <Loader2 className="w-10 h-10 text-accent animate-spin" />
                        ) : (
                            <UploadCloud className={`w-10 h-10 ${isDragging ? "text-accent" : "text-slate-400"}`} />
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {isUploading ? "Membedah Modul PDF..." : "Tarik File PDF ke Sini"}
                        </h3>
                        {error && <p className="text-red-400 mb-2">{error}</p>}
                        <p className="text-slate-400 text-sm">
                            {isUploading
                                ? "AI Tutor sedang meracik materi & latihan soal secara progresif ⏳"
                                : "Maksimal 10MB. Otomatis menjadi kursus canggih."}
                        </p>
                    </div>

                    {!isUploading && (
                        <div className="mt-4">
                            <label className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Cari File
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* List of Existing Spaces */}
            {initialSpaces && initialSpaces.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Ruang Belajar Anda
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialSpaces.map((space) => (
                            <div
                                key={space.id}
                                onClick={() => router.push(`/spaces/${space.id}`)}
                                className="bg-cosmic-800 border border-slate-700 p-6 rounded-2xl hover:border-accent hover:shadow-[0_0_20px_rgba(232,121,249,0.1)] transition-all cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-slate-800 rounded-xl">
                                        <FileText className="w-5 h-5 text-accent" />
                                    </div>
                                    {space.isGenerated ? (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">SIAP</span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg">DRAFT</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{space.title}</h3>
                                <p className="text-slate-400 text-xs mb-4 flex-1">Dari sumber: {space.sourcePdfName || "Dokumen"}</p>

                                <div className="flex items-center text-primary text-sm font-bold group-hover:translate-x-1 transition-transform mt-auto">
                                    Buka Ruang Belajar <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
