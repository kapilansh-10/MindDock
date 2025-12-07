import "server-only";

const ALCHEMYST_BASE =
  process.env.ALCHEMYST_API_BASE ?? "https://platform-backend.getalchemystai.com/api/v1";

const ALCHEMYST_API_KEY = process.env.ALCHEMYST_API_KEY;

async function postToAlchemyst<T>(path: string, payload: unknown): Promise<T> {
  if (!ALCHEMYST_API_KEY) throw new Error("ALCHEMYST_API_KEY is not configured");

  const url = `${ALCHEMYST_BASE}${path}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ALCHEMYST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Alchemyst ${res.status}: ${text}`);

    return JSON.parse(text) as T;
  } catch (e: any) {
    // This will show DNS/TLS/etc errors better
    const cause = e?.cause ? ` | cause: ${String(e.cause)}` : "";
    throw new Error(`Fetch to Alchemyst failed (${url}): ${e?.message ?? e}${cause}`);
  }
}

export async function askMindDock(input: { question: string; items: any[] }) {
  // Use whichever endpoint your account supports; chat/generate is used in their examples/docs tooling
  const context = input.items
    .slice(0, 20)
    .map((it, i) => `${i + 1}. ${it.title} (${it.type}) ${it.link} tags:${(it.tags ?? []).join(", ")}`)
    .join("\n");

  const data = await postToAlchemyst<any>("/chat/generate", {
    chat_history: [
      {
        role: "user",
        content: `Use ONLY the items below.\n\nItems:\n${context}\n\nQuestion: ${input.question}\n\nAnswer in 8 bullets.`,
      },
    ],
  });

  return (
    data?.result?.message ??
    data?.message ??
    data?.result?.response?.kwargs?.content ??
    ""
  );
}
