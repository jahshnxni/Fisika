import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import "@/lib/pdf-polyfill";
// @ts-expect-error - pdf-parse does not export types natively and lacks a default ES module export
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        // Convert File to Buffer for pdf-parse
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF text
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text;

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Could not extract any readable text from this PDF." }, { status: 400 });
        }

        // Randomly pick an initial theme based on the 4 cosmic/science styles
        const themes = ["modern", "science", "cosmic", "notebook"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        // Create the initial Course Space placeholder
        const course = await prisma.courseSpace.create({
            data: {
                userId: user.id,
                title: file.name.replace(".pdf", ""),
                sourcePdfName: file.name,
                pdfText: text,
                theme: randomTheme,
                isGenerated: false,
            }
        });

        return NextResponse.json({ success: true, courseId: course.id });

    } catch (e: any) {
        console.error("PDF Upload Error:", e);
        return NextResponse.json({ error: e.message || "Failed to process PDF." }, { status: 500 });
    }
}
