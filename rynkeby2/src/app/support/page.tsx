"use client";
import { useEffect, useState } from "react";
import { getHelpRequests, updateRequestStatus } from "@/lib/data";
import type { HelpRequest } from "@/types";

const cfg = {
  open: { label: "Open", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", color: "#ef4444" },
  in_progress: { label: "In Progress", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", color: "#f59e0b" },
  solved: { label: "Solved", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
};

export default function SupportPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filter, setFilter] = useState<"all" | HelpRequest["status"]>("all");

  useEffect(() => { setRequests(getHelpRequests()); }, []);

  const handle = (id: string, status: HelpRequest["status"]) => {
    setRequests(updateRequestStatus(id, status));
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const counts = { open: requests.filter((r) => r.status === "open").length, in_progress: requests.filter((r) => r.status === "in_progress").length, solved: requests.filter((r) => r.status === "solved").length };

  return (
    <div className="page">
      <div style={{ paddingTop: "0.5rem", marginBottom: "1rem" }}>
        <h1 className="heading" style={{ fontSize: "1.6rem" }}>🚗 SUPPORT DASHBOARD</h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem" }}>{requests.length} total requests</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["open", "in_progress", "solved"] as const).map((s) => (
          <div key={s} style={{ background: cfg[s].bg, border: `1px solid ${cfg[s].border}`, borderRadius: 10, padding: "0.6rem", textAlign: "center" }}>
            <p className="heading" style={{ fontSize: "1.5rem", color: cfg[s].color, lineHeight: 1 }}>{counts[s]}</p>
            <p className="label">{cfg[s].label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
        {(["all", "open", "in_progress", "solved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 8,
            border: filter === f ? "2px solid #C8102E" : "1px solid rgba(255,255,255,0.1)",
            background: filter === f ? "rgba(200,16,46,0.12)" : "var(--card)",
            color: filter === f ? "var(--text)" : "#8b949e",
            fontWeight: filter === f ? 600 : 400, fontSize: "0.75rem", cursor: "pointer",
          }}>{f === "in_progress" ? "Active" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#8b949e" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</p>
            <p>No requests in this category</p>
          </div>
        )}
        {filtered.map((req) => (
          <div key={req.id} className="card" style={{ borderColor: req.status === "open" ? "rgba(239,68,68,0.25)" : undefined }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 700 }}>{req.cyclistName}</p>
                <p className="heading" style={{ fontSize: "1.1rem", color: req.status === "open" ? "#ef4444" : "var(--text)" }}>{req.issueType}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: cfg[req.status].bg, border: `1px solid ${cfg[req.status].border}`, color: cfg[req.status].color, borderRadius: 6, padding: "3px 9px", fontSize: "0.75rem", fontWeight: 600 }}>{cfg[req.status].label}</span>
                <p style={{ color: "#8b949e", fontSize: "0.75rem", marginTop: 4 }}>{req.time}</p>
              </div>
            </div>
            {req.lat && req.lng ? (
              <a href={`https://maps.google.com/?q=${req.lat},${req.lng}`} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: "#3b82f6", fontSize: "0.82rem", marginBottom: 10 }}>
                📍 {req.lat}, {req.lng} →
              </a>
            ) : (
              <p style={{ color: "#8b949e", fontSize: "0.82rem", marginBottom: 10 }}>📍 Location unavailable</p>
            )}
            {req.status !== "solved" && (
              <div style={{ display: "flex", gap: 8 }}>
                {req.status === "open" && (
                  <button onClick={() => handle(req.id, "in_progress")} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>→ On my way</button>
                )}
                <button onClick={() => handle(req.id, "solved")} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10b981", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>✓ Mark Solved</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
