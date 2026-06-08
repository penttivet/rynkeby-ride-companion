import { NextRequest, NextResponse } from "next/server";

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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are a helpful assistant for Team Rynkeby Finland cyclists riding to Paris for charity.
You help cyclists during their multi-day ride through Germany, Belgium and France.
The ride goes: Travemünde → Lübeck → Walsrode → Rheine → Heninsberg → Dinant → Creil sur Oise → Paris.
Hotels: Intercity Hotel Lübeck, Hotel Louisenhöhe Walsrode, Hotel Lücke Rheine, Hotel Cortsen Heninsberg, Hotel La Merveilleuse Dinant, Hotel Ibis Creil sur Oise, Novotel Charenton Paris.
Always respond in the same language the user writes in.
Keep answers short and practical - cyclists are tired and on the road.
For emergencies always say: contact support car immediately or use the SOS button in this app.`,
        messages: messages.map((m: {role: string; content: string}) => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: "API error" }, { status: 500 });
    return NextResponse.json({ reply: data.content[0].text });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
