import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Allow 60s for Gemini file upload + extraction
export const maxDuration = 60;

/**
 * Uploads the PDF directly to Gemini File API (supports vision/OCR),
 * asks Gemini to extract ALL text verbatim, stores result in pdfText.
 * This replaces pdf-parse entirely and handles:
 *   - Scanned PDFs
 *   - PDFs with images/diagrams
 *   - Question-only PDFs (OSN, UTBK, etc.)
 */
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

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");

        // ─── Step 1: Convert browser File to Blob for Gemini ─────────────────
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        // ─── Step 2: Upload PDF to Gemini File API ────────────────────────────
        console.log("[upload-pdf] Uploading PDF to Gemini File API...", file.name, `${(blob.size / 1024).toFixed(0)}KB`);

        const uploadResult = await ai.files.upload({
            file: blob,
            config: { mimeType: "application/pdf", displayName: file.name }
        });

        const fileUri = uploadResult.uri;
        if (!fileUri) throw new Error("Gemini file upload returned no URI");
        console.log("[upload-pdf] Gemini file uploaded:", fileUri);

        // ─── Step 3: Ask Gemini to extract ALL content from the PDF ──────────
        const extractionResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{
                role: "user",
                parts: [
                    {
                        fileData: {
                            fileUri,
                            mimeType: "application/pdf"
                        }
                    },
                    {
                        text: `Ekstrak SEMUA konten dari PDF ini secara verbatim dan lengkap. 
                        
Termasuk:
- Semua teks, soal, pilihan jawaban (A, B, C, D, E)
- Teks dari gambar/diagram jika ada keterangan teksnya
- Tabel dan data
- Nomor soal dan struktur dokumen

Format output:
- Tulis teks apa adanya, urut dari halaman 1 sampai akhir
- Untuk setiap soal, tulis "Soal X: [isi soal]" lalu "A. ... B. ... C. ..."
- Jangan tambahkan penjelasan atau komentar — hanya konten PDF

Mulai ekstraksi:`
                    }
                ]
            }],
            config: { temperature: 0.1 }
        });

        const extractedText = extractionResponse.text || "";
        console.log("[upload-pdf] Extraction done, chars:", extractedText.length);

        // ─── Step 4: Fallback to minimal text if extraction empty ─────────────
        if (!extractedText || extractedText.trim().length < 30) {
            // Try to clean up the Gemini file
            try { await ai.files.delete({ name: uploadResult.name || "" }); } catch { /* ignore */ }
            return NextResponse.json({ error: "Gemini tidak dapat membaca isi PDF ini. PDF mungkin terproteksi atau rusak." }, { status: 400 });
        }

        // ─── Step 5: Delete Gemini file (ephemeral — only needed for extraction) 
        try { await ai.files.delete({ name: uploadResult.name || "" }); } catch { /* ignore */ }

        // ─── Step 6: Create CourseSpace in DB ─────────────────────────────────
        const themes = ["modern", "science", "cosmic", "notebook"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const course = await prisma.courseSpace.create({
            data: {
                userId: user.id,
                title: file.name.replace(/\.pdf$/i, ""),
                sourcePdfName: file.name,
                pdfText: extractedText,   // Gemini-extracted (vision-aware!)
                theme: randomTheme,
                isGenerated: false,
                buildStatus: "NEVER_BUILT",
            }
        });

        console.log("[upload-pdf] CourseSpace created:", course.id);
        return NextResponse.json({ success: true, courseId: course.id });

    } catch (e: any) {
        console.error("[upload-pdf] Error:", e.message);
        return NextResponse.json({ error: e.message || "Failed to process PDF." }, { status: 500 });
    }
}
