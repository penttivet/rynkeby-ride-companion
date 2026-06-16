"use client";
import { useEffect, useState, useRef } from "react";

interface CarLocation {
  teamId: string;
  teamName: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

const TEAM_NAMES: Record<string, string> = {
  media: "Media Team",
  oulu: "Team Oulu",
  "jarvi-suomi": "Team Järvi-Suomi",
  espoo: "Team Espoo",
  vantaa: "Team Vantaa",
  turku: "Team Turku",
  hame: "Team Häme",
  support: "Support Team",
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function MapPage() {
  const [locations, setLocations] = useState<CarLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(data.locations || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
    intervalRef.current = setInterval(fetchLocations, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", paddingBottom: "80px", background: "#0d1117", fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: 1 }}>🚗 SUPPORT CARS</h1>
        <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: "2px 0 0" }}>Live locations — updates every 15s</p>
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {loading ? (
          <p style={{ color: "#8b949e", textAlign: "center", padding: "2rem" }}>Ladataan sijainteja...</p>
        ) : locations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚗</p>
            <p style={{ color: "#8b949e" }}>Ei aktiivisia support-autoja</p>
            <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "0.5rem" }}>Support-auton kuljettaja käynnistää seurannan Support-sivulta</p>
          </div>
        ) : (
          locations.map(loc => (
            <div key={loc.teamId} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>🚗</span>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>{loc.teamName}</p>
                    <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: 0 }}>Päivitetty {timeAgo(loc.updatedAt)}</p>
                  </div>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              </div>

              <a
                href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", padding: "10px 14px", borderRadius: 10, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, textAlign: "center" }}
              >
                📍 Avaa Google Mapsissa →
              </a>

              <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: "0.5rem 0 0", textAlign: "center" }}>
                {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
