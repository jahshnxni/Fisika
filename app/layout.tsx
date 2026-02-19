import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { cn } from "@/lib/utils"; // Ensure you have this utility

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Physica Mastery",
  description: "Platform belajar fisika terbaik untuk Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={cn(inter.variable, "bg-cosmic-950 font-sans antialiased text-slate-100")}>
        <SessionProviderWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
