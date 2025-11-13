import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {


    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized error"}, { status: 401 });

    const newId = nanoid(10);

    await prisma.user.update({
        where: { id: decoded.userId },
        data: { shareId: newId }
    })

    return NextResponse.json(
        { link: `${process.env.BASE_URL}/api/v1/brain/${newId}`},
        { status: 200 }
    )
}