import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, items } = await req.json();

    const base =
      process.env.ALCHEMYST_API_BASE ?? "https://api.alchemyst.ai/api/v1";
    const key = process.env.ALCHEMYST_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "Missing ALCHEMYST_API_KEY" },
        { status: 500 }
      );
    }

    // Minimal MVP: send your saved items as context in the prompt
    const context = (items ?? [])
      .slice(0, 20)
      .map(
        (it: any, i: number) =>
          `${i + 1}. ${it.title} (${it.type}) - ${it.link} - tags: ${(it.tags ?? []).join(", ")}`
      )
      .join("\n");

    const r = await fetch(`${base}/chat/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`, // Bearer auth :contentReference[oaicite:0]{index=0}
      },
      body: JSON.stringify({
        chat_history: [
          {
            role: "user",
            content: `Use ONLY the items below.\n\nItems:\n${context}\n\nQuestion: ${question}\n\nAnswer in 8 bullets.`,
          },
        ],
      }),
    });

    const text = await r.text();
    if (!r.ok) {
      return NextResponse.json(
        { error: `Alchemyst error ${r.status}`, details: text },
        { status: r.status }
      );
    }

    const data = JSON.parse(text);

    // Depending on endpoint response shape; many return result/message
    const answer =
      data?.result?.message ??
      data?.result?.response?.kwargs?.content ??
      data?.message ??
      "";

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
