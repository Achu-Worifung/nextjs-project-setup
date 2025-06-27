import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const last = messages[messages.length - 1]?.content ?? "";

    const history = messages
    .map((m) => {
        const speaker = m.role === "user" ? "User" : "Assistant";
        return `${speaker}: ${m.content}`;
    })
    .join("\n");

    const prompt = "You are a helpful travel agent. Help me find hotels, cars, and flights and market the ones on the travel booking website.";

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });
    if (!ollamaRes.ok) {
      throw new Error(`Ollama error ${ollamaRes.status}`);
    }
    const ollamaData = await ollamaRes.json();
    const reply = ollamaData.response;

    return NextResponse.json({ message: reply });
  } catch (err: any) {
    console.error("API /chat error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}