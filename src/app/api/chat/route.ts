import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a helpful ride companion assistant for Team Rynkeby Finland's charity cycling event from Germany to Paris (July 4-10, 2026). You help cyclists with information, translation, and general assistance.

RIDE INFORMATION:
- Stage 1: July 4 — Travemünde → Lübeck, 20 km, Start 10:00, ETA 12:00, Hotel: Intercity Hotel Lübeck (with Team Oulu)
- Stage 2: July 5 — Lübeck → Walsrode, 163 km, Start 07:00, ETA 16:00, Hotel: Hotel Louisenhöhe (with Team Järvi-Suomi)
- Stage 3: July 6 — Walsrode → Rheine, 217 km, Start 07:00, ETA 17:30, Hotel: Hotel Lücke (with Team Espoo)
- Stage 4: July 7 — Rheine → Heninsberg, 221 km, Start 07:00, ETA 17:30, Hotel: Hotel Cortsen (with Team Vantaa)
- Stage 5: July 8 — Heninsberg → Dinant, 175 km, Start 07:00, ETA 16:00, Hotel: Hotel La Merveilleuse (with Team Turku)
- Stage 6: July 9 — Dinant → Creil sur Oise, 309 km, Start 06:30, ETA 19:00, Hotel: Hotel Ibis Creil sur Oise (with Team Häme)
- Stage 7: July 10 — Creil sur Oise → Paris, 70 km, Start 08:00, ETA 13:00, Hotel: Novotel Charenton Paris

LANGUAGES: Respond in the same language the user writes in. You speak Finnish, English, German, and French fluently.

TRANSLATION: If asked to translate something, do so immediately and clearly.

ROLE: Be friendly, encouraging, and practical. You know the route, the stages, the hotels, and can help with communication in German and French if cyclists need to talk to locals.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "Sorry, no response.";
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
