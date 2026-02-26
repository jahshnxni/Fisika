"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, PenTool, MessageSquare, Cpu, Layers, Menu, X } from "lucide-react";

export default function SpaceSidebar({
    spaceId,
    title,
    sourceName,
    isGenerated,
    accentStyles
}: {
    spaceId: string,
    title: string,
    sourceName: string,
    isGenerated: boolean,
    accentStyles: string
}) {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = (
        <>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 px-2">Modul</div>
            <Link onClick={() => setIsOpen(false)} href={`/spaces/${spaceId}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 ${accentStyles}`}>
                <Cpu className="w-4 h-4" /> Overview & Peta
            </Link>

            {isGenerated && (
                <>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-8 px-2">Silabus</div>
                    <Link onClick={() => setIsOpen(false)} href={`/spaces/${spaceId}/lessons`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <BookOpen className="w-4 h-4" /> Materi Fundamental
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href={`/spaces/${spaceId}/practice`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <PenTool className="w-4 h-4" /> Latihan Bertahap
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href={`/spaces/${spaceId}/pdf-drill`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <Layers className="w-4 h-4" /> Bahas Soal PDF
                    </Link>
                </>
            )}
        </>
    );

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md border-b border-white/10 p-4 z-50 flex items-center justify-between">
                <h2 className="text-white font-bold truncate pr-4">{title}</h2>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-white/10 rounded-lg">
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setIsOpen(false)}></div>
            )}

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="p-6 border-b border-white/10 hidden md:block">
                    <Link href="/spaces" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Spaces
                    </Link>
                    <h2 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 truncate">
                        {sourceName}
                    </p>
                </div>

                {/* Mobile upper section replacement */}
                <div className="p-6 border-b border-white/10 md:hidden mt-16">
                    <Link href="/spaces" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Spaces
                    </Link>
                    <p className="text-xs text-slate-400 truncate">Ekstraksi dari: {sourceName}</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navLinks}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link onClick={() => setIsOpen(false)} href={`/spaces/${spaceId}/chat`} className="flex items-center justify-center gap-3 px-3 py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <MessageSquare className="w-4 h-4" /> Tanya Tutor AI
                    </Link>
                </div>
            </aside>
        </>
    );
}
