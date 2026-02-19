"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, Trophy, Star } from "lucide-react";
import { getUnreadNotifications, markAllNotificationsAsRead } from "@/lib/notification";
import { useRouter } from "next/navigation";

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
};

export default function NotificationDropdown({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async () => {
        const data = await getUnreadNotifications(userId);
        setNotifications(data);
        setUnreadCount(data.length);
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    // Handle outside click to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead(userId);
        setNotifications([]);
        setUnreadCount(0);
        router.refresh();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "ACCOMPLISHMENT": return <Trophy className="w-5 h-5 text-yellow-400" />;
            case "LEVEL_UP": return <Star className="w-5 h-5 text-purple-400" />;
            case "LEAGUE_UP": return <Trophy className="w-5 h-5 text-blue-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Notifikasi"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-cosmic-900 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-cosmic-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <h3 className="font-bold text-white">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                            >
                                <Check className="w-3 h-3" />
                                Tandai sudah dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Bell className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                <p className="text-sm">Tidak ada notifikasi baru</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                    {getIcon(notif.type)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-white mb-1">{notif.title}</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                                                <span className="text-[10px] text-slate-600 mt-2 block">
                                                    {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
