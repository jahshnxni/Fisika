"use client";

import { Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PathNode = {
    id: string;
    title: string;
    status: string;
    type: string;
    color: string;
    slug: string;
};

const DailyPath = ({ nodes }: { nodes: PathNode[] }) => {

    return (
        <div className="w-full overflow-x-auto pb-6 pt-2 custom-scrollbar">
            <div className="flex items-center gap-8 min-w-max px-4">
                {nodes.map((node, index) => {
                    const isLocked = node.status === "locked";
                    const isCompleted = node.status === "completed";
                    const isCurrent = node.status === "current";

                    return (
                        <div key={node.id} className="relative group flex flex-col items-center">

                            {/* Connector Line */}
                            {index < nodes.length - 1 && (
                                <div className={cn(
                                    "absolute top-[2.5rem] left-[50%] w-[calc(100%+2rem)] h-1 -z-10",
                                    isCompleted ? "bg-primary/50" : "bg-white/10"
                                )}></div>
                            )}

                            {/* Node Circle (Planet) */}
                            <Link href={isLocked ? "#" : `/learn#${node.slug}`} className={cn(
                                "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                                isLocked ? "bg-slate-800 border-4 border-slate-700 grayscale cursor-not-allowed" : `bg-gradient-to-br ${node.color} cursor-pointer hover:scale-110 hover:shadow-2xl hover:shadow-${node.color.split('-')[1]}-500/40`,
                                isCurrent && "ring-4 ring-white/20 animate-pulse-slow scale-105"
                            )}>
                                {isCompleted && (
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-cosmic-950 z-20">
                                        <Check className="w-4 h-4 text-black font-bold" />
                                    </div>
                                )}
                                {isLocked && <Lock className="w-8 h-8 text-slate-500" />}
                                {isCurrent && <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>}

                                {/* Inner glow or detail */}
                                {!isLocked && (
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
                                )}
                            </Link>

                            {/* Label */}
                            <div className="mt-4 text-center">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold border",
                                    isCurrent
                                        ? "bg-white text-cosmic-950 border-white"
                                        : isLocked ? "bg-slate-800 text-slate-500 border-slate-700" : "bg-cosmic-800/80 text-white border-white/20 backdrop-blur-sm"
                                )}>
                                    {node.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DailyPath;
