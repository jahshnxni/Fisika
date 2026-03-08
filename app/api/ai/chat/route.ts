import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { buildTutorPrompt, buildQAPrompt, buildPracticePrompt } from "@/lib/ai/system-prompts";
import { findTopicKnowledge } from "@/lib/ai/topic-knowledge";
import { streamText, tool, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { MODELS } from "@/lib/ai/models";
import { z } from "zod";
import {
    QuizItemSchema, GenerateQuizOutputSchema, ProposeMediaOutputSchema,
    UiPatchProposalSchema, MasterySignalSchema, VideoStoryboardSchema, ImageBriefSchema
} from "@/lib/ai/schemas";
import { updateMasterySignal, recordError, shouldAdvanceLevel, getHintLevel, serializeState, deserializeState, createInitialMasteryState } from "@/lib/mastery/engine";
import { findRelevantChunks } from "@/lib/pdf/chunker";
import { chooseMediaEngine } from "@/lib/media/router";
import { mediaPlanner } from "@/lib/ai/prompts/media-planner";
import { uiPatchPlanner } from "@/lib/ai/prompts/ui-patch-planner";

export const runtime = "nodejs";
export const maxDuration = 60;

// ─── POST /api/ai/chat — Blueprint-aligned with 5 live AI tools ───────────────
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return Response.json({ error: "Silakan login dulu" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return Response.json({ error: "User tidak ditemukan" }, { status: 404 });

        const body = await req.json();
        const {
            messages = [],
            sessionId, mode = "QA", topic, courseId,
        } = body as {
            messages: Array<{ role: "user" | "assistant"; content: string }>;
            sessionId?: string;
            mode?: "TUTOR" | "QA" | "PRACTICE";
            topic?: string;
            courseId?: string;
        };

        const userMessage = messages[messages.length - 1]?.content || "";
        if (!userMessage?.trim())
            return Response.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

        // ── Session ──────────────────────────────────────────────────────────
        let chatSession: any;
        let existingMessages: any[] = [];
        try {
            if (sessionId) {
                chatSession = await prisma.chatSession.findUnique({
                    where: { id: sessionId },
                    include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
                });
                if (!chatSession || chatSession.userId !== user.id)
                    return Response.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
                existingMessages = chatSession.messages;
            } else {
                chatSession = await prisma.chatSession.create({
                    data: {
                        userId: user.id, mode, topic: topic || null,
                        title: userMessage.substring(0, 60) + (userMessage.length > 60 ? "..." : ""),
                    },
                });
            }
        } catch {
            chatSession = { id: `temp-${Date.now()}`, mode, topic };
        }

        // ── Load mastery state ────────────────────────────────────────────────
        let masteryState = createInitialMasteryState();
        try {
            const profile = await prisma.masteryProfile.findUnique({ where: { userId: user.id } });
            if (profile) masteryState = deserializeState(profile as any);
        } catch { }

        // ── Save user message ─────────────────────────────────────────────────
        try {
            await prisma.chatMessage.create({
                data: { sessionId: chatSession.id, role: "user", content: userMessage },
            });
        } catch { }

        // ── Build system prompt ───────────────────────────────────────────────
        const topicKnowledge = findTopicKnowledge(topic || chatSession.topic || undefined);
        let learningProfile: any = null;
        try {
            learningProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });
        } catch { }

        const modeKey = (chatSession.mode || mode) as "TUTOR" | "QA" | "PRACTICE";
        const systemPrompt = modeKey === "TUTOR"
            ? buildTutorPrompt(topicKnowledge, learningProfile)
            : modeKey === "PRACTICE"
                ? buildPracticePrompt(topicKnowledge, learningProfile)
                : buildQAPrompt(topicKnowledge, learningProfile);

        // ── Build message list ─────────────────────────────────────────────────
        const historyMessages: Array<{ role: "user" | "assistant"; content: string }> = [
            ...existingMessages
                .filter((m: any) => m.role === "user" || m.role === "assistant")
                .slice(-14)
                .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
        ];
        // Merge with incoming (AI SDK already appends last user message to `messages`)
        const allMessages = messages.length > 1 ? messages : [...historyMessages, { role: "user" as const, content: userMessage }];

        // ── Choose provider ───────────────────────────────────────────────────
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        if (!hasOpenAI) return legacyStream(systemPrompt, allMessages, chatSession, user);

        // ─────────────────────────────────────────────────────────────────────
        // AI TOOLS — 5 blueprint-required tools
        // ─────────────────────────────────────────────────────────────────────
        const tools = {
            // ── 1. getDocumentChunk ─────────────────────────────────────────
            getDocumentChunk: tool({
                description: "Ambil chunk teks dari PDF dokumen yang relevan dengan pertanyaan user. Gunakan ini saat perlu konteks dari konten asli PDF.",
                parameters: z.object({
                    courseId: z.string().describe("ID cours/space yang berisi PDF"),
                    query: z.string().describe("Pertanyaan atau topik yang dicari"),
                    chunkType: z.enum(["any", "heading", "formula", "question", "paragraph"]).default("any"),
                }),
                execute: async ({ courseId: cId, query, chunkType }) => {
                    try {
                        const chunks = await prisma.documentChunk.findMany({
                            where: {
                                courseId: cId || courseId || "",
                                ...(chunkType !== "any" ? { chunkType } : {}),
                            },
                            orderBy: { createdAt: "asc" },
                            take: 30,
                        });
                        if (!chunks.length) return { found: false, chunks: [] };
                        const textChunks = chunks.map(c => ({
                            pageFrom: c.pageFrom, pageTo: c.pageTo,
                            chunkText: c.chunkText, chunkType: c.chunkType,
                            metadata: JSON.parse(c.metadata || "{}"),
                        }));
                        const relevant = findRelevantChunks(textChunks as any, query, 3);
                        return { found: relevant.length > 0, chunks: relevant };
                    } catch { return { found: false, chunks: [], error: "DB unavailable" }; }
                },
            }),

            // ── 2. saveMasteryProfile ───────────────────────────────────────
            saveMasteryProfile: tool({
                description: "Simpan sinyal mastery user setelah interaksi. Panggil ini saat user menjawab soal, menyelesaikan latihan, atau menunjukkan pemahaman/kesalahan.",
                parameters: z.object({
                    subtopic: z.string().describe("Subtopik yang baru dipelajari/dilatih"),
                    observation: z.object({
                        concept: z.number().min(0).max(100).optional(),
                        logic: z.number().min(0).max(100).optional(),
                        accuracy: z.number().min(0).max(100).optional(),
                        independence: z.number().min(0).max(100).optional(),
                        confidence: z.number().min(0).max(100).optional(),
                    }),
                    errorType: z.string().optional().describe("Jenis kesalahan jika ada: concept/logic/calculation/notation/strategy"),
                }),
                execute: async ({ subtopic, observation, errorType }) => {
                    let newState = updateMasterySignal(masteryState, subtopic, observation);
                    if (errorType) newState = recordError(newState, errorType, subtopic);
                    const signal = newState.topicMap[subtopic];
                    const canAdvance = signal ? shouldAdvanceLevel(signal) : false;
                    const hintLevel = signal ? getHintLevel(signal) : 3;

                    try {
                        const serialized = serializeState(newState);
                        await prisma.masteryProfile.upsert({
                            where: { userId: user.id },
                            create: { userId: user.id, ...serialized },
                            update: { ...serialized, updatedAt: new Date() },
                        });
                        masteryState = newState; // update in-scope reference
                    } catch { }

                    return {
                        saved: true,
                        readinessScore: newState.readinessScore,
                        strengths: newState.strengths,
                        weaknesses: newState.weaknesses,
                        canAdvanceLevel: canAdvance,
                        hintLevel,
                        recommendation: newState.weaknesses.length > 0
                            ? `Fokus remedial: ${newState.weaknesses.slice(0, 2).join(", ")}`
                            : "User siap lanjut ke level berikutnya",
                    };
                },
            }),

            // ── 3. generateQuiz ─────────────────────────────────────────────
            generateQuiz: tool({
                description: "Buat 1-3 soal latihan adaptif berdasarkan topik dan level mastery user saat ini. Gunakan setelah menjelaskan konsep atau saat user siap latihan.",
                parameters: z.object({
                    topic: z.string().describe("Topik atau subtopik untuk soal"),
                    level: z.enum(["EASY", "MEDIUM", "HARD", "EXTREME"]).describe("Tingkat kesulitan"),
                    count: z.number().min(1).max(3).default(2).describe("Jumlah soal"),
                    focus: z.enum(["concept", "calculation", "application", "analysis"]).default("concept"),
                }),
                execute: async ({ topic: qTopic, level, count, focus }) => {
                    try {
                        const { object } = await generateObject({
                            model: openai(MODELS.text),
                            schema: GenerateQuizOutputSchema,
                            prompt: `Buat ${count} soal ${level} tentang "${qTopic}" dengan fokus "${focus}".
Setiap soal harus:
- 4 pilihan (A-D), 1 benar
- Penjelasan lengkap per opsi (errorDiagnosis)
- 3 level hint bertingkat
- Tidak ada jawaban giveaway di stem soal
Bahasa Indonesia. Format JSON sesuai schema.`,
                        });
                        return { success: true, quiz: object };
                    } catch (e: any) {
                        return { success: false, error: e.message, quiz: null };
                    }
                },
            }),

            // ── 4. proposeMedia ─────────────────────────────────────────────
            proposeMedia: tool({
                description: "Putuskan apakah perlu membuat gambar atau video penjelas untuk konteks saat ini. Kembalikan brief jika perlu, atau {shouldGenerate: false} jika tidak perlu.",
                parameters: z.object({
                    topic: z.string(),
                    concept: z.string().describe("Konsep spesifik yang perlu divisualisasikan"),
                    formulaDensity: z.number().min(0).max(1).default(0.3),
                    pedagogicalNeed: z.enum(["concept_visualization", "step_by_step", "comparison", "formula_derivation"]),
                }),
                execute: async ({ topic: mTopic, concept, formulaDensity, pedagogicalNeed }) => {
                    const needsVideo = pedagogicalNeed === "step_by_step" || pedagogicalNeed === "formula_derivation";
                    const engine = chooseMediaEngine({
                        outputType: needsVideo ? "video" : "image",
                        formulaDensity,
                        needsPreciseMathTypesetting: formulaDensity > 0.6,
                        needsCinematicClip: false,
                    });

                    if (!needsVideo && engine === "gpt-image") {
                        return {
                            shouldGenerate: true,
                            outputType: "image",
                            engine: "gpt-image",
                            pedagogicalReason: `Konsep "${concept}" butuh visualisasi diagram/concept card`,
                            topic: mTopic,
                            imageBrief: {
                                imageType: "concept_card" as const,
                                topic: mTopic, title: concept,
                                keyPoints: [],
                                style: "dark_premium" as const,
                                prompt: `Educational ${pedagogicalNeed} diagram about "${concept}" in the context of "${mTopic}". Dark premium educational style, clear labels, clean layout.`,
                            },
                        };
                    }
                    return {
                        shouldGenerate: needsVideo,
                        outputType: "video",
                        engine,
                        pedagogicalReason: needsVideo
                            ? `Konsep "${concept}" butuh video step-by-step (${engine})`
                            : "Tidak perlu media tambahan untuk konteks ini",
                        topic: mTopic,
                    };
                },
            }),

            // ── 5. proposeUiPatch ─────────────────────────────────────────────
            proposeUiPatch: tool({
                description: "Usulkan perubahan UI/layout belajar jika mendeteksi friction pengalaman belajar. JANGAN langsung ubah apapun — hanya buat proposal yang akan di-review manusia.",
                parameters: z.object({
                    area: z.enum(["chat", "lesson", "media-panel", "quiz-panel", "dashboard"]),
                    frictionDescription: z.string().describe("Deskripsi masalah UX yang terdeteksi"),
                    sessionContext: z.string().optional(),
                }),
                execute: async ({ area, frictionDescription, sessionContext }) => {
                    try {
                        const { object } = await generateObject({
                            model: openai(MODELS.reasoning),
                            schema: UiPatchProposalSchema,
                            system: uiPatchPlanner,
                            prompt: JSON.stringify({ area, frictionDescription, sessionContext }),
                        });
                        // Store proposal in DB
                        if (courseId) {
                            try {
                                await prisma.uiPatchProposal.create({
                                    data: {
                                        courseId,
                                        area: object.area,
                                        diagnosis: object.diagnosis,
                                        goal: object.goal,
                                        patchSummary: object.patchSummary,
                                        implementationPlan: JSON.stringify(object.implementationPlan),
                                        pedagogicalReason: object.pedagogicalReason,
                                        riskLevel: object.riskLevel,
                                        rollbackPlan: object.rollbackPlan,
                                        successMetrics: JSON.stringify(object.successMetrics),
                                        status: "proposed",
                                    },
                                });
                            } catch { }
                        }
                        return { proposed: true, proposal: object };
                    } catch (e: any) {
                        return { proposed: false, error: e.message };
                    }
                },
            }),
        };

        // ── Stream with tools ─────────────────────────────────────────────────
        const result = streamText({
            model: openai(MODELS.text),
            system: systemPrompt,
            messages: allMessages,
            tools,
            maxTokens: 4096,
            temperature: 0.7,
            maxSteps: 5, // Allow multi-step tool use (tool call → result → continue)
            onFinish: async ({ text }) => {
                try {
                    await prisma.chatMessage.create({
                        data: { sessionId: chatSession.id, role: "assistant", content: text },
                    });
                } catch { }
            },
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("AI Chat error:", error);
        return Response.json({ error: error?.message || "Server error" }, { status: 500 });
    }
}

// ─── Legacy Gemini/Groq fallback ─────────────────────────────────────────────
async function legacyStream(
    systemPrompt: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    chatSession: any,
    user: any
) {
    function sseEncode(data: object) {
        return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
    }
    const stream = new ReadableStream({
        async start(controller) {
            let fullResponse = "";
            try {
                const { streamAI } = await import("./legacy-stream");
                for await (const text of streamAI(systemPrompt, messages)) {
                    fullResponse += text;
                    controller.enqueue(sseEncode({ text, sessionId: chatSession.id }));
                }
            } catch {
                controller.enqueue(sseEncode({ text: "\n\n⚠️ Streaming error.", sessionId: chatSession.id }));
            }
            if (fullResponse) {
                try { await prisma.chatMessage.create({ data: { sessionId: chatSession.id, role: "assistant", content: fullResponse } }); } catch { }
            }
            controller.enqueue(sseEncode({ done: true, sessionId: chatSession.id }));
            controller.close();
        },
    });
    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}

// ─── GET / DELETE unchanged ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        if (sessionId) {
            const s = await prisma.chatSession.findUnique({ where: { id: sessionId }, include: { messages: { orderBy: { createdAt: "asc" } } } });
            if (!s || s.userId !== user.id) return Response.json({ error: "Not found" }, { status: 404 });
            return Response.json(s);
        }
        return Response.json(await prisma.chatSession.findMany({
            where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 30,
            select: { id: true, title: true, mode: true, topic: true, updatedAt: true, _count: { select: { messages: true } } },
        }));
    } catch { return Response.json([]); }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });
        const sessionId = new URL(req.url).searchParams.get("sessionId");
        if (!sessionId) return Response.json({ error: "sessionId required" }, { status: 400 });
        const s = await prisma.chatSession.findUnique({ where: { id: sessionId } });
        if (!s || s.userId !== user.id) return Response.json({ error: "Not found" }, { status: 404 });
        await prisma.chatSession.delete({ where: { id: sessionId } });
        return Response.json({ success: true });
    } catch { return Response.json({ error: "Server error" }, { status: 500 }); }
}
