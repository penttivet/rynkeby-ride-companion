"use client";

import { useEffect, useState } from "react";
import { getHelpRequests, updateRequestStatus } from "@/lib/data";
import type { HelpRequest } from "@/types";

const statusConfig = {
  open: { label: "Open", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", color: "#ef4444" },
  in_progress: { label: "In Progress", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", color: "#f59e0b" },
  solved: { label: "Solved", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
};

export default function SupportPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filter, setFilter] = useState<"all" | HelpRequest["status"]>("all");

  useEffect(() => {
    setRequests(getHelpRequests());
  }, []);

  const handleStatus = (id: string, status: HelpRequest["status"]) => {
    const updated = updateRequestStatus(id, status);
    setRequests(updated);
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    open: requests.filter((r) => r.status === "open").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    solved: requests.filter((r) => r.status === "solved").length,
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
          SUPPORT DASHBOARD
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "2px" }}>
          {requests.length} total requests
        </p>
      </div>

      {/* Summary counts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["open", "in_progress", "solved"] as const).map((s) => {
          const cfg = statusConfig[s];
          return (
            <div
              key={s}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: "10px",
                padding: "0.6rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: cfg.color,
                  lineHeight: 1,
                }}
              >
                {counts[s]}
              </p>
              <p style={{ color: "#8b949e", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {cfg.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
        {(["all", "open", "in_progress", "solved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: "8px",
              border: filter === f ? "2px solid var(--rynkeby-red)" : "1px solid rgba(255,255,255,0.1)",
              background: filter === f ? "rgba(200,16,46,0.12)" : "var(--bg-card)",
              color: filter === f ? "#f0f6fc" : "#8b949e",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: filter === f ? 600 : 400,
              fontSize: "0.75rem",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "in_progress" ? "Active" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#8b949e",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</p>
            <p>No requests in this category</p>
          </div>
        )}
        {filtered.map((req) => {
          const cfg = statusConfig[req.status];
          return (
            <div
              key={req.id}
              className="card"
              style={{
                borderColor: req.status === "open" ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "#f0f6fc" }}>
                    {req.cyclistName}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: req.status === "open" ? "#ef4444" : "#f0f6fc",
                    }}
                  >
                    {req.issueType}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      color: cfg.color,
                      borderRadius: "6px",
                      padding: "3px 9px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <p style={{ color: "#8b949e", fontSize: "0.75rem", textAlign: "right", marginTop: "4px" }}>
                    {req.time}
                  </p>
                </div>
              </div>

              {/* Location */}
              {req.lat && req.lng ? (
                <a
                  href={`https://maps.google.com/?q=${req.lat},${req.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", color: "#3b82f6", fontSize: "0.82rem", marginBottom: "10px" }}
                >
                  📍 {req.lat}, {req.lng} →
                </a>
              ) : (
                <p style={{ color: "#8b949e", fontSize: "0.82rem", marginBottom: "10px" }}>
                  📍 Location unavailable
                </p>
              )}

              {/* Action buttons */}
              {req.status !== "solved" && (
                <div className="flex gap-2">
                  {req.status === "open" && (
                    <button
                      onClick={() => handleStatus(req.id, "in_progress")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid rgba(245,158,11,0.3)",
                        background: "rgba(245,158,11,0.1)",
                        color: "#f59e0b",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      → On my way
                    </button>
                  )}
                  <button
                    onClick={() => handleStatus(req.id, "solved")}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid rgba(16,185,129,0.3)",
                      background: "rgba(16,185,129,0.1)",
                      color: "#10b981",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    ✓ Mark Solved
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
