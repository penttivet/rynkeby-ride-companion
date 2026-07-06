"use client";

import { SONGS } from "@/lib/songs";

function isVideoFile(filename: string) {
  return /\.(mp4|mov|webm|m4v)$/i.test(filename);
}

export default function LaulutPage() {
  return (
    <div className="page-container">
      <div className="mb-4 pt-2">
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "0.04em", lineHeight: 1 }}>
          🎵 LAULUT
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: "2px" }}>
          Matkan omat laulut ja niiden sanat
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {SONGS.map((song) => {
          const video = isVideoFile(song.audioFile);
          return (
            <div key={song.id} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#f0f6fc", margin: 0 }}>
                {song.title}
              </p>
              {song.performer && (
                <p style={{ color: "#8b949e", fontSize: "0.8rem", margin: "2px 0 10px" }}>{song.performer}</p>
              )}

              {video ? (
                <video
                  controls
                  playsInline
                  style={{ width: "100%", borderRadius: "10px", background: "#000", marginBottom: song.lyrics ? "12px" : 0 }}
                  src={`/songs/${song.audioFile}`}
                />
              ) : (
                <audio
                  controls
                  style={{ width: "100%", marginBottom: song.lyrics ? "12px" : 0 }}
                  src={`/songs/${song.audioFile}`}
                />
              )}

              {song.lyrics && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "0.85rem 1rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <p style={{ color: "#8b949e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    Sanat
                  </p>
                  <p style={{ color: "#f0f6fc", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-line", margin: 0 }}>
                    {song.lyrics}
                  </p>
                </div>
              )}

              {song.note && (
                <p style={{ color: "#8b949e", fontSize: "0.78rem", marginTop: "10px", fontStyle: "italic" }}>
                  {song.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

