import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const voiceId = process.env.ELEVENLABS_VOICE_ID || "ROMJ9yK1NAMuu1ggrjDW";
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "ElevenLabs API key missing" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ElevenLabs error: ${response.status} - ${err}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
