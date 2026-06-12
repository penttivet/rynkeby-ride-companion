"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string; }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hei! Olen Rynkeby Ride Assistant 🚴 Paina mikrofonia ja puhu — tai kirjoita!\n\nHello! Press mic and speak — or type!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const speak = async (text: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    try {
      setSpeaking(true);
      const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) { setSpeaking(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = document.createElement("audio");
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.preload = "auto";
      audio.src = url;
      document.body.appendChild(audio);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); document.body.removeChild(audio); };
      audio.onerror = () => { setSpeaking(false); document.body.removeChild(audio); };
      await audio.play();
      setStatus("");
    } catch (e: any) { setSpeaking(false); setStatus("Ei ääntä: " + e.message); }
  };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setSpeaking(false); }
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages }) });
      const data = await res.json();
      const reply = data.reply || "Error";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }]); }
    finally { setLoading(false); }
  };

  const toggleMic = () => {
    if (recording) { recognitionRef.current?.stop(); setRecording(false); setStatus(""); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setStatus("Speech not supported"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "fi-FI";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => { setRecording(true); setStatus("Recording..."); };
    recognition.onresult = (event: any) => { const t = event.results[0][0].transcript; setRecording(false); setStatus(""); sendMessage(t); };
    recognition.onerror = (event: any) => { setRecording(false); setStatus("Mic error: " + event.error); };
    recognition.onend = () => { setRecording(false); };
    recognition.start();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", paddingBottom: "64px", background: "#0d1117", fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0 }}>🚴 RIDE ASSISTANT</h1>
          <p style={{ fontSize: "0.75rem", margin: "2px 0 0", color: recording ? "#C8102E" : speaking ? "#10b981" : status ? "#f59e0b" : "#8b949e" }}>
            {recording ? "🔴 Recording — tap to stop" : speaking ? "🔊 Speaking..." : status || "FI / EN / DE / FR"}
          </p>
        </div>
        {speaking && <button onClick={() => { audioRef.current?.pause(); audioRef.current = null; setSpeaking(false); }} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: "0.8rem", cursor: "pointer" }}>⏹ Stop</button>}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "0.65rem 0.9rem", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#C8102E" : "rgba(255,255,255,0.07)", color: "#fff", fontSize: "0.9rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</div>
            {msg.role === "assistant" && (
              <button onClick={() => speak(msg.content)} style={{ marginTop: 4, padding: "3px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#8b949e", fontSize: "0.75rem", cursor: "pointer" }}>
                🔊 Kuuntele
              </button>
            )}
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "0.65rem 0.9rem", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.07)", color: "#8b949e", fontSize: "1.2rem", letterSpacing: 3 }}>···</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "0.5rem", background: "#0d1117", flexShrink: 0, alignItems: "center" }}>
        <button onClick={toggleMic} disabled={loading && !recording} style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: recording ? "#C8102E" : "rgba(200,16,46,0.2)", color: "#fff", fontSize: "1.3rem", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: recording ? "0 0 0 4px rgba(200,16,46,0.3)" : "none", transition: "all 0.2s" }}>{recording ? "⏹" : "🎤"}</button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} placeholder="Or type here..." style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "0.75rem 1rem", color: "#fff", fontFamily: "'Barlow', sans-serif", fontSize: "1rem", outline: "none" }} />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ padding: "0.75rem 1.1rem", borderRadius: 12, border: "none", background: loading || !input.trim() ? "rgba(200,16,46,0.3)" : "#C8102E", color: "#fff", fontWeight: 700, fontSize: "1.1rem", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>➤</button>
      </div>
    </div>
  );
}
