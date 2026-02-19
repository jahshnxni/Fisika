"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button } from "@/components/ui/Card";
import StarryBackground from "@/components/ui/StarryBackground";

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                // Auto login or redirect to login
                router.push("/login?registered=true");
            } else {
                const json = await res.json();
                setError(json.message || "Registrasi gagal");
            }
        } catch (err) {
            setError("Terjadi kesalahan jaringan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic-900 p-4 relative overflow-hidden">
            <StarryBackground />
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <Card className="w-full max-w-md p-8 bg-cosmic-800/50 backdrop-blur-xl border-cosmic-700 shadow-2xl z-10">
                <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                    Mulai Petualangan Fisika! 🚀
                </h1>
                <p className="text-center text-slate-400 mb-8">
                    Bergabung dengan ribuan siswa lainnya.
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            placeholder="Albert Einstein"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            placeholder="albert@relativity.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform"
                    >
                        {loading ? "Mendaftar..." : "Daftar Sekarang"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-accent hover:underline font-bold">
                        Login di sini
                    </Link>
                </div>
            </Card>
        </div>
    );
}
