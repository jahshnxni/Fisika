"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, Button } from "@/components/ui/Card";
import StarryBackground from "@/components/ui/StarryBackground";

function LoginContent() {
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

            {/* Google Login */}
            <Button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/learn" })}
                className="w-full py-3 mb-6 bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2 font-bold transition-all shadow-md group"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Masuk dengan Google
            </Button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-cosmic-800/60 px-2 text-slate-400">Atau manual</span>
                </div>
            </div>

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
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic-900 p-4 relative overflow-hidden">
            <StarryBackground />
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse duration-[5000ms]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-500"></div>

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
