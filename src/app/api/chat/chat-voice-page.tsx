"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hei! Olen Rynkeby Ride Assistant 🚴 Paina mikrofonia ja puhu — tai kirjoita!\n\nHello! Press mic and speak — or type!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sttStatus, setSttStatus] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = async (text: string) => {
    try {
      setSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    stopSpeaking();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Error getting response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setRecording(false);
        setSttStatus("Processing...");
      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunksRef.current, { type: mimeType });
          await transcribeAndSend(blob, mimeType);
        };

        mediaRecorder.start();
        setRecording(true);
        setSttStatus("");
      } catch {
        setSttStatus("Microphone error");
      }
    }
  };

  const transcribeAndSend = async (blob: Blob, mimeType: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const ext = mimeType.includes("mp4") ? "m4a" : "webm";
      formData.append("file", blob, `audio.${ext}`);

      const res = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setSttStatus("");
        await sendMessage(data.text);
      } else {
        setSttStatus("No speech detected");
        setLoading(false);
      }
    } catch {
      setSttStatus("STT error");
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      paddingBottom: "64px",
      background: "#0d1117",
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1rem 0.75rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: 1 }}>
            🚴 RIDE ASSISTANT
          </h1>
          <p style={{
            fontSize: "0.75rem",
            margin: "2px 0 0",
            color: sttStatus.includes("error") ? "#ff6b6b" :
                   recording ? "#ff4444" :
                   speaking ? "#4CAF50" : "#8b949e",
          }}>
            {recording ? "🔴 Recording — tap to stop" :
             speaking ? "🔊 Speaking..." :
             sttStatus || "FI / EN / DE / FR — tap mic to speak"}
          </p>
        </div>
        {speaking && (
          <button onClick={stopSpeaking} style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(200,16,46,0.3)",
            background: "rgba(200,16,46,0.1)", color: "#C8102E", fontSize: "0.8rem", cursor: "pointer",
          }}>
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "82%",
              padding: "0.65rem 0.9rem",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "#C8102E" : "rgba(255,255,255,0.07)",
              color: "#fff",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "0.65rem 0.9rem",
              borderRadius: "16px 16px 16px 4px",
              background: "rgba(255,255,255,0.07)",
              color: "#8b949e",
              fontSize: "1.2rem",
              letterSpacing: 3,
            }}>···</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: "0.75rem 1rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        gap: "0.5rem",
        background: "#0d1117",
        flexShrink: 0,
        alignItems: "center",
      }}>
        <button
          onClick={toggleRecording}
          disabled={loading}
          style={{
            width: 48, height: 48,
            borderRadius: "50%",
            border: "none",
            background: recording ? "#C8102E" : "rgba(200,16,46,0.2)",
            color: "#fff",
            fontSize: "1.3rem",
            cursor: loading ? "not-allowed" : "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: recording ? "0 0 0 4px rgba(200,16,46,0.3)" : "none",
            transition: "all 0.15s",
          }}
        >
          {recording ? "⏹" : "🎤"}
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Or type here..."
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 12,
            padding: "0.75rem 1rem",
            color: "#fff",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            padding: "0.75rem 1.1rem",
            borderRadius: 12,
            border: "none",
            background: loading || !input.trim() ? "rgba(200,16,46,0.3)" : "#C8102E",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.1rem",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            flexShrink: 0,
          }}
        >➤</button>
      </div>
    </div>
  );
}
