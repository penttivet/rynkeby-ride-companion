"use client";

import { useState } from "react";
import { addHelpRequest } from "@/lib/data";
import { demoProfile } from "@/lib/data";
import type { HelpRequest } from "@/types";

const issues = [
  { id: "flat_tire", label: "Flat Tire", emoji: "🚲", color: "#f59e0b" },
  { id: "mechanical", label: "Mechanical Problem", emoji: "🔧", color: "#f59e0b" },
  { id: "need_water", label: "Need Water", emoji: "💧", color: "#3b82f6" },
  { id: "need_food", label: "Need Food", emoji: "🍌", color: "#10b981" },
  { id: "medical", label: "Medical Help", emoji: "🏥", color: "#ef4444" },
  { id: "lost", label: "I Am Lost", emoji: "🗺️", color: "#8b5cf6" },
  { id: "cannot_continue", label: "I Cannot Continue", emoji: "🛑", color: "#ef4444" },
  { id: "other", label: "Other Problem", emoji: "❓", color: "#6b7280" },
];

type PageState = "select" | "sending" | "sent";

export default function SOSPage() {
  const [state, setState] = useState<PageState>("select");
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleIssuePress = async (issueLabel: string) => {
    setSelectedIssue(issueLabel);
    setState("sending");

    // Try to get GPS
    let resolvedLat: number | null = null;
    let resolvedLng: number | null = null;

    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            enableHighAccuracy: true,
          });
        });
        resolvedLat = parseFloat(pos.coords.latitude.toFixed(5));
        resolvedLng = parseFloat(pos.coords.longitude.toFixed(5));
      } catch {
        setGeoError("Location not available");
      }
    }

    setLat(resolvedLat);
    setLng(resolvedLng);

    const request: HelpRequest = {
      id: `req-${Date.now()}`,
      cyclistName: demoProfile.name,
      issueType: issueLabel,
      time: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }),
      lat: resolvedLat,
      lng: resolvedLng,
      status: "open",
    };

    addHelpRequest(request);
    setState("sent");
  };

  const reset = () => {
    setState("select");
    setSelectedIssue(null);
    setLat(null);
    setLng(null);
    setGeoError(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4 pt-2 flex items-center gap-3">
        <div
          style={{
            background: "var(--rynkeby-red)",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
          }}
        >
          🆘
        </div>
        <div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            SEND HELP REQUEST
          </h1>
          <p style={{ color: "#8b949e", fontSize: "0.8rem" }}>
            Your location will be sent to Support
          </p>
        </div>
      </div>

      {state === "select" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => handleIssuePress(issue.label)}
              style={{
                background: "var(--bg-card)",
                border: `2px solid ${issue.id === "medical" || issue.id === "cannot_continue" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "16px",
                padding: "1.2rem 0.8rem",
                cursor: "pointer",
                textAlign: "center",
                color: "#f0f6fc",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                minHeight: "100px",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{issue.emoji}</span>
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}
              >
                {issue.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {state === "sending" && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "pulse 1s infinite" }}>
            📡
          </div>
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "1.4rem",
              letterSpacing: "0.04em",
            }}
          >
            Getting your location...
          </p>
          <p style={{ color: "#8b949e", marginTop: "8px" }}>Sending help request</p>
        </div>
      )}

      {state === "sent" && (
        <div>
          {/* Success card */}
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "2px solid rgba(16,185,129,0.4)",
              borderRadius: "20px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>✅</div>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "1.8rem",
                letterSpacing: "0.05em",
                color: "#10b981",
                marginBottom: "0.5rem",
              }}
            >
              HELP REQUEST SENT
            </h2>
            <p style={{ color: "#f0f6fc", fontSize: "1rem", fontWeight: 600 }}>
              {selectedIssue}
            </p>
            <p style={{ color: "#8b949e", fontSize: "0.85rem", marginTop: "4px" }}>
              Support car has been notified
            </p>
          </div>

          {/* Location info */}
          <div className="card mb-4">
            <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
              📍 Your Location
            </p>
            {lat && lng ? (
              <div>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#f0f6fc" }}>
                  {lat}, {lng}
                </p>
                <a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3b82f6", fontSize: "0.85rem", textDecoration: "underline" }}
                >
                  Open in Google Maps →
                </a>
              </div>
            ) : (
              <p style={{ color: "#f59e0b", fontSize: "0.9rem" }}>
                ⚠️ {geoError || "Location not available – support will contact you"}
              </p>
            )}
          </div>

          {/* Emergency contact */}
          <div className="card mb-4">
            <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
              Emergency Contact
            </p>
            <p style={{ fontWeight: 600, color: "#f0f6fc" }}>{demoProfile.emergencyContact}</p>
          </div>

          <button
            onClick={reset}
            className="w-full btn-lg"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#f0f6fc",
              cursor: "pointer",
            }}
          >
            ← Send Another Request
          </button>
        </div>
      )}
    </div>
  );
}
