import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateOTP } from "@/lib/otp";
import { sendOTPVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Nama, Email, dan password wajib diisi" },
                { status: 400 }
            );
        }

        // Validate basic email format using Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Format email tidak valid" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            if (existingUser.emailVerified) {
                return NextResponse.json(
                    { message: "Email sudah terdaftar dan terverifikasi" },
                    { status: 400 }
                );
            }
            // If exists but not verified, we can just resend OTP or let them register again (overwrite pass? No, let's keep pass or update it)
            // For simplicity, we'll update their password and name if they re-register before verifying.
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { name, password: hashedPassword }
            });
        } else {
            // Hash password and create new unverified user
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    xp: 0,
                    hearts: 5,
                    track: "BASIC",
                    // emailVerified remains null
                },
            });
        }

        // Generate 6-digit OTP
        const otp = generateOTP(6);
        const otpHash = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const cooldownUntil = new Date(Date.now() + 60 * 1000); // 1 minute cooldown

        // Save OTP to database (upsert to invalidate any old ones for THIS purpose, or just insert new)
        // Best practice: mark others as used/expired, or just create a new record and sort by createdAt.
        await prisma.emailOtp.create({
            data: {
                email: normalizedEmail,
                otpHash,
                purpose: "VERIFY_EMAIL",
                expiresAt,
                cooldownUntil,
            }
        });

        // Send Email asynchronously (don't await or catch silently so it doesn't break the response if SMTP is slow)
        // Wait, Vercel kills background processes. We need to await it.
        await sendOTPVerificationEmail(normalizedEmail, otp);

        return NextResponse.json(
            { message: "OTP telah dikirim ke email Anda", email: normalizedEmail },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration/OTP error:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan server saat mendaftar" },
            { status: 500 }
        );
    }
}

