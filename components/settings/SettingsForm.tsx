"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Bell, User as UserIcon, Camera, Save, Loader2, Volume2 } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

interface SettingsFormProps {
    user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        image: user.image || "",
        enableNotifications: user.enableNotifications ?? true,
        enableSound: user.enableSound ?? true,
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await updateProfile(formData);
            if (res?.success) {
                alert("Profil berhasil diperbarui!");
                router.refresh();
            } else {
                alert("Gagal memperbarui profil.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    };

    // Simple image handler - in a real app, this would upload to S3/Cloudinary
    // Here we just allow pasting a URL for simplicity, or we could add a basic file reader to dataURI
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for Data URI
                alert("File terlalu besar (Maks 1MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange("image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Section */}
            <div className="bg-cosmic-800/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    Profil Pengguna
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 rounded-full bg-cosmic-900 border-2 border-primary/30 overflow-hidden group">
                            {formData.image ? (
                                <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                                    {formData.name?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-8 h-8 text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                        <span className="text-xs text-slate-400">Klik foto untuk mengganti</span>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap / Username</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full bg-cosmic-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Masukkan nama anda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="w-full bg-cosmic-950/50 border border-white/5 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-cosmic-800/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Preferensi
                </h2>
                <div className="space-y-4">
                    {/* Notifications */}
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleChange("enableNotifications", !formData.enableNotifications)}>
                        <div>
                            <div className="font-medium text-white">Notifikasi Email</div>
                            <div className="text-xs text-slate-400">Terima update tentang progress belajar</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.enableNotifications ? 'bg-primary' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.enableNotifications ? 'right-1' : 'left-1'}`} />
                        </div>
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleChange("enableSound", !formData.enableSound)}>
                        <div>
                            <div className="font-medium text-white flex items-center gap-2">
                                Efek Suara <Volume2 className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-xs text-slate-400">Suara saat benar/salah mengerjakan soal</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.enableSound ? 'bg-primary' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.enableSound ? 'right-1' : 'left-1'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
}
