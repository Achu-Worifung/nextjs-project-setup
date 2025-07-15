import { NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const res = await fetch(`${PYTHON_API_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("FastAPI error:", err);
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}