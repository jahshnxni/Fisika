import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { COURSE_BUILDER_PROMPT, QUESTIONS_ONLY_BUILDER_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";
import { callGeminiRotated } from "@/lib/geminiRotator";

export const maxDuration = 60;

function cleanJson(raw: string): string {
    return raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function setStep(spaceId: string, status: string, step: string | null, progress: number, error?: string | null) {
    await prisma.courseSpace.update({
        where: { id: spaceId },
        data: { buildStatus: status, buildStep: step, buildProgress: progress, buildError: error ?? null }
    });
}

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    const { spaceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const space = await prisma.courseSpace.findUnique({ where: { id: spaceId } });
    if (!space) return NextResponse.json({ error: "Space not found" }, { status: 404 });

    if (space.buildStatus === "READY") return NextResponse.json({ status: "READY" });
    if (space.buildStatus === "QUEUED" || space.buildStatus === "PROCESSING") {
        return NextResponse.json({ status: space.buildStatus });
    }

    try {
        await setStep(spaceId, "PROCESSING", "PARSING", 10);
        const fullText = space.pdfText || "";

        await setStep(spaceId, "PROCESSING", "SEGMENTING", 25);
        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        const questions = segmentQuestions(fullText);
        console.log(`[build] docType=${docType} subject=${subject} q=${questions.length} len=${fullText.length}`);

        await setStep(spaceId, "PROCESSING", "CLASSIFYING", 40);

        const systemPrompt = docType === "questions_only" ? QUESTIONS_ONLY_BUILDER_PROMPT : COURSE_BUILDER_PROMPT;
        const userPrompt = docType === "questions_only"
            ? `Kumpulan soal dari "${space.title}" (mata pelajaran: ${subject || "tidak diketahui"}, total ~${questions.length} soal).\n\nBerikut ${Math.min(20, questions.length)} soal representatif dari dokumen:\n\n${questions.slice(0, 20).join("\n\n---\n\n")}\n\nBangun kursus LENGKAP dengan MINIMAL 5 lessons (satu per topik). Setiap lesson harus punya materi prasyarat, soal latihan ABCD, dan pembahasan soal asli dari PDF.`
            : `Dokumen: "${space.title}" (${subject || "tidak diketahui"})\n\n${fullText.substring(0, 8000)}\n\nBangun kursus pembelajaran LENGKAP dan KOMPREHENSIF dengan MINIMAL 5 lessons.`;

        await setStep(spaceId, "PROCESSING", "GENERATING", 55);

        // ─── Multi-key × multi-model rotation ────────────────────────────────
        let parsedPayload: any = null;
        try {
            const raw = await callGeminiRotated({ systemPrompt, userText: userPrompt });
            parsedPayload = JSON.parse(cleanJson(raw));
            console.log(`[build] ✅ Parsed ${parsedPayload?.lessons?.length} lessons`);
        } catch (aiErr: any) {
            console.error("[build] All keys/models failed:", aiErr.message);
            await setStep(spaceId, "ERROR", null, 0, aiErr.message);
            return NextResponse.json({ error: aiErr.message }, { status: 503 });
        }

        if (!parsedPayload?.lessons?.length) {
            await setStep(spaceId, "ERROR", null, 0, "AI mengembalikan respons kosong. Coba lagi.");
            return NextResponse.json({ error: "Empty AI response" }, { status: 503 });
        }

        await setStep(spaceId, "PROCESSING", "FINALIZING", 80);

        await prisma.$transaction(async (tx) => {
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    title: parsedPayload.main_topic || space.title,
                    isGenerated: true,
                    theme: parsedPayload.ui_config?.theme || "cosmic",
                    uiConfig: JSON.stringify(parsedPayload.ui_config || {}),
                    conceptGraph: JSON.stringify(parsedPayload.concept_graph || {}),
                    buildStatus: "READY",
                    buildStep: "FINALIZING",
                    buildProgress: 100,
                    buildError: null,
                }
            });
            await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });
            for (let i = 0; i < parsedPayload.lessons.length; i++) {
                const l = parsedPayload.lessons[i];
                await tx.generatedLesson.create({
                    data: {
                        courseId: spaceId,
                        title: l.title || `Topik ${i + 1}`,
                        slug: `${spaceId}-lesson-${i + 1}`,
                        order: i + 1,
                        contentMdx: l.contentMdx || "",
                        scaffoldedMdx: Array.isArray(l.scaffoldedExamples) ? JSON.stringify(l.scaffoldedExamples) : "[]",
                        pdfWalkthrough: l.pdfWalkthrough || "",
                    }
                });
            }
        });

        return NextResponse.json({ status: "READY", docType, lessonCount: parsedPayload.lessons.length });

    } catch (e: any) {
        console.error("[build] Fatal:", e.message);
        await setStep(spaceId, "ERROR", null, 0, e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
