"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStage } from "@/lib/data";
import type { Stage } from "@/types";
import { demoProfile } from "@/lib/data";

export default function TodayPage() {
  const [stage, setStage] = useState<Stage | null>(null);
  const router = useRouter();

  useEffect(() => {
    setStage(getStage());
  }, []);

  if (!stage) return null;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#f0f6fc",
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              TEAM RYNKEBY FINLAND
            </h1>
            <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "2px" }}>
              {demoProfile.name} · {demoProfile.team}
            </p>
          </div>
          <div
            style={{
              background: "var(--rynkeby-red)",
              borderRadius: "8px",
              padding: "4px 10px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            STAGE {stage.stageNumber}
          </div>
        </div>
      </div>

      {/* Stage hero card */}
      <div
        className="mb-3"
        style={{
          background: "linear-gradient(135deg, #1a0a0e 0%, #2d0a14 100%)",
          border: "1px solid rgba(200,16,46,0.3)",
          borderRadius: "20px",
          padding: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: "rgba(200,16,46,0.08)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -10,
            width: 80,
            height: 80,
            background: "rgba(255,215,0,0.05)",
            borderRadius: "50%",
          }}
        />

        {/* Route */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Start
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#f0f6fc",
                  lineHeight: 1.1,
                }}
              >
                {stage.startCity}
              </p>
            </div>
            <div style={{ color: "var(--rynkeby-red)", fontSize: "1.5rem" }}>→</div>
            <div className="flex-1 text-right">
              <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Finish
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#f0f6fc",
                  lineHeight: 1.1,
                }}
              >
                {stage.destinationCity}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-3">
            {[
              { label: "Distance", value: `${stage.distanceKm} km` },
              { label: "Start", value: stage.startTime },
              { label: "ETA", value: stage.eta },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                  padding: "0.6rem 0.5rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#8b949e", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "var(--rynkeby-yellow)",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Stop */}
      <div className="card mb-3">
        <div className="flex items-start gap-3">
          <span style={{ fontSize: "1.4rem" }}>📍</span>
          <div>
            <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>
              Next Stop
            </p>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: "#f0f6fc" }}>
              {stage.nextStop}
            </p>
          </div>
        </div>
      </div>

      {/* Hotel */}
      <div className="card mb-3">
        <div className="flex items-start gap-3">
          <span style={{ fontSize: "1.4rem" }}>🏨</span>
          <div>
            <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>
              Tonight's Hotel
            </p>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f0f6fc" }}>
              {stage.hotel}
            </p>
          </div>
        </div>
      </div>

      {/* Important message */}
      {stage.importantMessage && (
        <div
          className="mb-4"
          style={{
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: "14px",
            padding: "1rem 1.2rem",
          }}
        >
          <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
            ⚠️ Message of the Day
          </p>
          <p style={{ color: "#f0f6fc", fontSize: "0.95rem", lineHeight: 1.5 }}>
            {stage.importantMessage}
          </p>
        </div>
      )}

      {/* SOS Button */}
      <button
        onClick={() => router.push("/sos")}
        className="w-full btn-lg"
        style={{
          background: "var(--rynkeby-red)",
          color: "#fff",
          fontSize: "1.3rem",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          letterSpacing: "0.1em",
          minHeight: "68px",
          borderRadius: "16px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(200,16,46,0.4)",
        }}
      >
        🆘 EMERGENCY / SOS
      </button>
      <p style={{ textAlign: "center", color: "#8b949e", fontSize: "0.75rem", marginTop: "8px" }}>
        Tap to send a help request with your GPS location
      </p>
    </div>
  );
}
