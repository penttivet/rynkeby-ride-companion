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
      content: "Hei! Olen Rynkeby Ride Assistant 🚴 Voin auttaa reittiinfossa, käännöksissä ja muissa kysymyksissä. Kirjoita suomeksi, englanniksi, saksaksi tai ranskaksi!\n\nHello! I'm your Rynkeby Ride Assistant. I can help with route info, translations, and any questions. Write in Finnish, English, German, or French!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Error getting response." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", height: "100dvh", padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1 className="heading" style={{ fontSize: "1.4rem", marginBottom: 2 }}>🚴 RIDE ASSISTANT</h1>
        <p style={{ color: "#8b949e", fontSize: "0.75rem" }}>Ask anything — FI / EN / DE / FR</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
              color: "var(--text)",
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
              fontSize: "0.9rem",
            }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "0.75rem 1rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        gap: "0.5rem",
        background: "var(--bg)",
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "0.65rem 1rem",
            color: "var(--text)",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: "0.65rem 1.1rem",
            borderRadius: 12,
            border: "none",
            background: loading || !input.trim() ? "rgba(200,16,46,0.3)" : "#C8102E",
            color: "#fff",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
