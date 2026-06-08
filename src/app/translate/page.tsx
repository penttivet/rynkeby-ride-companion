"use client";

import { useState } from "react";
import { phrases, languages } from "@/lib/phrases";

export default function TranslatePage() {
  const [activeLang, setActiveLang] = useState("en");
  const [speaking, setSpeaking] = useState<string | null>(null);

  const speak = (text: string, lang: string, phraseId: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // Map our lang codes to BCP-47
    const langMap: Record<string, string> = {
      fi: "fi-FI",
      en: "en-GB",
      sv: "sv-SE",
      de: "de-DE",
      fr: "fr-FR",
      nl: "nl-NL",
    };
    utter.lang = langMap[lang] || lang;
    utter.rate = 0.85;
    setSpeaking(phraseId);
    utter.onend = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(utter);
  };

  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4 pt-2">
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "1.6rem",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          TRANSLATION HELPER
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "2px" }}>
          Tap a phrase to show — tap 🔊 to speak aloud
        </p>
      </div>

      {/* Language tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "1.25rem",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setActiveLang(lang.code)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: "20px",
              border: activeLang === lang.code ? "2px solid var(--rynkeby-red)" : "1px solid rgba(255,255,255,0.12)",
              background: activeLang === lang.code ? "rgba(200,16,46,0.15)" : "var(--bg-card)",
              color: activeLang === lang.code ? "#f0f6fc" : "#8b949e",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: activeLang === lang.code ? 600 : 400,
              fontSize: "0.85rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Phrases */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {phrases.map((phrase) => {
          const translation = phrase.translations[activeLang];
          const isSpeaking = speaking === phrase.id;

          return (
            <div
              key={phrase.id}
              className="card"
              style={{ padding: "1rem 1.1rem" }}
            >
              {/* English label */}
              <p
                style={{
                  color: "#8b949e",
                  fontSize: "0.75rem",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {phrase.label}
              </p>

              {/* Translation + speak button */}
              <div className="flex items-start gap-3">
                <p
                  style={{
                    flex: 1,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    lineHeight: 1.3,
                    color: "#f0f6fc",
                  }}
                >
                  {translation}
                </p>
                {hasSpeech && (
                  <button
                    onClick={() => speak(translation, activeLang, phrase.id)}
                    style={{
                      flexShrink: 0,
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: isSpeaking ? "rgba(200,16,46,0.2)" : "rgba(255,255,255,0.06)",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Speak aloud"
                  >
                    {isSpeaking ? "🔴" : "🔊"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
