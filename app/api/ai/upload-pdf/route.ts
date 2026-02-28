import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { callGeminiRotated, uploadFileToGemini } from "@/lib/geminiRotator";

export const maxDuration = 60;

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

async function extractWithGeminiVision(buffer: Buffer, filename: string): Promise<string> {
    try {
        const { GoogleGenAI } = await import("@google/genai");
        // Upload using key rotation
        const { fileUri, name, apiKey } = await uploadFileToGemini(
            new Uint8Array(buffer),
            "application/pdf",
            filename
        );

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [
                    { fileData: { fileUri, mimeType: "application/pdf" } },
                    { text: `Ekstrak SEMUA konten dari PDF ini secara verbatim dan lengkap. Termasuk semua soal, pilihan jawaban (A,B,C,D,E), nomor soal, tabel, dan struktur dokumen. Tulis apa adanya dari halaman 1 sampai akhir. Untuk setiap soal tulis: "Soal X: [isi soal]" lalu "A. ... B. ... C. ..." Hanya output teks, tanpa komentar.` }
                ]
            }],
            config: { temperature: 0.05 }
        });
        // Cleanup
        try { await ai.files.delete({ name }); } catch { /* ignore */ }
        return response.text || "";
    } catch (e: any) {
        console.warn("[upload-pdf] Gemini vision failed:", e.message?.slice(0, 120));
        return "";
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ─── Phase 1: pdf-parse (free, instant) ──────────────────────────────
        console.log("[upload-pdf] Trying pdf-parse...");
        let extractedText = await extractWithPdfParse(buffer);
        let extractionMethod = "pdf-parse";

        // ─── Phase 2: Gemini Vision fallback (if pdf-parse too short) ────────
        if (extractedText.trim().length < 300) {
            console.log(`[upload-pdf] pdf-parse only ${extractedText.length} chars → trying Gemini Vision with key rotation...`);
            const visionText = await extractWithGeminiVision(buffer, file.name);
            if (visionText.length > extractedText.length) {
                extractedText = visionText;
                extractionMethod = "gemini-vision";
            }
        }

        // ─── Phase 3: Always proceed (build pipeline handles blank text) ──────
        if (!extractedText || extractedText.trim().length < 30) {
            extractedText = `[PDF: ${file.name} — ${buffer.length} bytes. Teks tidak dapat diekstrak. AI akan membangun materi secara heuristik.]`;
        }

        console.log(`[upload-pdf] ✅ ${extractedText.length} chars via ${extractionMethod}`);

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

        return NextResponse.json({ success: true, courseId: course.id, extractionMethod, textLength: extractedText.length });

    } catch (e: any) {
        console.error("[upload-pdf] Fatal:", e.message);
        return NextResponse.json({ error: e.message || "Failed to process PDF." }, { status: 500 });
    }
}
