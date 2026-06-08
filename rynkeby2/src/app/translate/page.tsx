"use client";
import { useState } from "react";
import { phrases, languages } from "@/lib/phrases";

export default function TranslatePage() {
  const [lang, setLang] = useState("en");
  const [speaking, setSpeaking] = useState<string | null>(null);

  const speak = (text: string, langCode: string, id: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const map: Record<string, string> = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", de: "de-DE", fr: "fr-FR", nl: "nl-NL" };
    u.lang = map[langCode] || langCode;
    u.rate = 0.85;
    setSpeaking(id);
    u.onend = () => setSpeaking(null);
    u.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(u);
  };

  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="page">
      <div style={{ paddingTop: "0.5rem", marginBottom: "1rem" }}>
        <h1 className="heading" style={{ fontSize: "1.6rem" }}>🌍 TRANSLATION HELPER</h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem" }}>Tap 🔊 to speak aloud</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", overflowX: "auto", paddingBottom: 4 }}>
        {languages.map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)} style={{
            flexShrink: 0, padding: "8px 14px", borderRadius: 20,
            border: lang === l.code ? "2px solid #C8102E" : "1px solid rgba(255,255,255,0.12)",
            background: lang === l.code ? "rgba(200,16,46,0.15)" : "var(--card)",
            color: lang === l.code ? "var(--text)" : "#8b949e",
            fontWeight: lang === l.code ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
          }}>{l.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {phrases.map((phrase) => {
          const translation = phrase.translations[lang];
          return (
            <div key={phrase.id} className="card" style={{ padding: "1rem 1.1rem" }}>
              <p className="label" style={{ marginBottom: 6 }}>{phrase.label}</p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <p className="heading" style={{ flex: 1, fontSize: "1.2rem", lineHeight: 1.3 }}>{translation}</p>
                {hasSpeech && (
                  <button onClick={() => speak(translation, lang, phrase.id)} style={{
                    flexShrink: 0, width: 42, height: 42, borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: speaking === phrase.id ? "rgba(200,16,46,0.2)" : "rgba(255,255,255,0.06)",
                    fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{speaking === phrase.id ? "🔴" : "🔊"}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
