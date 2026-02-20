import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateOTP } from "@/lib/otp";
import { sendOTPVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        // Anti enumeration: Always return success message even if user doesn't exist (unless we really want them to know)
        // But for UX, maybe we let them know if they entered a wrong email.
        if (!user) {
            return NextResponse.json({ message: "Jika email terdaftar, kode baru akan dikirim." }, { status: 200 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: "Email sudah terverifikasi" }, { status: 400 });
        }

        // Get latest OTP
        const latestOtp = await prisma.emailOtp.findFirst({
            where: {
                email: normalizedEmail,
                purpose: "VERIFY_EMAIL",
                usedAt: null
            },
            orderBy: { createdAt: 'desc' }
        });

        // Check cooldown and rate limit
        if (latestOtp) {
            if (new Date() < latestOtp.cooldownUntil) {
                const diffSecs = Math.ceil((latestOtp.cooldownUntil.getTime() - Date.now()) / 1000);
                return NextResponse.json(
                    { message: `Tunggu ${diffSecs} detik lagi untuk kirim ulang.` },
                    { status: 429 }
                );
            }

            if (latestOtp.resendCount >= 5) {
                return NextResponse.json(
                    { message: "Batas permintaan pengiriman ulang tercapai. Silakan coba lagi besok." },
                    { status: 429 }
                );
            }
        }

        // Generate new OTP (Pattern A)
        const otp = generateOTP(6);
        const otpHash = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const cooldownUntil = new Date(Date.now() + 60 * 1000); // 60 seconds cooldown

        // Save new OTP
        await prisma.emailOtp.create({
            data: {
                email: normalizedEmail,
                otpHash,
                purpose: "VERIFY_EMAIL",
                expiresAt,
                cooldownUntil,
                resendCount: latestOtp ? latestOtp.resendCount + 1 : 1
            }
        });

        // Dispatch Email
        await sendOTPVerificationEmail(normalizedEmail, otp);

        return NextResponse.json({ message: "Kode OTP baru telah dikirim ke email Anda" }, { status: 200 });
    } catch (error) {
        console.error("Resend OTP error:", error);
        return NextResponse.json({ message: "Terjadi kesalahan server saat mengirim ulang OTP" }, { status: 500 });
    }
}
