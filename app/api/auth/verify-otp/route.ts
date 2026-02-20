import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email dan OTP wajib diisi" }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists and needs verification
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: "Email sudah terverifikasi" }, { status: 200 });
        }

        // Find the latest active OTP for this email
        const otpRecord = await prisma.emailOtp.findFirst({
            where: {
                email: normalizedEmail,
                purpose: "VERIFY_EMAIL",
                usedAt: null
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) {
            return NextResponse.json({ message: "Kode OTP tidak ditemukan atau sudah digunakan" }, { status: 400 });
        }

        if (new Date() > otpRecord.expiresAt) {
            return NextResponse.json({ message: "Kode OTP sudah usang (expired). Silakan minta ulang." }, { status: 400 });
        }

        if (otpRecord.attemptCount >= otpRecord.maxAttempts) {
            return NextResponse.json({ message: "Terlalu banyak percobaan salah. Silakan minta kode baru." }, { status: 429 });
        }

        // Verify OTP Hash
        const isValid = await bcrypt.compare(otp.toString(), otpRecord.otpHash);

        if (!isValid) {
            // Increment attempt count
            await prisma.emailOtp.update({
                where: { id: otpRecord.id },
                data: { attemptCount: { increment: 1 } }
            });

            const remaining = otpRecord.maxAttempts - (otpRecord.attemptCount + 1);
            return NextResponse.json({ message: `Kode OTP salah. Sisa percobaan: ${remaining}` }, { status: 400 });
        }

        // Success: Use transaction to mark user as verified and OTP as used
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            }),
            prisma.emailOtp.update({
                where: { id: otpRecord.id },
                data: { usedAt: new Date() }
            })
        ]);

        return NextResponse.json({ message: "Email berhasil diverifikasi" }, { status: 200 });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
    }
}
