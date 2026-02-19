import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Settings className="w-8 h-8 text-slate-400" />
                Pengaturan
            </h1>

            {/* Account Actions (Keep existing logout as separate or integrate? Current design has it separate) */}
            {/* We'll pass user to form. Logout can stay outside or inside. Let's keep Logout outside for safety/simplicity */}

            <SettingsForm user={user} />

            {/* Account Actions */}
            <div className="bg-cosmic-800/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm mt-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Akun
                </h2>
                <div className="space-y-4">
                    <button className="w-full text-left p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Keluar dari Aplikasi
                    </button>
                </div>
            </div>
        </div>
    );
}
