"use client";

import { useEffect, useRef, useState } from "react";
import { ROUTES } from "@/lib/routes";

// Seurattavat tiimit: paikannuksen teamId -> reittiavain + näyttönimi
const TRACK_TEAMS: { teamId: string; routeKey: string; name: string }[] = [
  { teamId: "media", routeKey: "media", name: "Media Team" },
  { teamId: "oulu", routeKey: "oulu", name: "Team Oulu" },
  { teamId: "jarvi-suomi", routeKey: "jarvi-tampere", name: "Team Järvi-Suomi (+ Tampere)" },
  { teamId: "espoo", routeKey: "espoo", name: "Team Espoo" },
  { teamId: "vantaa", routeKey: "vantaa", name: "Team Vantaa" },
  { teamId: "turku", routeKey: "turku-osterbothnia", name: "Team Turku (+ Österbothnia)" },
  { teamId: "hame", routeKey: "hame", name: "Team Häme" },
];

interface TeamLocation {
  teamId: string;
  teamName: string;
  lat: number;
  lng: number;
  timestamp: number;
}

interface FindMyLink {
  teamId: string;
  teamName: string;
  name: string;
  url: string;
  updatedAt: number;
}

export default function SeuraaPage() {
  const today = new Date().toISOString().split("T")[0];

  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const fittedRef = useRef<boolean>(false);
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState<TeamLocation[]>([]);
  const [error, setError] = useState(false);
  const [lastFetch, setLastFetch] = useState<string>("");
  const [findMyLinks, setFindMyLinks] = useState<FindMyLink[]>([]);

  // Tänään ajossa oleva etappi (jaettu reitti, media-reitin mukaan)
  const mediaRoute = ROUTES["media"] || [];
  const todayStage = mediaRoute.find((d) => d.date === today);
  const nextStage = todayStage || mediaRoute.find((d) => d.date > today);

  // Lataa Leaflet-kartta (OpenStreetMap) CDN:stä
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    function initMap() {
      const L = (window as any).L;
      if (!L || mapRef.current) return;
      const el = document.getElementById("seuraa-map");
      if (!el) return;
      const map = L.map(el, { zoomControl: true }).setView([51.3, 6.5], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
    }

    const w = window as any;
    if (w.L) {
      initMap();
    } else {
      let script = document.getElementById("leaflet-js") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.body.appendChild(script);
      }
      script.addEventListener("load", initMap);
    }
  }, []);

  // Hae sijainnit ja päivitä 25 s välein
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/locations", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (cancelled) return;
        setLocations(Array.isArray(data.locations) ? data.locations : []);
        setError(false);
        setLastFetch(new Date().toLocaleTimeString("fi-FI"));
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const id = setInterval(load, 25000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Hae Find My / muut jakolinkit ja päivitä 60 s välein
  useEffect(() => {
    let cancelled = false;

    async function loadLinks() {
      try {
        const res = await fetch("/api/findmy", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (cancelled) return;
        setFindMyLinks(Array.isArray(data.links) ? data.links : []);
      } catch {
        // hiljainen epäonnistuminen — tämä on vain varajärjestelmä
      }
    }

    loadLinks();
    const id = setInterval(loadLinks, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Piirrä/päivitä merkit kartalle
  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    const seen = new Set<string>();
    locations.forEach((loc) => {
      seen.add(loc.teamId);
      const label = `${loc.teamName}<br/>Päivitetty ${new Date(loc.timestamp).toLocaleTimeString("fi-FI")}`;
      if (markersRef.current[loc.teamId]) {
        markersRef.current[loc.teamId].setLatLng([loc.lat, loc.lng]).bindPopup(label);
      } else {
        const m = L.marker([loc.lat, loc.lng]).addTo(map).bindPopup(label);
        markersRef.current[loc.teamId] = m;
      }
    });

    // Poista merkit joukkueilta joita ei enää näy
    Object.keys(markersRef.current).forEach((tid) => {
      if (!seen.has(tid)) {
        map.removeLayer(markersRef.current[tid]);
        delete markersRef.current[tid];
      }
    });

    // Sovita näkymä kerran kun ensimmäiset sijainnit tulevat
    if (!fittedRef.current && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds.pad(0.3));
      fittedRef.current = true;
    }
  }, [locations, mapReady]);

  const liveIds = new Set(locations.map((l) => l.teamId));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0d1117",
        color: "white",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ padding: "1.2rem 1.2rem 0.6rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>🚴 Rynkeby — Joukkueiden seuranta</h1>
        <p style={{ color: "#8b949e", fontSize: "0.85rem", margin: "4px 0 0" }}>
          Team Rynkeby Finland · Kiel–Paris 2026
        </p>

        {nextStage && (
          <div style={{ background: "#161b28", borderRadius: 10, padding: "0.8rem 1rem", marginTop: "0.9rem" }}>
            <p style={{ margin: 0, color: "#8b949e", fontSize: "0.8rem" }}>
              {todayStage ? "Tänään reitillä" : "Seuraava etappi"} · {nextStage.date}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "1.05rem" }}>
              🚴 {nextStage.from || nextStage.to} → {nextStage.to}
              {nextStage.km ? ` · ${nextStage.km} km` : ""}
            </p>
          </div>
        )}
      </div>

      <div
        id="seuraa-map"
        style={{ height: "45vh", minHeight: 280, width: "100%", background: "#1a1a2e" }}
      />

      <div style={{ padding: "1rem 1.2rem 2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Joukkueet</h2>
          <span style={{ color: "#8b949e", fontSize: "0.75rem" }}>
            {error ? "Päivitys epäonnistui" : lastFetch ? `Päivitetty ${lastFetch}` : "Haetaan…"}
          </span>
        </div>

        <p style={{ color: "#8b949e", fontSize: "0.8rem", margin: "0 0 12px" }}>
          🟢 Live = joukkue lähettää sijaintiaan juuri nyt. Sijainti näkyy kun joku joukkueen autossa/pyörässä pitää seurantaa päällä.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {TRACK_TEAMS.map((t) => {
            const live = locations.find((l) => l.teamId === t.teamId);
            const isLive = liveIds.has(t.teamId);
            return (
              <div
                key={t.teamId}
                style={{
                  background: isLive ? "rgba(16,185,129,0.08)" : "#161b28",
                  border: `1px solid ${isLive ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  padding: "0.8rem 1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.98rem" }}>{t.name}</span>
                  {isLive ? (
                    <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700 }}>🟢 Live</span>
                  ) : (
                    <span style={{ color: "#8b949e", fontSize: "0.8rem" }}>⚪ Ei live-sijaintia</span>
                  )}
                </div>
                {isLive && live && (
                  <a
                    href={`https://maps.google.com/?q=${live.lat},${live.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", color: "#3b82f6", fontSize: "0.82rem", marginTop: 6 }}
                  >
                    📍 Avaa kartalla · päivitetty {new Date(live.timestamp).toLocaleTimeString("fi-FI")} →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {findMyLinks.length > 0 && (
          <>
            <h2 style={{ fontSize: "1.1rem", margin: "1.5rem 0 6px" }}>📍 Löydä-sijainnit (varajärjestelmä)</h2>
            <p style={{ color: "#8b949e", fontSize: "0.78rem", margin: "0 0 12px" }}>
              Nämä ovat pyöräilijöiden itse jakamia Find My / WhatsApp-linkkejä, jotka toimivat vaikka yllä oleva live-seuranta katkeaisi.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {findMyLinks.map((l) => (
                <a
                  key={`${l.teamId}-${l.name}`}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#161b28",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: "0.75rem 1rem",
                    color: "#f0f6fc",
                    textDecoration: "none",
                  }}
                >
                  <span>
                    <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>{l.name}</span>
                    <span style={{ color: "#8b949e", fontSize: "0.75rem", display: "block" }}>{l.teamName}</span>
                  </span>
                  <span style={{ color: "#3b82f6", fontSize: "0.85rem" }}>Seuraa →</span>
                </a>
              ))}
            </div>
          </>
        )}

        <p style={{ color: "#6b7280", fontSize: "0.72rem", textAlign: "center", marginTop: "1.5rem" }}>
          Sijainti päivittyy automaattisesti. Kartta: © OpenStreetMap.
        </p>
      </div>
    </div>
  );
}
