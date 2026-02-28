import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const maxDuration = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function extractWithPdfParse(buffer: Buffer): Promise<string> {
    try {
        const pdfParse = (await import("pdf-parse")).default;
        const data = await pdfParse(buffer);
        return data.text || "";
    } catch (e: any) {
        console.warn("[upload-pdf] pdf-parse failed:", e.message?.slice(0, 80));
        return "";
    }
}

async function extractWithGeminiVision(buffer: Buffer, filename: string, geminiKey: string): Promise<string> {
    try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
        const uploadResult = await ai.files.upload({
            file: blob,
            config: { mimeType: "application/pdf", displayName: filename }
        });

        const fileUri = uploadResult.uri;
        if (!fileUri) throw new Error("No file URI returned");
        console.log("[upload-pdf] Gemini File API uploaded:", fileUri);

        // Use gemini-1.5-flash-8b for vision — higher free quota than flash-2.0
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [
                    { fileData: { fileUri, mimeType: "application/pdf" } },
                    { text: `Ekstrak SEMUA konten dari PDF ini secara verbatim dan lengkap. Termasuk semua soal, pilihan jawaban (A,B,C,D,E), nomor soal, tabel, dan struktur dokumen. Tulis apa adanya dari halaman 1 sampai akhir. Untuk soal tulis: "Soal X: [isi soal]" lalu "A. ... B. ... C. ..." Hanya output teks, tanpa komentar.` }
                ]
            }],
            config: { temperature: 0.05 }
        });

        // Clean up Gemini file
        try { await ai.files.delete({ name: uploadResult.name || "" }); } catch { /* ignore */ }

        return response.text || "";
    } catch (e: any) {
        console.warn("[upload-pdf] Gemini vision failed:", e.message?.slice(0, 120));
        return "";
    }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const geminiKey = process.env.GEMINI_API_KEY || "";

        // ─── Phase 1: Try pdf-parse first (free, fast) ────────────────────────
        console.log("[upload-pdf] Trying pdf-parse...");
        let extractedText = await extractWithPdfParse(buffer);
        let extractionMethod = "pdf-parse";

        // ─── Phase 2: If pdf-parse gave too little text → try Gemini vision ──
        const MIN_TEXT_LENGTH = 300;
        if (extractedText.trim().length < MIN_TEXT_LENGTH && geminiKey) {
            console.log(`[upload-pdf] pdf-parse only got ${extractedText.length} chars, trying Gemini vision...`);
            const visionText = await extractWithGeminiVision(buffer, file.name, geminiKey);
            if (visionText.length > extractedText.length) {
                extractedText = visionText;
                extractionMethod = "gemini-vision";
            }
        }

        // ─── Phase 3: If BOTH failed, still create the space (build will handle) 
        if (!extractedText || extractedText.trim().length < 30) {
            console.warn("[upload-pdf] All extraction methods failed, creating space with empty text");
            extractedText = `[PDF: ${file.name} — teks tidak dapat diekstrak secara otomatis. AI akan mencoba membangun materi secara heuristik.]`;
        }

        console.log(`[upload-pdf] Extracted ${extractedText.length} chars via ${extractionMethod}`);

        // ─── Create CourseSpace ───────────────────────────────────────────────
        const themes = ["modern", "science", "cosmic", "notebook"];
        const course = await prisma.courseSpace.create({
            data: {
                userId: user.id,
                title: file.name.replace(/\.pdf$/i, ""),
                sourcePdfName: file.name,
                pdfText: extractedText,
                theme: themes[Math.floor(Math.random() * themes.length)],
                isGenerated: false,
                buildStatus: "NEVER_BUILT",
            }
        });

        return NextResponse.json({
            success: true,
            courseId: course.id,
            extractionMethod,
            textLength: extractedText.length
        });

    } catch (e: any) {
        console.error("[upload-pdf] Fatal:", e.message);
        return NextResponse.json({ error: e.message || "Failed to process PDF." }, { status: 500 });
    }
}
