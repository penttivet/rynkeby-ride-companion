"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStage, demoProfile, stages } from "@/lib/data";
import type { Stage } from "@/types";

export default function HomePage() {
  const [stage, setStage] = useState<Stage | null>(null);
  const router = useRouter();

  useEffect(() => { setStage(getStage()); }, []);
  if (!stage) return null;

  const today = new Date().toISOString().split("T")[0];
  const currentIdx = stages.findIndex((s) => s.date === today);

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: "1rem", paddingTop: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="heading" style={{ fontSize: "1.4rem", lineHeight: 1 }}>TEAM RYNKEBY FINLAND</h1>
            <p style={{ color: "#8b949e", fontSize: "0.78rem", marginTop: 2 }}>{demoProfile.name} · {demoProfile.team}</p>
          </div>
          <div style={{
            background: "#C8102E", borderRadius: 8, padding: "4px 12px",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "1rem", color: "#fff", letterSpacing: "0.05em",
          }}>
            STAGE {stage.stageNumber}
          </div>
        </div>
      </div>

      {/* Stage card */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a0e 0%, #2d0a14 100%)",
        border: "1px solid rgba(200,16,46,0.3)", borderRadius: 20,
        padding: "1.4rem", marginBottom: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <p className="label">Start</p>
            <p className="heading" style={{ fontSize: "1.6rem", lineHeight: 1.1 }}>{stage.startCity}</p>
          </div>
          <span style={{ color: "#C8102E", fontSize: "1.5rem" }}>→</span>
          <div style={{ flex: 1, textAlign: "right" }}>
            <p className="label">Finish</p>
            <p className="heading" style={{ fontSize: "1.6rem", lineHeight: 1.1 }}>{stage.destinationCity}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { label: "Distance", value: `${stage.distanceKm} km` },
            { label: "Start", value: stage.startTime },
            { label: "ETA", value: stage.eta },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 10,
              padding: "0.5rem", textAlign: "center",
            }}>
              <p className="label">{s.label}</p>
              <p className="heading" style={{ fontSize: "1.1rem", color: "#FFD700" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stage progress */}
      {currentIdx >= 0 && (
        <div className="card" style={{ marginBottom: "0.75rem" }}>
          <p className="label" style={{ marginBottom: 8 }}>🗓️ Ride Progress</p>
          <div style={{ display: "flex", gap: 4 }}>
            {stages.map((s, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i < currentIdx ? "#C8102E" : i === currentIdx ? "#FFD700" : "rgba(255,255,255,0.1)",
              }} />
            ))}
          </div>
          <p style={{ color: "#8b949e", fontSize: "0.75rem", marginTop: 6 }}>
            Day {currentIdx + 1} of {stages.length} · {stages.length - currentIdx - 1} days to Paris
          </p>
        </div>
      )}

      {/* Next stop */}
      <div className="card">
        <p className="label">📍 Next Stop</p>
        <p style={{ fontWeight: 600, fontSize: "1rem" }}>{stage.nextStop}</p>
      </div>

      {/* Hotel */}
      <div className="card">
        <p className="label">🏨 Tonight's Hotel</p>
        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{stage.hotel}</p>
      </div>

      {/* Message */}
      {stage.importantMessage && (
        <div style={{
          background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)",
          borderRadius: 14, padding: "1rem 1.2rem", marginBottom: "1rem",
        }}>
          <p className="label" style={{ marginBottom: 4 }}>⚠️ Message of the Day</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{stage.importantMessage}</p>
        </div>
      )}

      {/* SOS */}
      <button className="btn btn-red" style={{ minHeight: 64, fontSize: "1.3rem" }}
        onClick={() => router.push("/sos")}>
        🆘 EMERGENCY / SOS
      </button>
      <p style={{ textAlign: "center", color: "#8b949e", fontSize: "0.75rem", marginTop: 8 }}>
        Tap to send a help request with your GPS location
      </p>
    </div>
  );
}
