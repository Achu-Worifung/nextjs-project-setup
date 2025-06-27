
import { NextResponse } from "next/server";

const GENAI_API_KEY = process.env.GENAI_API_KEY;
if (!GENAI_API_KEY) throw new Error("Missing GENAI_API_KEY");

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const history = messages
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const systemPrompt = "You are a helpful travel agent.";
    const fullPrompt = `${systemPrompt}\n\n${history}`;

    const payload = {
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GENAI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const { candidates } = await res.json();
    const message = (candidates?.[0]?.content?.parts ?? [])
      .map((p: any) => p.text)
      .join("");

    return NextResponse.json({ message });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}