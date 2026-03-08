import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { findTopicKnowledge } from "@/lib/ai/topic-knowledge";
import { buildTutorPrompt, buildQAPrompt, buildPracticePrompt } from "@/lib/ai/system-prompts";
import { streamText } from "ai";
import { openai, MODELS } from "@/lib/ai/client";

export const runtime = "nodejs";
export const maxDuration = 60;

// ─── POST /api/ai/chat — Vercel AI SDK streaming ──────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return Response.json({ error: "Silakan login dulu" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return Response.json({ error: "User tidak ditemukan" }, { status: 404 });

        const body = await req.json();
        const { message, messages: rawMessages, sessionId, mode = "QA", topic } = body as {
            message?: string;
            messages?: Array<{ role: "user" | "assistant"; content: string }>;
            sessionId?: string;
            mode?: "TUTOR" | "QA" | "PRACTICE";
            topic?: string;
        };

        // Support both single message and full messages array (AI SDK UIStreamResponse format)
        const userMessage = message || rawMessages?.[rawMessages.length - 1]?.content || "";
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

        // ── Save user message ────────────────────────────────────────────────
        try {
            await prisma.chatMessage.create({
                data: { sessionId: chatSession.id, role: "user", content: userMessage },
            });
        } catch { }

        // ── Build system prompt ──────────────────────────────────────────────
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

        // ── Build message history ────────────────────────────────────────────
        const aiMessages: Array<{ role: "user" | "assistant"; content: string }> = [
            ...existingMessages
                .filter((m: any) => m.role === "user" || m.role === "assistant")
                .slice(-14)
                .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
            { role: "user" as const, content: userMessage },
        ];

        // ── Stream via Vercel AI SDK ─────────────────────────────────────────
        // If OPENAI_API_KEY is not set, fall back to legacy Gemini/Groq streaming
        if (!process.env.OPENAI_API_KEY) {
            return legacyStream(systemPrompt, aiMessages, chatSession, user);
        }

        const result = streamText({
            model: openai(MODELS.text),
            system: systemPrompt,
            messages: aiMessages,
            maxTokens: 4096,
            temperature: 0.7,
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

// ─── Legacy Gemini/Groq fallback (used when OPENAI_API_KEY not set) ───────────
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
            } catch (e: any) {
                controller.enqueue(sseEncode({ text: "\n\n⚠️ Streaming error.", sessionId: chatSession.id }));
            }
            if (fullResponse) {
                try {
                    await prisma.chatMessage.create({
                        data: { sessionId: chatSession.id, role: "assistant", content: fullResponse },
                    });
                } catch { }
            }
            controller.enqueue(sseEncode({ done: true, sessionId: chatSession.id }));
            controller.close();
        },
    });
    return new Response(stream, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
}

// ─── GET / DELETE — unchanged ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        if (sessionId) {
            const s = await prisma.chatSession.findUnique({
                where: { id: sessionId },
                include: { messages: { orderBy: { createdAt: "asc" } } },
            });
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
