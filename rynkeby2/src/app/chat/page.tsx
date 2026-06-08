"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string; }

const quick = [
  "Where is the nearest pharmacy?",
  "My bike has a flat tire",
  "I need water and food",
  "I am lost, help me",
  "Missä on lähin apteekki?",
  "Tarvitsen apua",
  "Où est la pharmacie?",
  "Ich brauche Hilfe",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hei! Olen Team Rynkeby avustajasi. Voin auttaa sinua matkan aikana kaikilla kielillä!\n\nHi! I'm your Team Rynkeby assistant. Ask me anything! 🚴",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    const newMsgs: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.reply || "Sorry, try again." }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bg)", paddingBottom: "4rem" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "var(--card)", flexShrink: 0 }}>
        <h1 className="heading" style={{ fontSize: "1.4rem", lineHeight: 1 }}>🤖 RIDE ASSISTANT</h1>
        <p style={{ color: "#8b949e", fontSize: "0.78rem", marginTop: 2 }}>Ask anything in any language</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: "0.75rem 1rem", whiteSpace: "pre-wrap",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? "#C8102E" : "var(--card)",
              border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
              fontSize: "0.95rem", lineHeight: 1.5,
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "0.75rem 1rem", borderRadius: "18px 18px 18px 4px", background: "var(--card)", border: "1px solid rgba(255,255,255,0.08)", color: "#8b949e", fontSize: "1.2rem" }}>···</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length < 3 && (
        <div style={{ padding: "0.5rem 1rem", display: "flex", gap: "0.5rem", overflowX: "auto", flexShrink: 0 }}>
          {quick.map((q) => (
            <button key={q} onClick={() => send(q)} style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 16,
              border: "1px solid rgba(200,16,46,0.4)", background: "rgba(200,16,46,0.1)",
              color: "var(--text)", fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap",
            }}>{q}</button>
          ))}
        </div>
      )}

      <div style={{
        padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "var(--card)", display: "flex", gap: "0.5rem", flexShrink: 0,
      }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything... / Kysy jotain..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12, padding: "10px 14px", color: "var(--text)",
            fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem", outline: "none",
          }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          width: 44, height: 44, borderRadius: 12, border: "none",
          background: loading || !input.trim() ? "rgba(255,255,255,0.1)" : "#C8102E",
          color: "#fff", fontSize: "1.2rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>↑</button>
      </div>
    </div>
  );
}
