"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RideDay, ROUTES, TEAMS } from "@/lib/routes";

interface Weather {
  city: string;
  tempMax: number;
  tempMin: number;
  windKmh: number;
  precipProb: number;
  description: string;
  warnings: string[];
}

function describeWeather(code: number): string {
  if (code === 0) return "☀️ Selkeää";
  if (code <= 2) return "🌤️ Puolipilvistä";
  if (code === 3) return "☁️ Pilvistä";
  if (code <= 48) return "🌫️ Sumua";
  if (code <= 57) return "🌦️ Tihkua";
  if (code <= 67) return "🌧️ Sadetta";
  if (code <= 77) return "❄️ Lunta";
  if (code <= 82) return "🌧️ Sadekuuroja";
  if (code <= 86) return "❄️ Lumikuuroja";
  if (code <= 99) return "⛈️ Ukkosta";
  return "🌡️ Säätä";
}

function buildWarnings(windKmh: number, precipProb: number, tempMax: number, code: number): string[] {
  const w: string[] = [];
  if (windKmh >= 40) {
    w.push("💨 Kova tuuli (" + Math.round(windKmh) + " km/h) — varo sivutuulta, pidä linja.");
  } else if (windKmh >= 25) {
    w.push("🍃 Kohtalainen tuuli (" + Math.round(windKmh) + " km/h) — vastatuuli vie voimia.");
  }
  if (precipProb >= 60) {
    w.push("🌧️ Sade todennäköistä — ota sadevarusteet, tie voi olla liukas.");
  } else if (precipProb >= 30) {
    w.push("☔ Mahdollisia kuuroja — pakkaa kevyt takki.");
  }
  if (code >= 95) {
    w.push("⛈️ Ukkosriski — seuraa huoltoauton ohjeita.");
  }
  if (tempMax >= 30) {
    w.push("🥵 Kuuma päivä — juo runsaasti, varo lämpöä.");
  } else if (tempMax <= 8) {
    w.push("🥶 Kylmä päivä — pukeudu kerroksittain lähtöön.");
  }
  return w;
}

export default function TodayPage() {
  const today = new Date().toISOString().split("T")[0];

  const [teamLabel, setTeamLabel] = useState<string>(TEAMS[0].label);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(false);

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
  const rideDay = route.find((d) => d.date === today);

  function onSelectTeam(label: string) {
    setTeamLabel(label);
    try {
      localStorage.setItem("rynkeby_team", label);
    } catch {}
  }

  useEffect(() => {
    if (!rideDay) {
      setWeather(null);
      return;
    }
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(false);

    const params = new URLSearchParams({
      latitude: String(rideDay.lat),
      longitude: String(rideDay.lng),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
      timezone: "Europe/Paris",
      start_date: rideDay.date,
      end_date: rideDay.date,
    });
    const url = "https://api.open-meteo.com/v1/forecast?" + params.toString();

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("weather fetch failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const d = data.daily;
        if (!d || !d.time || d.time.length === 0) throw new Error("no data");
        const code = Array.isArray(d.weather_code) ? d.weather_code[0] : 0;
        const tempMax = Array.isArray(d.temperature_2m_max) ? d.temperature_2m_max[0] : 0;
        const tempMin = Array.isArray(d.temperature_2m_min) ? d.temperature_2m_min[0] : 0;
        const windKmh = Array.isArray(d.wind_speed_10m_max) ? d.wind_speed_10m_max[0] : 0;
        const precipProb = Array.isArray(d.precipitation_probability_max) ? d.precipitation_probability_max[0] : 0;
        setWeather({
          city: rideDay.to,
          tempMax: Math.round(tempMax),
          tempMin: Math.round(tempMin),
          windKmh: Math.round(windKmh),
          precipProb: precipProb,
          description: describeWeather(code),
          warnings: buildWarnings(windKmh, precipProb, tempMax, code),
        });
        setWeatherLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWeatherError(true);
        setWeatherLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [rideDay]);

  return (
    <div style={{ color: "white", padding: "1.5rem", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🏁 Tänään</h1>

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

      {rideDay ? (
        <>
          <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
            <p style={{ color: "#aaa", marginBottom: 8 }}>{rideDay.date}</p>
            <h2 style={{ fontSize: "1.4rem", marginBottom: 12 }}>{rideDay.day}</h2>
            {rideDay.prep ? (
              <>
                <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>📍 {rideDay.to}</p>
                {rideDay.note && <p style={{ fontSize: "1.05rem", marginBottom: 8, color: "#cfcfe6" }}>{rideDay.note}</p>}
                <p style={{ fontSize: "1.1rem" }}>🏨 {rideDay.hotel}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>🚴 {rideDay.from} → {rideDay.to}</p>
                <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>📏 {rideDay.km} km</p>
                <p style={{ fontSize: "1.1rem" }}>🏨 {rideDay.hotel}</p>
              </>
            )}
          </div>

          <div style={{ background: "#16213e", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 12 }}>🌤️ Sää — {rideDay.to}</h3>

            {weatherLoading && <p style={{ color: "#aaa" }}>Haetaan säätä…</p>}
            {weatherError && <p style={{ color: "#aaa" }}>Säätietoja ei juuri nyt saatavilla.</p>}

            {weather && !weatherLoading && !weatherError && (
              <>
                <p style={{ fontSize: "1.3rem", marginBottom: 8 }}>{weather.description}</p>
                <p style={{ fontSize: "1.1rem", marginBottom: 6 }}>🌡️ {weather.tempMax}° / {weather.tempMin}°</p>
                <p style={{ fontSize: "1.1rem", marginBottom: 6 }}>💨 Tuuli {weather.windKmh} km/h</p>
                <p style={{ fontSize: "1.1rem", marginBottom: weather.warnings.length > 0 ? 14 : 0 }}>
                  🌧️ Sateen todennäköisyys {weather.precipProb}%
                </p>

                {weather.warnings.length > 0 && (
                  <div style={{ background: "#2a1a1a", border: "1px solid #5a2a2a", borderRadius: 8, padding: "0.9rem", marginTop: 4 }}>
                    <p style={{ fontWeight: 600, marginBottom: 8, color: "#ffb3b3" }}>⚠️ Huomioi:</p>
                    {weather.warnings.map((warn, i) => (
                      <p key={i} style={{ fontSize: "1rem", marginBottom: i < weather.warnings.length - 1 ? 6 : 0 }}>
                        {warn}
                      </p>
                    ))}
                  </div>
                )}

                {weather.warnings.length === 0 && (
                  <p style={{ color: "#9be29b", marginTop: 4 }}>
                    ✅ {rideDay.prep ? "Hyvä sää!" : "Hyvät ajo-olosuhteet!"}
                  </p>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#aaa" }}>Ei ajopäivää tänään ({team.label}).</p>
          <p style={{ marginTop: 8 }}>Ajo alkaa 4.7.2026 Kielistä! 🚴‍♂️</p>
        </div>
      )}

      <Link
        href="/route"
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
        }}
      >
        🗺️ Näytä koko reitti →
      </Link>
    </div>
  );
}
