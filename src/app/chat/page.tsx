"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "Where is the nearest pharmacy?",
  "My bike has a flat tire, what do I do?",
  "I need water and food",
  "I am lost, help me",
  "Missä on lähin apteekki?",
  "Tarvitsen apua",
  "Où est la pharmacie?",
  "Ich brauche Hilfe",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hei! Olen Team Rynkeby avustajasi. Voin auttaa sinua matkan aikana kaikilla kielillä!\n\nHi! I'm your Team Rynkeby assistant. I can help you during the ride in any language! 🚴",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Sorry, try again." },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "var(--bg-dark)",
        paddingBottom: "4rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "var(--bg-card)",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          🤖 RIDE ASSISTANT
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.78rem", marginTop: "2px" }}>
          Ask anything in any language
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "0.75rem 1rem",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  msg.role === "user"
                    ? "var(--rynkeby-red)"
                    : "var(--bg-card)",
                border:
                  msg.role === "assistant"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                color: "#f0f6fc",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "18px 18px 18px 4px",
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8b949e",
                fontSize: "1.2rem",
              }}
            >
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length < 3 && (
        <div
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(200,16,46,0.4)",
                background: "rgba(200,16,46,0.1)",
                color: "#f0f6fc",
                fontSize: "0.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "var(--bg-card)",
          display: "flex",
          gap: "0.5rem",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything... / Kysy jotain..."
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            padding: "10px 14px",
            color: "#f0f6fc",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            border: "none",
            background:
              loading || !input.trim()
                ? "rgba(255,255,255,0.1)"
                : "var(--rynkeby-red)",
            color: "#fff",
            fontSize: "1.2rem",
            cursor: loading || !input.trim() ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
