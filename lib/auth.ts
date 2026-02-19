import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { isSystemAdmin } from "@/lib/admin-config"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Email tidak ditemukan atau menggunakan login Google");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Password salah");
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
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub;

                // Sync Admin Role from Env
                if (session.user.email && isSystemAdmin(session.user.email)) {
                    // Check if DB needs update (optimization: only if not already admin in session, 
                    // but session doesn't have role yet usually. 
                    // So we query DB or just update blind? Update blind is safer for "force admin".)
                    // However, inside session callback we don't want to await DB write every time.
                    // Better to do it in `jwt` or `signIn`? 
                    // `jwt` runs less often? No.
                    // Let's do it in `signIn` event if possible? 
                    // Actually `session` callback is called often. 
                    // Let's attach role from token.
                }
                // @ts-ignore
                session.user.role = token.role;
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id;
                // @ts-ignore
                token.role = user.role;

                // Check Env Admin
                if (user.email && isSystemAdmin(user.email)) {
                    // Update DB if needed
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (dbUser && dbUser.role !== 'ADMIN') {
                        await prisma.user.update({
                            where: { email: user.email },
                            data: { role: 'ADMIN', isVerified: true }
                        });
                        token.role = 'ADMIN';
                    }
                }
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
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
