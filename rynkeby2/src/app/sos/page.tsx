"use client";
import { useState } from "react";
import { addHelpRequest, demoProfile } from "@/lib/data";
import type { HelpRequest } from "@/types";

const issues = [
  { label: "Flat Tire", emoji: "🚲", color: "#f59e0b" },
  { label: "Mechanical Problem", emoji: "🔧", color: "#f59e0b" },
  { label: "Need Water", emoji: "💧", color: "#3b82f6" },
  { label: "Need Food", emoji: "🍌", color: "#10b981" },
  { label: "Medical Help", emoji: "🏥", color: "#ef4444" },
  { label: "I Am Lost", emoji: "🗺️", color: "#8b5cf6" },
  { label: "Cannot Continue", emoji: "🛑", color: "#ef4444" },
  { label: "Other Problem", emoji: "❓", color: "#6b7280" },
];

export default function SOSPage() {
  const [state, setState] = useState<"select" | "sending" | "sent">("select");
  const [selected, setSelected] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handle = async (label: string) => {
    setSelected(label);
    setState("sending");
    let rlat: number | null = null, rlng: number | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 }));
      rlat = parseFloat(pos.coords.latitude.toFixed(5));
      rlng = parseFloat(pos.coords.longitude.toFixed(5));
    } catch {}
    setLat(rlat); setLng(rlng);
    addHelpRequest({
      id: `req-${Date.now()}`,
      cyclistName: demoProfile.name,
      issueType: label,
      time: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }),
      lat: rlat, lng: rlng, status: "open",
    });
    setState("sent");
  };

  return (
    <div className="page">
      <div style={{ paddingTop: "0.5rem", marginBottom: "1rem" }}>
        <h1 className="heading" style={{ fontSize: "1.6rem" }}>🆘 SEND HELP REQUEST</h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem" }}>Your location will be sent to Support</p>
      </div>

      {state === "select" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {issues.map((issue) => (
            <button key={issue.label} onClick={() => handle(issue.label)} style={{
              background: "var(--card)", border: "2px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "1.2rem 0.8rem", cursor: "pointer",
              color: "var(--text)", display: "flex", flexDirection: "column",
              alignItems: "center", gap: "0.5rem", minHeight: 100,
            }}>
              <span style={{ fontSize: "2rem" }}>{issue.emoji}</span>
              <span className="heading" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>{issue.label}</span>
            </button>
          ))}
        </div>
      )}

      {state === "sending" && (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📡</div>
          <p className="heading" style={{ fontSize: "1.4rem" }}>Getting your location...</p>
        </div>
      )}

      {state === "sent" && (
        <div>
          <div style={{
            background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.4)",
            borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1rem",
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>✅</div>
            <h2 className="heading" style={{ fontSize: "1.8rem", color: "#10b981" }}>HELP REQUEST SENT</h2>
            <p style={{ fontWeight: 600, marginTop: 4 }}>{selected}</p>
            <p style={{ color: "#8b949e", fontSize: "0.85rem" }}>Support car has been notified</p>
          </div>

          <div className="card">
            <p className="label">📍 Your Location</p>
            {lat && lng ? (
              <div>
                <p className="heading" style={{ fontSize: "1.1rem" }}>{lat}, {lng}</p>
                <a href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank"
                  rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "0.85rem" }}>
                  Open in Google Maps →
                </a>
              </div>
            ) : (
              <p style={{ color: "#f59e0b" }}>⚠️ Location unavailable — support will contact you</p>
            )}
          </div>

          <button className="btn btn-ghost" onClick={() => setState("select")}>← Send Another Request</button>
        </div>
      )}
    </div>
  );
}
