import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";




export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    if(!decoded) return NextResponse.json({ error: "Unauthorized"},{ status: 401 });

    // generate a public id
    
    const shareId = nanoid(10);

    await prisma.user.update({
        where: { id: decoded.userId},
        data: { shareId }
    })

    return NextResponse.json(
        { link: `${process.env.BASE_URL}/api/v1/brain/${shareId}`},
        { status: 200 }
    )

}

export async function DELETE(req: NextRequest) {

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token)

    if(!decoded) return NextResponse.json({ error: "Unauthorized"}, {status: 401})

    await prisma.user.update({
        where: { id: decoded.userId},
        data: { shareId: null }
    })

    return NextResponse.json(
        {message: "Public sharing disabled"},
        {status: 200}
    )
}