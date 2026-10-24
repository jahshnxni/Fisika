import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { isSystemAdmin } from "@/lib/admin-config"

// Auto-align NEXTAUTH_URL with Vercel deployment if running in cloud
if (process.env.VERCEL_URL && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const authOptions: NextAuthOptions = {
    // Pure JWT session strategy without fragile adapter writes that fail on read-only serverless
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET_PLACEHOLDER",
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan password wajib diisi");
                }

                // Demo / Quick Test User handler
                if (credentials.email === "demo@fisika.edu" && credentials.password === "demo123") {
                    let demoUser = await prisma.user.findUnique({ where: { email: "demo@fisika.edu" } });
                    if (!demoUser) {
                        const hashedPassword = await bcrypt.hash("demo123", 10);
                        demoUser = await prisma.user.create({
                            data: {
                                name: "Siswa Unggul TKA",
                                email: "demo@fisika.edu",
                                password: hashedPassword,
                                isVerified: true,
                                xp: 250,
                                hearts: 5,
                                coins: 150,
                            }
                        });
                    }
                    return {
                        id: demoUser.id,
                        name: demoUser.name,
                        email: demoUser.email,
                        image: demoUser.image,
                    };
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error("Akun dengan email ini belum terdaftar");
                }

                if (!user.password) {
                    throw new Error("Akun ini terdaftar lewat Google. Silakan masuk dengan Google.");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Password yang Anda masukkan salah");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user.email) return false;
                try {
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {
                            name: user.name || undefined,
                            image: user.image || undefined,
                        },
                        create: {
                            email: user.email,
                            name: user.name || "Siswa Fisika",
                            image: user.image,
                            isVerified: true,
                            hearts: 5,
                            xp: 100,
                        }
                    });
                } catch (err) {
                    console.warn("signIn callback db sync skipped (ignoring error to allow OAuth sign-in):", err);
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub || `user-${session.user.email || 'guest'}`;
                // @ts-ignore
                session.user.role = token.role || "USER";
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id || token.sub || `user-${user.email || Date.now()}`;
                // @ts-ignore
                token.role = user.role || "USER";
            }
            if (token.email) {
                try {
                    const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
                    if (dbUser) {
                        token.sub = dbUser.id;
                        token.role = dbUser.role;
                    }
                } catch (e) {
                    // Fallback gracefully
                }
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "physica-nextauth-secret-key-prod-2025-fallback",
    pages: {
        signIn: '/login',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    theme: {
        colorScheme: "dark",
        brandColor: "#8b5cf6",
    },
}
