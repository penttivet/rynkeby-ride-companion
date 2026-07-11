import { NextRequest, NextResponse } from "next/server";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const TEAM_NAMES: Record<string, string> = {
  media: "Media Team",
  oulu: "Team Oulu",
  "jarvi-suomi": "Team Järvi-Suomi",
  espoo: "Team Espoo",
  vantaa: "Team Vantaa",
  turku: "Team Turku",
  hame: "Team Häme",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function redisCommand(command: string[]) {
  const res = await fetch(`${REDIS_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = await res.json();
  return data.result;
}

async function redisScanKeys(pattern: string) {
  let cursor = "0";
  const keys: string[] = [];
  do {
    const result = await redisCommand(["SCAN", cursor, "MATCH", pattern]);
    cursor = result[0];
    keys.push(...result[1]);
  } while (cursor !== "0");
  return keys;
}

// GET: kaikki tallennetut jakolinkit (esim. Find My / WhatsApp live-sijainti)
export async function GET() {
  try {
    const keys = await redisScanKeys("rynkeby:findmy:*");
    const links = [];

    for (const key of keys) {
      const raw = await redisCommand(["GET", key]);
      if (!raw) continue;
      let parsed;
      try {
        parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        continue;
      }
      links.push({
        ...parsed,
        teamName: TEAM_NAMES[parsed.teamId] || parsed.teamId,
      });
    }

    // Uusimmat ensin
    links.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    return NextResponse.json({ links });
  } catch (err) {
    return NextResponse.json({ links: [], error: String(err) }, { status: 500 });
  }
}

// POST: tallenna/päivitä oma jakolinkki
export async function POST(req: NextRequest) {
  try {
    const { teamId, name, url } = await req.json();
    if (!teamId || !name || !url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const slug = slugify(name);
    if (!slug) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    const value = JSON.stringify({ teamId, name, url, updatedAt: Date.now() });
    await redisCommand(["SET", `rynkeby:findmy:${teamId}:${slug}`, value]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE: poista oma jakolinkki
export async function DELETE(req: NextRequest) {
  try {
    const { teamId, name } = await req.json();
    if (!teamId || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const slug = slugify(name);
    await redisCommand(["DEL", `rynkeby:findmy:${teamId}:${slug}`]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
