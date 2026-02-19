"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, Button } from "@/components/ui/Card";
import StarryBackground from "@/components/ui/StarryBackground";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const registered = searchParams.get("registered");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.error) {
                setError("Email atau password salah");
            } else {
                router.push("/learn");
                router.refresh();
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic-900 p-4 relative overflow-hidden">
            <StarryBackground />
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse duration-[5000ms]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-500"></div>

            <Card className="w-full max-w-md p-8 bg-cosmic-800/60 backdrop-blur-xl border-cosmic-700 shadow-2xl z-10 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>

                <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-white">
                    Selamat Datang Kembali 👋
                </h1>

                {registered && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded-lg mb-6 text-sm text-center animate-in fade-in slide-in-from-top-4">
                        Registrasi berhasil! Silakan login.
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-sm text-center animate-in shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-slate-600"
                            placeholder="email@sekolah.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-slate-600"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold bg-white text-cosmic-900 hover:bg-slate-200 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {loading ? "Memuat..." : "Masuk"}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-primary hover:text-accent transition-colors font-bold underline decoration-2 underline-offset-4">
                        Daftar dulu
                    </Link>
                </div>

                {/* 
                <div className="mt-8 pt-6 border-t border-cosmic-700 text-center">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/learn" })}
                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto w-fit"
                    >
                        <span>Masih mau pakai Google?</span>
                    </button>
                </div> 
                */}
            </Card>
        </div>
    );
}
