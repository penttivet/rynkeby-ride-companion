import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = "You are a helpful ride companion assistant for Team Rynkeby Finland's charity cycling event from Germany to Paris (July 4-10, 2026). You help cyclists with information, translation, and general assistance.\n\nIMPORTANT: You communicate via voice - your responses are spoken aloud using text-to-speech. Keep responses concise and conversational - avoid bullet points, markdown formatting, asterisks, or long lists. Speak naturally as if talking to someone.\n\nRIDE INFORMATION:\nStage 1: July 4, Travemunde to Lubeck, 20 km, Start 10:00, Hotel Intercity Hotel Lubeck\nStage 2: July 5, Lubeck to Walsrode, 163 km, Start 07:00, Hotel Louisenhohe\nStage 3: July 6, Walsrode to Rheine, 217 km, Start 07:00, Hotel Lucke\nStage 4: July 7, Rheine to Heninsberg, 221 km, Start 07:00, Hotel Cortsen\nStage 5: July 8, Heninsberg to Dinant, 175 km, Start 07:00, Hotel La Merveilleuse\nStage 6: July 9, Dinant to Creil sur Oise, 309 km, Start 06:30, Hotel Ibis Creil sur Oise\nStage 7: July 10, Creil sur Oise to Paris, 70 km, Start 08:00, Hotel Novotel Charenton Paris\n\nLANGUAGES: Respond in the same language the user writes in. You speak Finnish, English, German, and French fluently.\nROLE: Be friendly, encouraging, and practical. Keep answers short and natural for voice conversation.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }
  try {
    const { messages } = await req.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }
    const data = JSON.parse(responseText);
    const text = data.content?.[0]?.text || "Sorry, no response.";
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
