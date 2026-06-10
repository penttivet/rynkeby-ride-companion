import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "OpenAI key missing" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    console.log("STT received file:", file.name, file.type, file.size);

    // Convert to proper filename for Whisper
    const ext = file.type.includes("mp4") || file.type.includes("m4a") ? "m4a" : 
                file.type.includes("webm") ? "webm" :
                file.type.includes("ogg") ? "ogg" : "mp4";
    
    const renamedFile = new File([file], `audio.${ext}`, { type: file.type });

    const whisperForm = new FormData();
    whisperForm.append("file", renamedFile);
    whisperForm.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: whisperForm,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Whisper error:", response.status, err);
      throw new Error(`Whisper error: ${response.status}`);
    }

    const data = await response.json();
    console.log("STT result:", data.text);
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
