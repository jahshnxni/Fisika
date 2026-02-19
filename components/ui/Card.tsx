import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("rounded-xl border shadow-sm", className)}>
            {children}
        </div>
    );
}

export function Button({ className, children, onClick, disabled, variant = 'primary' }: any) {
    const base = "px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: any = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_0_15px_rgba(139,92,246,0.5)]",
        secondary: "bg-slate-700 text-white hover:bg-slate-600",
        outline: "border-2 border-slate-600 text-slate-300 hover:border-slate-400"
    };

    return (
        <button className={cn(base, variants[variant], className)} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}
