import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TOPIC_EXTRACTOR_PROMPT, SINGLE_LESSON_GENERATOR_PROMPT } from "@/lib/ai/master-prompt";
import { detectDocType, detectSubject, segmentQuestions } from "@/lib/docDetect";
import { callAiRotated } from "@/lib/geminiRotator";

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
        // ─── STEP 1: Parse & detect ───────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "PARSING", 10);
        const fullText = space.pdfText || "";
        const docType = detectDocType(fullText);
        const subject = detectSubject(fullText);
        const questions = segmentQuestions(fullText);
        console.log(`[build] docType=${docType} subject=${subject} q=${questions.length} len=${fullText.length}`);

        // ─── STEP 2: Extract topic list (1 fast AI call) ─────────────────────
        await setStep(spaceId, "PROCESSING", "SEGMENTING", 25);

        const contextForTopics = docType === "questions_only"
            ? `Dokumen: "${space.title}" (${subject})\nJenis: Kumpulan soal (${questions.length} soal)\n\nSoal representatif:\n${questions.slice(0, 15).join("\n\n")}`
            : `Dokumen: "${space.title}" (${subject})\n\n${fullText.substring(0, 6000)}`;

        let topicsPayload: any = null;
        try {
            const raw = await callAiRotated({ systemPrompt: TOPIC_EXTRACTOR_PROMPT, userText: contextForTopics });
            topicsPayload = JSON.parse(cleanJson(raw));
            console.log(`[build] Topics extracted: ${topicsPayload?.topics?.length}`);
        } catch (e: any) {
            await setStep(spaceId, "ERROR", null, 0, `Gagal mengidentifikasi topik: ${e.message}`);
            return NextResponse.json({ error: e.message }, { status: 503 });
        }

        const topics: Array<{ title: string; description: string; relevantContent: string }> =
            topicsPayload?.topics?.slice(0, 7) || [];

        if (topics.length === 0) {
            await setStep(spaceId, "ERROR", null, 0, "Tidak ada topik teridentifikasi dari dokumen.");
            return NextResponse.json({ error: "No topics found" }, { status: 503 });
        }

        // ─── STEP 3: Generate each lesson IN PARALLEL (dedicated AI call) ─────
        await setStep(spaceId, "PROCESSING", "CLASSIFYING", 40);

        const relevantQuestions = questions.slice(0, 20);

        const lessonPromises = topics.map(async (topic, i) => {
            const userText = `Kamu sedang mengajar topik: "${topic.title}"
Mata pelajaran: ${subject || topicsPayload.subject || "tidak diketahui"}
Jenis dokumen: ${docType}

Deskripsi topik: ${topic.description}

Konten relevan dari dokumen:
${topic.relevantContent || ""}

${relevantQuestions.length > 0 ? `Soal-soal dari PDF yang berkaitan:\n${relevantQuestions.filter(q => q.toLowerCase().includes(topic.title.toLowerCase().split(" ")[0]) || true).slice(0, 5).join("\n\n")}` : ""}

Buat satu bab pelajaran SANGAT LENGKAP (minimal 600 kata) tentang topik ini. Tulis seperti guru les privat yang menjelaskan materi kepada siswa SMA/olimpiade.`;

            try {
                const raw = await callAiRotated({
                    systemPrompt: SINGLE_LESSON_GENERATOR_PROMPT,
                    userText,
                });
                const lesson = JSON.parse(cleanJson(raw));
                lesson._order = i + 1;
                return lesson;
            } catch (e: any) {
                console.error(`[build] Lesson ${i + 1} "${topic.title}" failed:`, e.message?.slice(0, 80));
                // Return minimal fallback for this one lesson
                return {
                    title: `Topik ${i + 1}: ${topic.title}`,
                    contentMdx: `## ${topic.title}\n\n${topic.description}\n\nAI gagal menghasilkan materi lengkap untuk topik ini. Coba tekan Retry.`,
                    scaffoldedExamples: [],
                    pdfWalkthrough: "",
                    _order: i + 1,
                };
            }
        });

        await setStep(spaceId, "PROCESSING", "GENERATING", 55);

        // Run all lesson generations concurrently
        const lessons = await Promise.all(lessonPromises);
        console.log(`[build] Generated ${lessons.length} lessons`);

        // ─── STEP 4: Save to DB ───────────────────────────────────────────────
        await setStep(spaceId, "PROCESSING", "FINALIZING", 85);

        // Build concept graph from topics
        const conceptGraph = {
            subtopics: topics.map(t => t.title),
            concepts: topics.map(t => t.description).slice(0, 5),
            formulas: [],
            prerequisites: [],
        };

        await prisma.$transaction(async (tx) => {
            await tx.courseSpace.update({
                where: { id: spaceId },
                data: {
                    title: topicsPayload.main_topic || space.title,
                    isGenerated: true,
                    theme: docType === "questions_only" ? "science" : "cosmic",
                    uiConfig: JSON.stringify({ theme: docType === "questions_only" ? "science" : "cosmic", layout: "lesson-focused" }),
                    conceptGraph: JSON.stringify(conceptGraph),
                    buildStatus: "READY",
                    buildStep: "FINALIZING",
                    buildProgress: 100,
                    buildError: null,
                }
            });
            await tx.generatedLesson.deleteMany({ where: { courseId: spaceId } });
            for (let i = 0; i < lessons.length; i++) {
                const l = lessons[i];
                await tx.generatedLesson.create({
                    data: {
                        courseId: spaceId,
                        title: l.title || `Topik ${i + 1}`,
                        slug: `${spaceId}-lesson-${i + 1}`,
                        order: l._order || i + 1,
                        contentMdx: l.contentMdx || "",
                        scaffoldedMdx: Array.isArray(l.scaffoldedExamples) ? JSON.stringify(l.scaffoldedExamples) : "[]",
                        pdfWalkthrough: l.pdfWalkthrough || "",
                    }
                });
            }
        });

        return NextResponse.json({ status: "READY", lessonCount: lessons.length, docType });

    } catch (e: any) {
        console.error("[build] Fatal:", e.message);
        await setStep(spaceId, "ERROR", null, 0, e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
