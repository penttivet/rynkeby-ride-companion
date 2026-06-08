"use client";
import { useEffect, useState } from "react";
import { getStage, saveStage, clearStageOverride, stages, getTodayStage } from "@/lib/data";
import type { Stage } from "@/types";

export default function AdminPage() {
  const [stage, setStage] = useState<Stage>(stages[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setStage(getStage()); }, []);

  const update = (key: keyof Stage, value: string) => {
    setSaved(false);
    setStage((prev) => ({ ...prev, [key]: key === "stageNumber" || key === "distanceKm" ? Number(value) : value }));
  };

  const handleSave = () => { saveStage(stage); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const handleAuto = () => { clearStageOverride(); setStage(getTodayStage()); setSaved(false); };

  const Field = ({ label, k, type = "text", textarea = false }: { label: string; k: keyof Stage; type?: string; textarea?: boolean }) => (
    <div style={{ marginBottom: "1rem" }}>
      <p className="label" style={{ marginBottom: 4 }}>{label}</p>
      {textarea ? (
        <textarea value={String(stage[k])} onChange={(e) => update(k, e.target.value)} rows={2}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem", outline: "none", resize: "vertical" }} />
      ) : (
        <input type={type} value={String(stage[k])} onChange={(e) => update(k, e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem", outline: "none" }} />
      )}
    </div>
  );

  return (
    <div className="page">
      <div style={{ paddingTop: "0.5rem", marginBottom: "1rem" }}>
        <h1 className="heading" style={{ fontSize: "1.6rem" }}>⚙️ ADMIN</h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem" }}>Edit today's stage info</p>
      </div>

      {/* Quick select stage */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p className="label" style={{ marginBottom: 8 }}>Quick select stage</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {stages.map((s) => (
            <button key={s.stageNumber} onClick={() => { setStage(s); setSaved(false); }} style={{
              padding: "6px 12px", borderRadius: 8, border: stage.stageNumber === s.stageNumber ? "2px solid #C8102E" : "1px solid rgba(255,255,255,0.12)",
              background: stage.stageNumber === s.stageNumber ? "rgba(200,16,46,0.15)" : "var(--surface)",
              color: "var(--text)", fontSize: "0.8rem", cursor: "pointer",
            }}>S{s.stageNumber}: {s.startCity}→{s.destinationCity}</button>
          ))}
        </div>
        <button onClick={handleAuto} style={{ marginTop: 10, width: "100%", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#8b949e", cursor: "pointer", fontSize: "0.85rem" }}>
          🔄 Auto — show today's stage
        </button>
      </div>

      <div className="card">
        <Field label="Stage Number" k="stageNumber" type="number" />
        <Field label="Start City" k="startCity" />
        <Field label="Destination City" k="destinationCity" />
        <Field label="Distance (km)" k="distanceKm" type="number" />
        <Field label="Start Time" k="startTime" />
        <Field label="ETA" k="eta" />
        <Field label="Next Stop" k="nextStop" />
        <Field label="Hotel" k="hotel" textarea />
        <Field label="Important Message" k="importantMessage" textarea />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button className="btn btn-red" onClick={handleSave} style={{ marginBottom: "0.75rem", background: saved ? "rgba(16,185,129,0.2)" : undefined, color: saved ? "#10b981" : undefined, boxShadow: saved ? "none" : undefined }}>
          {saved ? "✓ SAVED!" : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}
