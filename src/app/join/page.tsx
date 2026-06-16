"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TEAMS = [
  { id: "media", name: "Media Team", emoji: "🎥", password: "media2026" },
  { id: "oulu", name: "Team Oulu", emoji: "🚴", password: "oulu2026" },
  { id: "jarvi-suomi", name: "Team Järvi-Suomi", emoji: "🚴", password: "jarvi2026" },
  { id: "espoo", name: "Team Espoo", emoji: "🚴", password: "espoo2026" },
  { id: "vantaa", name: "Team Vantaa", emoji: "🚴", password: "vantaa2026" },
  { id: "turku", name: "Team Turku", emoji: "🚴", password: "turku2026" },
  { id: "hame", name: "Team Häme", emoji: "🚴", password: "hame2026" },
  { id: "support", name: "Support Team", emoji: "🚗", password: "support2026" },
];

function resizeImage(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file, 200);
    setPhoto(resized);
  };

  const handleJoin = async () => {
    if (!name.trim() || !selectedTeam || !password) {
      setError("Täytä kaikki kentät");
      return;
    }
    const team = TEAMS.find(t => t.id === selectedTeam);
    if (!team || password !== team.password) {
      setError("Väärä salasana");
      return;
    }
    setSaving(true);
    try {
      const member = {
        id: Date.now().toString(),
        name: name.trim(),
        role: "Cyclist",
        photo: photo || undefined,
      };
      await fetch("/api/team/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: selectedTeam, member }),
      });
      localStorage.setItem("rynkeby_user", JSON.stringify({ name: name.trim(), teamId: selectedTeam, memberId: member.id }));
      router.push("/team");
    } catch {
      setError("Virhe — yritä uudelleen");
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🚴</div>
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 900, margin: 0 }}>Rynkeby Finland</h1>
          <p style={{ color: "#8b949e", fontSize: "0.85rem", margin: "4px 0 0" }}>Liity omaan tiimiisi</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Koko nimesi *"
            style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem" }}
          />

          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "#1a1f2e", color: selectedTeam ? "#fff" : "#8b949e", fontSize: "1rem" }}
          >
            <option value="">Valitse tiimisi *</option>
            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
          </select>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Tiimin salasana *"
            style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem" }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {photo && <img src={photo} alt="preview" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />}
            <label style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.2)", color: "#8b949e", textAlign: "center", cursor: "pointer", fontSize: "0.85rem" }}>
              📷 {photo ? "Vaihda kuva" : "Lisää kuva (valinnainen)"}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
          </div>

          {error && <p style={{ color: "#ff4757", fontSize: "0.85rem", margin: 0 }}>{error}</p>}

          <button
            onClick={handleJoin}
            disabled={saving}
            style={{ padding: "14px", borderRadius: 10, border: "none", background: "#C8102E", color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1, marginTop: "0.5rem" }}
          >
            {saving ? "Liitytään..." : "Liity tiimiin 🚴"}
          </button>
        </div>
      </div>
    </div>
  );
}
