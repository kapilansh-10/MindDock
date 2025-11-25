import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

const signinSchema = z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(3, "Password is required")
})

export async function POST (req: NextRequest) {
    try {
        const body = await req.json();
        const result = signinSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json({ error: result.error.message}, {status: 411})
        }

        const { username, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if(!user){
            return NextResponse.json({ error: "User not found"}, { status: 403})
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({ error: "Invalid Password"}, {status: 403})
        }

        const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "7d"})

        return NextResponse.json({ token }, { status: 200})
    } 
    catch (error) {
        console.error("Signin error", error);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500})
    }
}