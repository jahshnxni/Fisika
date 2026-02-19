import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { findTopicKnowledge } from "@/lib/ai/topic-knowledge";
import {
    buildTutorPrompt,
    buildQAPrompt,
    buildPracticePrompt,
} from "@/lib/ai/system-prompts";

// ─── Helpers ───

function sseResponse(stream: ReadableStream) {
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}

function sseEncode(data: object) {
    return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── AI Provider Abstraction ───

interface AIMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

// Try Gemini first, then Groq
async function* streamAI(
    systemPrompt: string,
    messages: AIMessage[]
): AsyncGenerator<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // --- Try Gemini ---
    if (geminiKey) {
        try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey: geminiKey });

            const history = messages.slice(0, -1).map((m) => ({
                role: m.role === "assistant" ? ("model" as const) : ("user" as const),
                parts: [{ text: m.content }],
            }));
            const lastMsg = messages[messages.length - 1];

            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const response = await ai.models.generateContentStream({
                        model: "gemini-2.0-flash-lite",
                        contents: [
                            ...history,
                            { role: "user" as const, parts: [{ text: lastMsg.content }] },
                        ],
                        config: {
                            systemInstruction: systemPrompt,
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        },
                    });

                    for await (const chunk of response) {
                        if (chunk.text) yield chunk.text;
                    }
                    return; // Success!
                } catch (e: any) {
                    const is429 =
                        e?.status === 429 ||
                        e?.message?.includes("429") ||
                        e?.message?.includes("quota") ||
                        e?.message?.includes("RESOURCE_EXHAUSTED");
                    console.error(`[Gemini] attempt ${attempt + 1} failed:`, e?.message?.substring(0, 150));
                    if (is429 && attempt < 1) {
                        await sleep(3000);
                        continue;
                    }
                    // Fall through to Groq
                    break;
                }
            }
        } catch (e) {
            console.error("[Gemini] import/init failed:", e);
        }
    }

    // --- Try Groq (free tier: 30 RPM, very generous) ---
    if (groqKey) {
        try {
            const Groq = (await import("groq-sdk")).default;
            const groq = new Groq({ apiKey: groqKey });

            const groqMessages = [
                { role: "system" as const, content: systemPrompt },
                ...messages.map((m) => ({
                    role: m.role as "user" | "assistant",
                    content: m.content,
                })),
            ];

            const response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 2048,
                stream: true,
            });

            for await (const chunk of response) {
                const text = chunk.choices[0]?.delta?.content;
                if (text) yield text;
            }
            return; // Success!
        } catch (e: any) {
            console.error("[Groq] failed:", e?.message?.substring(0, 150));
        }
    }

    // --- No provider worked ---
    yield `## ⚠️ Tidak bisa terhubung ke AI

`;
    if (!geminiKey && !groqKey) {
        yield `Kamu belum mengonfigurasi API key. Tambahkan **salah satu** ke \`.env\`:\n\n`;
        yield `**Option 1 — Gemini (Google):**\n`;
        yield `\`\`\`\nGEMINI_API_KEY=your-key\n\`\`\`\n`;
        yield `Dapatkan di [Google AI Studio](https://aistudio.google.com/apikey)\n\n`;
        yield `**Option 2 — Groq (Llama, lebih stabil):**\n`;
        yield `\`\`\`\nGROQ_API_KEY=your-key\n\`\`\`\n`;
        yield `Dapatkan di [Groq Console](https://console.groq.com/keys)\n`;
    } else {
        yield `Rate limit tercapai di semua provider. Tunggu beberapa menit lalu coba lagi.\n\n`;
        yield `> 💡 **Tips:** Tambahkan **GROQ_API_KEY** sebagai backup. Groq gratis dan punya rate limit yang jauh lebih besar!\n`;
        yield `> Dapatkan di [console.groq.com/keys](https://console.groq.com/keys)`;
    }
}

// ─── POST /api/ai/chat ───
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Silakan login dulu" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        const body = await req.json();
        const { message, sessionId, mode = "QA", topic } = body as {
            message: string;
            sessionId?: string;
            mode?: "TUTOR" | "QA" | "PRACTICE";
            topic?: string;
        };

        if (!message?.trim()) {
            return Response.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
        }

        // Get or create session
        let chatSession: any;
        let existingMessages: any[] = [];

        try {
            if (sessionId) {
                chatSession = await prisma.chatSession.findUnique({
                    where: { id: sessionId },
                    include: { messages: { orderBy: { createdAt: "asc" }, take: 12 } },
                });
                if (!chatSession || chatSession.userId !== user.id) {
                    return Response.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
                }
                existingMessages = chatSession.messages;
            } else {
                chatSession = await prisma.chatSession.create({
                    data: {
                        userId: user.id,
                        mode,
                        topic: topic || null,
                        title: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
                    },
                });
            }
        } catch {
            chatSession = { id: `temp-${Date.now()}`, mode, topic };
        }

        // Save user message
        try {
            await prisma.chatMessage.create({
                data: { sessionId: chatSession.id, role: "user", content: message },
            });
        } catch { }

        // Learning profile
        let learningProfile = null;
        try {
            learningProfile = await prisma.learningProfile.findUnique({
                where: { userId: user.id },
            });
        } catch { }

        // Build system prompt (compact for token efficiency)
        const topicKnowledge = findTopicKnowledge(topic || chatSession.topic || undefined);
        let systemPrompt: string;
        switch (chatSession.mode || mode) {
            case "TUTOR":
                systemPrompt = buildTutorPrompt(topicKnowledge, learningProfile);
                break;
            case "PRACTICE":
                systemPrompt = buildPracticePrompt(topicKnowledge, learningProfile);
                break;
            default:
                systemPrompt = buildQAPrompt(topicKnowledge, learningProfile);
        }
        // Trim for free tier token limits
        if (systemPrompt.length > 2500) systemPrompt = systemPrompt.substring(0, 2500);

        // Build messages
        const aiMessages: AIMessage[] = [
            ...existingMessages
                .filter((m: any) => m.role === "user" || m.role === "assistant")
                .slice(-6)
                .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
            { role: "user" as const, content: message },
        ];

        // Stream response
        const stream = new ReadableStream({
            async start(controller) {
                let fullResponse = "";

                try {
                    for await (const text of streamAI(systemPrompt, aiMessages)) {
                        fullResponse += text;
                        controller.enqueue(sseEncode({ text, sessionId: chatSession.id }));
                    }
                } catch (e: any) {
                    console.error("[AI Stream] Error:", e);
                    controller.enqueue(
                        sseEncode({
                            text: "\n\n⚠️ **Error saat streaming. Coba lagi.**",
                            sessionId: chatSession.id,
                        })
                    );
                }

                // Save response
                if (fullResponse) {
                    try {
                        await prisma.chatMessage.create({
                            data: {
                                sessionId: chatSession.id,
                                role: "assistant",
                                content: fullResponse,
                            },
                        });
                    } catch { }
                    try {
                        await prisma.learningProfile.upsert({
                            where: { userId: user.id },
                            create: { userId: user.id, totalSessions: 1 },
                            update: { totalSessions: { increment: 0 } },
                        });
                    } catch { }
                }

                controller.enqueue(sseEncode({ done: true, sessionId: chatSession.id }));
                controller.close();
            },
        });

        return sseResponse(stream);
    } catch (error: any) {
        console.error("AI Chat error:", error);
        return Response.json({ error: error?.message || "Server error" }, { status: 500 });
    }
}

// ─── GET ───
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");

        if (sessionId) {
            const s = await prisma.chatSession.findUnique({
                where: { id: sessionId },
                include: { messages: { orderBy: { createdAt: "asc" } } },
            });
            if (!s || s.userId !== user.id)
                return Response.json({ error: "Not found" }, { status: 404 });
            return Response.json(s);
        }

        return Response.json(
            await prisma.chatSession.findMany({
                where: { userId: user.id },
                orderBy: { updatedAt: "desc" },
                take: 30,
                select: {
                    id: true, title: true, mode: true, topic: true, updatedAt: true,
                    _count: { select: { messages: true } },
                },
            })
        );
    } catch {
        return Response.json([]);
    }
}

// ─── DELETE ───
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });

        const sessionId = new URL(req.url).searchParams.get("sessionId");
        if (!sessionId)
            return Response.json({ error: "sessionId required" }, { status: 400 });

        const s = await prisma.chatSession.findUnique({ where: { id: sessionId } });
        if (!s || s.userId !== user.id)
            return Response.json({ error: "Not found" }, { status: 404 });

        await prisma.chatSession.delete({ where: { id: sessionId } });
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
