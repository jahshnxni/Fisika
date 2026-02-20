"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button } from "@/components/ui/Card";
import StarryBackground from "@/components/ui/StarryBackground";

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [cooldown, setCooldown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!emailParam) {
            router.push("/register");
        }
    }, [emailParam, router]);

    // Timer for resend cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
        if (/^[0-9]{1,6}$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split("").forEach((char, idx) => {
                if (idx < 6) newOtp[idx] = char;
            });
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Harap masukkan 6 digit kode OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailParam, otp: otpString }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Berhasil! Mengarahkan ke halaman login...");
                setTimeout(() => {
                    router.push("/login?verified=true");
                }, 2000);
            } else {
                setError(data.message || "Kode OTP salah atau sudah kedaluwarsa.");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsResending(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailParam }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Kode OTP baru telah dikirim!");
                setCooldown(60);
                setCanResend(false);
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(data.message || "Gagal mengirim ulang OTP");
            }
        } catch (err) {
            setError("Terjadi kesalahan teknis");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic-900 p-4 relative overflow-hidden">
            <StarryBackground />

            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

            <Card className="w-full max-w-md p-8 bg-cosmic-800/80 backdrop-blur-xl border-cosmic-700 shadow-2xl z-10 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary mb-2">
                    Cek Email Kamu!
                </h1>

                <p className="text-slate-400 mb-6 text-sm">
                    Kami telah mengirimkan 6-digit kode OTP ke <br />
                    <strong className="text-white">{emailParam}</strong>
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-sm animate-shake">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded-lg mb-6 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-2 mb-8">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => { inputRefs.current[idx] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-center text-2xl font-bold bg-cosmic-900 border border-cosmic-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-primary focus:bg-cosmic-800 transition-all outline-none"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || otp.join("").length !== 6 || !!success}
                        className="w-full py-4 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform shadow-lg shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi Akun"}
                    </Button>
                </form>

                <div className="mt-8">
                    <p className="text-sm text-slate-400 mb-2">Belum menerima kode?</p>
                    <button
                        onClick={handleResend}
                        disabled={!canResend || isResending}
                        className="text-primary hover:text-accent font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? "Mengirim ulang..." :
                            canResend ? "Kirim ulang kode OTP" :
                                `Kirim ulang kode OTP dalam ${cooldown}s`}
                    </button>
                    <p className="text-xs text-slate-500 mt-4 italic">
                        Cek juga folder Spam/Promotions jika email tidak muncul.
                    </p>
                </div>

                <div className="mt-6 border-t border-cosmic-700 pt-6">
                    <button
                        onClick={() => router.push('/register')}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                        &larr; Gunakan email lain
                    </button>
                </div>
            </Card>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cosmic-900 text-white">Memuat halaman...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}

