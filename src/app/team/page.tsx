"use client";
import { useState, useEffect, useRef } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  photo?: string;
}

interface Team {
  id: string;
  name: string;
  emoji: string;
  password: string;
}

const TEAMS: Team[] = [
  { id: "media", name: "Media Team", emoji: "🎥", password: "media2026" },
  { id: "oulu", name: "Team Oulu", emoji: "🚴", password: "oulu2026" },
  { id: "jarvi-suomi", name: "Team Järvi-Suomi", emoji: "🚴", password: "jarvi2026" },
  { id: "espoo", name: "Team Espoo", emoji: "🚴", password: "espoo2026" },
  { id: "vantaa", name: "Team Vantaa", emoji: "🚴", password: "vantaa2026" },
  { id: "turku", name: "Team Turku", emoji: "🚴", password: "turku2026" },
  { id: "hame", name: "Team Häme", emoji: "🚴", password: "hame2026" },
  { id: "support", name: "Support Team", emoji: "🚗", password: "support2026" },
];

function MemberCard({ member, canDelete, onDelete }: { member: TeamMember; canDelete: boolean; onDelete: (id: string) => void }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "0.85rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(200,16,46,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>🚴</div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{member.name}</p>
        <p style={{ color: "#8b949e", fontSize: "0.78rem", margin: "2px 0 0" }}>{member.role}</p>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
        {member.phone && (
          <>
            <a href={`tel:${member.phone}`} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(200,16,46,0.15)", border: "1px solid rgba(200,16,46,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", textDecoration: "none" }}>📞</a>
            <a href={`https://wa.me/${member.phone.replace(/\s+/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", textDecoration: "none" }}>🟢</a>
          </>
        )}
        {canDelete && (
          <button onClick={() => onDelete(member.id)} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,71,87,0.15)", border: "1px solid rgba(255,71,87,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", cursor: "pointer", color: "#ff4757" }}>🗑️</button>
        )}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) fetchMembers();
  }, [open]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/team/members?teamId=${team.id}`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch { }
    setLoading(false);
  };

  const handleLogin = () => {
    if (password === team.password) {
      setLoggedIn(true);
      setShowLogin(false);
      setPwError("");
    } else {
      setPwError("Wrong password");
    }
  };

  const handleAddMember = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newName.trim(),
        role: newRole.trim() || "Team Member",
        phone: newPhone.trim() || undefined,
      };
      await fetch("/api/team/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, member }),
      });
      setMembers(prev => [...prev, member]);
      setNewName(""); setNewRole(""); setNewPhone("");
      setShowAdd(false);
    } catch { }
    setSaving(false);
  };

  const handleDelete = async (memberId: string) => {
    try {
      await fetch("/api/team/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, memberId }),
      });
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch { }
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${open ? "rgba(200,16,46,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "1rem", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.4rem" }}>{team.emoji}</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>{team.name}</p>
            <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: 0 }}>{members.length > 0 ? `${members.length} member${members.length !== 1 ? "s" : ""}` : "No members yet"}</p>
          </div>
        </div>
        <span style={{ color: "#8b949e", fontSize: "1.2rem" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {loading ? (
            <p style={{ color: "#8b949e", textAlign: "center", fontSize: "0.85rem" }}>Loading...</p>
          ) : members.length > 0 ? (
            members.map(m => <MemberCard key={m.id} member={m} canDelete={loggedIn} onDelete={handleDelete} />)
          ) : (
            <div style={{ padding: "1rem", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
              <p style={{ color: "#8b949e", fontSize: "0.85rem", margin: 0 }}>No members yet 🚴</p>
            </div>
          )}

          {!loggedIn && !showLogin && (
            <button onClick={() => setShowLogin(true)} style={{ marginTop: "0.5rem", padding: "8px", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 10, background: "transparent", color: "#8b949e", cursor: "pointer", fontSize: "0.8rem" }}>
              🔒 Team login to add members
            </button>
          )}

          {showLogin && !loggedIn && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Team password" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.9rem" }} />
              {pwError && <p style={{ color: "#ff4757", fontSize: "0.8rem", margin: 0 }}>{pwError}</p>}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleLogin} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#C8102E", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>Login</button>
                <button onClick={() => { setShowLogin(false); setPwError(""); setPassword(""); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#8b949e", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
              </div>
            </div>
          )}

          {loggedIn && !showAdd && (
            <button onClick={() => setShowAdd(true)} style={{ marginTop: "0.5rem", padding: "10px", border: "1px dashed rgba(200,16,46,0.4)", borderRadius: 10, background: "rgba(200,16,46,0.05)", color: "#C8102E", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
              + Add Member
            </button>
          )}

          {loggedIn && showAdd && (
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <p style={{ color: "#fff", fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>Add Member</p>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name *" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.9rem" }} />
              <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Role (e.g. Cyclist)" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.9rem" }} />
              <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone (e.g. +358401234567)" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.9rem" }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleAddMember} disabled={saving || !newName.trim()} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#C8102E", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : "Add"}</button>
                <button onClick={() => setShowAdd(false)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#8b949e", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", paddingBottom: "80px", background: "#0d1117", fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: 1 }}>🚴 THE TEAMS</h1>
        <p style={{ color: "#8b949e", fontSize: "0.75rem", margin: "2px 0 0" }}>Team Rynkeby Finland — ~300 cyclists · 8 teams</p>
      </div>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {TEAMS.map(team => <TeamCard key={team.id} team={team} />)}
      </div>
    </div>
  );
}
