import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { z } from "zod";
import { generateContentInsights } from "@/lib/alchemyst";

const contentSchema = z.object({
    type: z.string(),
    link: z.string().url(),
    title: z.string(),
    tags: z.array(z.string()).optional()
})


export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized"}, {status: 401})
    
    const  body = await req.json();
    const result = contentSchema.safeParse(body);
    if(!result.success) return NextResponse.json({ error: "Invalid data"}, { status: 411 });

    const { type, link, title, tags } = result.data;
    const created = await prisma.content.create({
        data: { 
            type, 
            link, 
            title, 
            tags: tags ?? [], 
            userId: decoded.userId,
            aiStatus: process.env.ALCHEMYST_API_KEY ? "processing" : "skipped"
        }
    });

    if (process.env.ALCHEMYST_API_KEY) {
        const ai = await generateContentInsights({ title, link, type, tags: tags ?? [] });

        if (ai.status === "succeeded") {
            await prisma.content.update({
                where: { id: created.id },
                data: {
                    aiSummary: ai.data.summary ?? null,
                    aiTags: ai.data.tags ?? [],
                    aiStatus: "succeeded",
                    aiError: null
                }
            });
        } else if (ai.status === "failed") {
            await prisma.content.update({
                where: { id: created.id },
                data: { aiStatus: "failed", aiError: ai.error }
            });
        }
    }

    return NextResponse.json({ message: "Content created", contentId: created.id }, { status: 200 })
}

export async function GET(req: NextRequest) {

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { shareId: true }
    });

    const content = await prisma.content.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ content, user }, { status: 200 })
}

export async function DELETE(req: NextRequest) {

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contentId } = body;

    if(!contentId) {
        return NextResponse.json({ error: "ContentId is required" }, { status: 411 });
    }

    const content = await prisma.content.findUnique({
        where: { id: contentId }
    })

    if(!content || content.userId !== decoded.userId) {
        return NextResponse.json({ error: "Not allowed to delete this item" }, { status: 403 });
    }

    await prisma.content.delete({
        where: { id: contentId }
    })

    return NextResponse.json({ message: "Content deleted" }, { status: 200 });
}