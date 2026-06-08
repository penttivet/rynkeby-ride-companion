"use client";

import { useEffect, useState } from "react";
import { getStage, saveStage, defaultStage } from "@/lib/data";
import type { Stage } from "@/types";

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  const commonStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "10px 12px",
    color: "#f0f6fc",
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          color: "#8b949e",
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ ...commonStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={commonStyle}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [stage, setStage] = useState<Stage>(defaultStage);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStage(getStage());
  }, []);

  const update = (key: keyof Stage, value: string) => {
    setSaved(false);
    setStage((prev) => ({
      ...prev,
      [key]: key === "stageNumber" || key === "distanceKm" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    saveStage(stage);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setStage(defaultStage);
    saveStage(defaultStage);
    setSaved(false);
  };

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
          ADMIN — STAGE EDITOR
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "2px" }}>
          Saved to localStorage · syncs to Today page instantly
        </p>
      </div>

      {/* Form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: "1rem",
            color: "#8b949e",
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          Stage Info
        </p>
        <Field label="Stage Number" value={stage.stageNumber} onChange={(v) => update("stageNumber", v)} type="number" />
        <Field label="Date" value={stage.date} onChange={(v) => update("date", v)} type="date" />
        <Field label="Start City" value={stage.startCity} onChange={(v) => update("startCity", v)} />
        <Field label="Destination City" value={stage.destinationCity} onChange={(v) => update("destinationCity", v)} />
        <Field label="Distance (km)" value={stage.distanceKm} onChange={(v) => update("distanceKm", v)} type="number" />
        <Field label="Start Time (HH:MM)" value={stage.startTime} onChange={(v) => update("startTime", v)} />
        <Field label="ETA (HH:MM)" value={stage.eta} onChange={(v) => update("eta", v)} />
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: "1rem",
            color: "#8b949e",
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          Logistics
        </p>
        <Field label="Next Stop" value={stage.nextStop} onChange={(v) => update("nextStop", v)} />
        <Field label="Hotel" value={stage.hotel} onChange={(v) => update("hotel", v)} textarea />
        <Field label="Important Message of the Day" value={stage.importantMessage} onChange={(v) => update("importantMessage", v)} textarea />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full btn-lg"
        style={{
          background: saved ? "rgba(16,185,129,0.2)" : "var(--rynkeby-red)",
          border: saved ? "2px solid rgba(16,185,129,0.5)" : "none",
          color: saved ? "#10b981" : "#fff",
          cursor: "pointer",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: "1.2rem",
          letterSpacing: "0.08em",
          marginBottom: "0.75rem",
          transition: "all 0.2s ease",
          boxShadow: saved ? "none" : "0 4px 16px rgba(200,16,46,0.35)",
        }}
      >
        {saved ? "✓ SAVED!" : "SAVE CHANGES"}
      </button>

      <button
        onClick={handleReset}
        className="w-full btn-lg"
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#8b949e",
          cursor: "pointer",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: "0.06em",
        }}
      >
        Reset to Demo Data
      </button>
    </div>
  );
}
