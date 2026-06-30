"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES, TEAMS } from "@/lib/routes";

export default function RoutePage() {
  const today = new Date().toISOString().split("T")[0];
  const [teamLabel, setTeamLabel] = useState<string>(TEAMS[0].label);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rynkeby_team");
      if (saved && TEAMS.some((t) => t.label === saved)) {
        setTeamLabel(saved);
      }
    } catch {}
  }, []);

  const team = TEAMS.find((t) => t.label === teamLabel) || TEAMS[0];
  const route = ROUTES[team.routeKey] || [];

  function onSelectTeam(label: string) {
    setTeamLabel(label);
    try {
      localStorage.setItem("rynkeby_team", label);
    } catch {}
  }

  const rideDays = route.filter((d) => !d.prep);
  const totalKm = rideDays.reduce((sum, d) => sum + d.km, 0);

  return (
    <div style={{ color: "white", padding: "1.5rem", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🗺️ Reitti</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: 6 }}>
          Valitse tiimi
        </label>
        <select
          value={teamLabel}
          onChange={(e) => onSelectTeam(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: 8,
            background: "#1a1a2e",
            color: "white",
            border: "1px solid #333",
            fontSize: "1rem",
          }}
        >
          {TEAMS.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: "#0f3460", borderRadius: 10, padding: "1rem", marginBottom: "1.2rem" }}>
        <p style={{ fontSize: "1.05rem" }}>
          🚴 Ajopäivät: <strong>{rideDays.length}</strong> &nbsp;·&nbsp; 📏 Yhteensä: <strong>{totalKm} km</strong>
        </p>
      </div>

      {route.map((d, i) => {
        const isToday = d.date === today;
        return (
          <div
            key={d.date + "-" + i}
            style={{
              background: isToday ? "#16332e" : d.prep ? "#161626" : "#1a1a2e",
              border: isToday ? "1px solid #2e7d5a" : "1px solid #2a2a3a",
              borderRadius: 12,
              padding: "1rem 1.2rem",
              marginBottom: "0.8rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#aaa", fontSize: "0.85rem" }}>{d.date}</span>
              {isToday && (
                <span style={{ background: "#2e7d5a", color: "white", fontSize: "0.75rem", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                  TÄNÄÄN
                </span>
              )}
            </div>

            <h3 style={{ fontSize: "1.15rem", marginBottom: 6 }}>{d.day}</h3>

            {d.prep ? (
              <>
                <p style={{ fontSize: "1rem", marginBottom: 4 }}>📍 {d.to}</p>
                {d.note && <p style={{ fontSize: "0.95rem", color: "#cfcfe6", marginBottom: 4 }}>{d.note}</p>}
                <p style={{ fontSize: "1rem" }}>🏨 {d.hotel}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "1rem", marginBottom: 4 }}>🚴 {d.from} → {d.to}</p>
                <p style={{ fontSize: "1rem", marginBottom: 4 }}>📏 {d.km} km</p>
                <p style={{ fontSize: "1rem" }}>🏨 {d.hotel}</p>
              </>
            )}
          </div>
        );
      })}

      <Link
        href="/today"
        style={{
          display: "block",
          textAlign: "center",
          background: "#0f3460",
          color: "white",
          padding: "0.9rem",
          borderRadius: 10,
          textDecoration: "none",
          fontSize: "1.05rem",
          fontWeight: 600,
          marginTop: "0.5rem",
        }}
      >
        ← Takaisin tähän päivään
      </Link>
    </div>
  );
}
