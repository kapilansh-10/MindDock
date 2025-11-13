import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
    req: NextRequest,
    context: { params: Promise<{shareId: string}>}
) {

    const { shareId } = await context.params;

    const user = await prisma.user.findUnique({
        where: { shareId },
        include: { content: true }
    })

    if(!user) {
        return NextResponse.json({ error: "Invalid share link" }, { status: 404 })
    }

    return NextResponse.json({
        username: user.username,
        content: user.content
    },
    { status: 200 }
    );
}