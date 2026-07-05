"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ROUTES, TEAMS } from "@/lib/routes";

const DAY_COLORS = ["#C8102E", "#2e7d5a", "#3b82f6", "#f59e0b", "#9b5de5", "#00bbf9", "#e07a5f", "#2a9d8f", "#d62828"];

function wptEmoji(name: string, sym: string): string {
  const s = (name + " " + sym).toLowerCase();
  if (s.includes("kahvi") || s.includes("coffee")) return "☕";
  if (s.includes("lounas") || s.includes("ruoka") || s.includes("food") || s.includes("restaurant") || s.includes("lunch")) return "🍽️";
  if (s.includes("bio") || s.includes("wc") || s.includes("vessa") || s.includes("toilet") || s.includes("restroom")) return "🚻";
  if (s.includes("vesi") || s.includes("water")) return "💧";
  if (s.includes("tauko") || s.includes("break") || s.includes("rest")) return "⏸️";
  return "📍";
}

export default function RoutePage() {
  const today = new Date().toISOString().split("T")[0];
  const [teamLabel, setTeamLabel] = useState<string>(TEAMS[0].label);

  const mapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

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
      const el = document.getElementById("route-map");
      if (!el) return;
      const map = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([51.0, 6.5], 5);
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

  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    let cancelled = false;

    async function draw() {
      layersRef.current.forEach((layer) => map.removeLayer(layer));
      layersRef.current = [];

      const allLatLngs: [number, number][] = [];
      let gpxFound = 0;

      for (let i = 0; i < rideDays.length; i++) {
        const d = rideDays[i];
        const color = DAY_COLORS[i % DAY_COLORS.length];
        try {
          const res = await fetch(`/${team.routeKey}-${d.date}.gpx`, { cache: "force-cache" });
          if (!res.ok) continue;
          const text = await res.text();
          if (cancelled) return;
          const xml = new DOMParser().parseFromString(text, "application/xml");

          const trkpts = Array.from(xml.getElementsByTagNameNS("*", "trkpt"));
          const track: [number, number][] = trkpts.map((p) => [
            parseFloat(p.getAttribute("lat") || "0"),
            parseFloat(p.getAttribute("lon") || "0"),
          ]);
          if (track.length > 1) {
            const line = L.polyline(track, { color, weight: 4, opacity: 0.85 }).addTo(map);
            layersRef.current.push(line);
            allLatLngs.push(...track);
            gpxFound++;
          }

          const wpts = Array.from(xml.getElementsByTagNameNS("*", "wpt"));
          wpts.forEach((wp) => {
            const lat = parseFloat(wp.getAttribute("lat") || "0");
            const lng = parseFloat(wp.getAttribute("lon") || "0");
            const nameEl = wp.getElementsByTagNameNS("*", "name")[0];
            const symEl = wp.getElementsByTagNameNS("*", "sym")[0];
            const name = nameEl ? nameEl.textContent || "" : "";
            const sym = symEl ? symEl.textContent || "" : "";
            const emoji = wptEmoji(name, sym);
            const icon = L.divIcon({
              html: `<div style="font-size:16px;line-height:16px">${emoji}</div>`,
              className: "",
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });
            const m = L.marker([lat, lng], { icon }).addTo(map).bindPopup(`${emoji} ${name || "Levähdyspaikka"}<br/><span style="color:#888">${d.date}</span>`);
            layersRef.current.push(m);
          });

          if (track.length > 0) {
            const end = track[track.length - 1];
            const isLast = i === rideDays.length - 1;
            const em = L.circleMarker(end, {
              radius: isLast ? 7 : 4,
              color: "#fff",
              weight: 2,
              fillColor: isLast ? "#2e7d5a" : color,
              fillOpacity: 1,
            }).addTo(map).bindPopup(`<b>${d.to}</b><br/>${d.date} · ${d.km} km`);
            layersRef.current.push(em);
          }
        } catch {
        }
      }

      if (gpxFound === 0) {
        const pts: [number, number][] = rideDays
          .filter((d) => typeof d.lat === "number" && typeof d.lng === "number")
          .map((d) => [d.lat, d.lng]);
        if (pts.length > 0) {
          const line = L.polyline(pts, { color: "#C8102E", weight: 4, opacity: 0.85 }).addTo(map);
          layersRef.current.push(line);
          allLatLngs.push(...pts);
          rideDays.forEach((d, i) => {
            const isLast = i === rideDays.length - 1;
            const mk = L.circleMarker([d.lat, d.lng], {
              radius: isLast ? 7 : 5,
              color: "#fff",
              weight: 2,
              fillColor: isLast ? "#2e7d5a" : "#C8102E",
              fillOpacity: 1,
            }).addTo(map).bindPopup(`<b>${d.to}</b><br/>${d.date} · ${d.km} km`);
            layersRef.current.push(mk);
          });
        }
      }

      if (allLatLngs.length > 0 && !cancelled) {
        map.fitBounds(L.latLngBounds(allLatLngs).pad(0.12));
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [teamLabel, mapReady]);

  return (
    <div style={{ color: "white", padding: "1.5rem 1.5rem 6rem", maxWidth: 500, margin: "0 auto" }}>
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

      <div
        id="route-map"
        style={{ height: "42vh", minHeight: 280, width: "100%", borderRadius: 12, overflow: "hidden", marginBottom: "0.6rem", background: "#1a1a2e" }}
      />
      <p style={{ color: "#8b949e", fontSize: "0.75rem", marginBottom: "1rem" }}>
        Napauta merkkiä nähdäksesi levähdyspaikan. Värillinen viiva = päivän reitti.
      </p>

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
                <p style={{ fontSize: "1rem", marginBottom: d.hotel || d.note || d.routeUrl ? 4 : 0 }}>📏 {d.km} km</p>
                {d.hotel && <p style={{ fontSize: "1rem", marginBottom: d.note || d.routeUrl ? 4 : 0 }}>🏨 {d.hotel}</p>}
                {d.note && <p style={{ fontSize: "0.95rem", color: "#cfcfe6", marginBottom: d.routeUrl ? 4 : 0 }}>{d.note}</p>}
                {d.routeUrl && (
                  <a href={d.routeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", color: "#3b82f6", fontSize: "0.95rem", fontWeight: 600, marginTop: 2 }}>
                    📲 Avaa pyöräreitti · lataa GPX →
                  </a>
                )}
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
