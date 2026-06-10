"use client";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  phone?: string;
}

interface Team {
  id: string;
  name: string;
  emoji: string;
  color: string;
  members: TeamMember[];
}

const TEAMS: Team[] = [
  {
    id: "media",
    name: "Media Team",
    emoji: "🎥",
    color: "#C8102E",
    members: [
      { name: "Pentti Koivisto", role: "Media Team Johtaja", phone: "+358449712712" },
      { name: "Lea Koivisto", role: "Rynkeby Maajohtaja", phone: "+358405518159" },
    ],
  },
  {
    id: "oulu",
    name: "Team Oulu",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "jarvi-suomi",
    name: "Team Järvi-Suomi",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "espoo",
    name: "Team Espoo",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "vantaa",
    name: "Team Vantaa",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "turku",
    name: "Team Turku",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "hame",
    name: "Team Häme",
    emoji: "🚴",
    color: "#3b82f6",
    members: [],
  },
  {
    id: "support",
    name: "Support Team",
    emoji: "🚗",
    color: "#10b981",
    members: [],
  },
];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "0.85rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{member.name}</p>
        <p style={{ color: "#8b949e", fontSize: "0.78rem", margin: "2px 0 0" }}>{member.role}</p>
      </div>
      {member.phone && (
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <a
            href={`tel:${member.phone}`}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(200,16,46,0.15)",
              border: "1px solid rgba(200,16,46,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", textDecoration: "none",
            }}
          >📞</a>
          <a
            href={`sms:${member.phone}`}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", textDecoration: "none",
            }}
          >💬</a>
          <a
            href={`https://wa.me/${member.phone.replace(/\s+/g, "").replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(37,211,102,0.15)",
              border: "1px solid rgba(37,211,102,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", textDecoration: "none",
            }}
          >🟢</a>
        </div>
      )}
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  const [open, setOpen] = useState(team.id === "media");

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${open ? "rgba(200,16,46,0.25)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 14,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1rem",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.4rem" }}>{team.emoji}</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>{team.name}</p>
            <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: 0 }}>
              {team.members.length > 0 ? `${team.members.length} member${team.members.length !== 1 ? "s" : ""}` : "Coming soon"}
            </p>
          </div>
        </div>
        <span style={{ color: "#8b949e", fontSize: "1.2rem" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {team.members.length > 0 ? (
            team.members.map((m) => <MemberCard key={m.name} member={m} />)
          ) : (
            <div style={{
              padding: "1rem",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.1)",
              textAlign: "center",
            }}>
              <p style={{ color: "#8b949e", fontSize: "0.85rem", margin: 0 }}>
                Team members will be added soon 🚴
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100dvh",
      paddingBottom: "80px",
      background: "#0d1117",
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1rem 0.75rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: 1 }}>
          🚴 THE TEAMS
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: "2px 0 0" }}>
          Team Rynkeby Finland — ~300 cyclists · 8 teams
        </p>
      </div>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {TEAMS.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
