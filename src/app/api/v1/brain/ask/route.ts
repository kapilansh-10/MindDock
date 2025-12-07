import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/verifyToken";
import { prisma } from "@/lib/prisma";
import { askMindDock } from "@/lib/alchemyst";

const askSchema = z.object({
  question: z.string().min(6, "Question is too short"),
});

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = askSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid question" }, { status: 411 });
  }

  const items = await prisma.content.findMany({
    where: { userId: decoded.userId },
    orderBy: { createdAt: "desc" },
    select: {
      title: true,
      link: true,
      tags: true,
      aiSummary: true,
      type: true,
    },
  });

  if (!items.length) {
    return NextResponse.json({ error: "No content to search" }, { status: 400 });
  }

  if (!process.env.ALCHEMYST_API_KEY) {
    return NextResponse.json({ error: "ALCHEMYST_API_KEY is not configured" }, { status: 503 });
  }

  try {
    const answer = await askMindDock({ question: result.data.question, items });
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to answer question", details: message }, { status: 500 });
  }
}
