import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";

/**
 * POST /api/upload-token
 * Client-side Blob upload token exchange.
 * The browser calls this first, gets a token, then uploads directly to Vercel Blob.
 * This avoids Vercel Function size limits (4.5 MB) for large PDFs.
 *
 * Usage on client:
 *   const { url } = await upload(file.name, file, {
 *     access: "public",
 *     handleUploadUrl: "/api/upload-token",
 *   });
 */
export async function POST(req: NextRequest): Promise<Response> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async (pathname) => {
                // Validate: only allow PDF uploads
                const ext = pathname.split(".").pop()?.toLowerCase();
                if (!["pdf"].includes(ext || "")) {
                    throw new Error("Only PDF files are allowed via this endpoint");
                }
                return {
                    allowedContentTypes: ["application/pdf"],
                    tokenPayload: JSON.stringify({ userId: session.user!.email }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // This runs after upload completes — log or trigger a job here
                console.log("[upload-token] Upload completed:", blob.url, "by", tokenPayload);
                // In a future step: trigger PDF parse job here
            },
        });
        return Response.json(jsonResponse);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}
