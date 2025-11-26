import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const UserSchema = z.object({
    username: z
    .string()
    .min(3, "Username is too short")
    .max(15, "Username is too long")
    .regex(/^[A-Za-z0-9]+$/, "Username must only contain letters"),

    password: z
    .string()
    .min(8, "Password too short")
    .max(20, "Password too long")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contian one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character")
})

export async function POST(req: NextRequest) {
    try {
    const body = await req.json();
    const result = UserSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json({ error: result.error.message}, {status: 411})
    }

    const {username, password} = result.data;

    const existingUser = await prisma.user.findUnique({
        where: { username }
    });
    if(existingUser) return NextResponse.json({ error: "Username already exists"}, {status: 403})
    
    const hashdedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: { username, password: hashdedPassword}
    })
    return NextResponse.json({message: "User created successfully"}, {status: 200})
    }
    catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error"}, {status: 500})
    }
}