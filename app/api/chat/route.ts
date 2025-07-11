// app/api/chat/route.ts

// Force Node.js runtime so that cheerio can parse HTML
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { load } from 'cheerio';

const GENAI_API_KEY = process.env.GENAI_API_KEY;
const TARGET_SITE   = process.env.TARGET_SITE; // e.g. "http://localhost:3000"

if (!GENAI_API_KEY) throw new Error("Missing GENAI_API_KEY");
if (!TARGET_SITE)   throw new Error("Missing TARGET_SITE");

async function scrapeFlights(
  origin: string,
  dest: string,
  depDate: string,
  retDate: string | undefined,
  travelers = "1 Adult",
  classType = "Economy"
): Promise<Array<{ airline: string; times: string; price: string }>> {
  const params = new URLSearchParams({
    flightType: "one-way",
    from: origin,
    to: dest,
    departDate: depDate,
    returnDate: retDate || "",
    travelers,
    classType,
    legs: "",
  });
  const url = `${TARGET_SITE}/flight-search?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Flight page error ${res.status}`);
  const html = await res.text();

  // Use the `load` function from cheerio to parse HTML
  const $ = load(html);

  // Adjust selectors to your page's structure
  return $(".flight-result-card")
    .slice(0, 3)
    .map((i, el) => {
      const airline = $(el).find(".airline-name").text().trim();
      const times   = $(el)
        .find(".flight-times")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const price   = $(el).find(".price").text().trim();
      return { airline, times, price };
    })
    .get();
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      origin,
      destination,
      departDate,
      returnDate,
      travelers,
      classType,
    } = await request.json();

    // 1) scrape flights from the target site
    const flights = await scrapeFlights(
      origin,
      destination,
      departDate,
      returnDate,
      travelers,
      classType
    );

    // 2) build context blob
    const context = [
      "**Flight Options:**",
      ...flights.map((f, i) => `${i + 1}. ${f.airline} (${f.times}) — ${f.price}`),
    ].join("\n");

    // 3) fold into the LLM prompt
    const systemPrompt =
      "You are a helpful travel agent. Choose the best flight for the user, explaining pros and cons.";
    const userHistory = messages
      .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const fullPrompt = `${systemPrompt}\n\n${context}\n\n${userHistory}`;

    // 4) call Gemini
    const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GENAI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const { candidates } = await res.json();
    const message = candidates?.[0]?.content?.parts.map((p: any) => p.text).join("");

    return NextResponse.json({ message });
  } catch (err: any) {
    console.error("💥 /api/chat error:", err);
    return NextResponse.json(
      { error: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}