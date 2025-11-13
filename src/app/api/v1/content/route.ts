import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { z } from "zod";

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
    await prisma.content.create({
        data: { type, link, title, tags, userId: decoded.userId }
    })

    return NextResponse.json({ message: "Content created "}, { status: 200 })
}

export async function GET(req: NextRequest) {

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const content = await prisma.content.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ content }, { status: 200 })
}

export async function DELETE(req: NextRequest) {

    const token = req.headers.get("Authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contentId } = body;

    if(!contentId) {
        return NextResponse.json({ error: "ContentId is required" }), { status: 411 };
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