import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key: string) {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.result) return null;
  try {
    return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: unknown) {
  await fetch(`${REDIS_URL}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(value)),
    cache: 'no-store',
  });
}

async function redisKeys(pattern: string): Promise<string[]> {
  const res = await fetch(`${REDIS_URL}/keys/${pattern}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return data.result || [];
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

// GET - fetch all active car locations
export async function GET() {
  try {
    const keys = await redisKeys("rynkeby:location:*");
    const locations = await Promise.all(
      keys.map(async (key) => {
        const data = await redisGet(key);
        if (!data) return null;
        const teamId = key.replace("rynkeby:location:", "");
        return {
          teamId,
          teamName: TEAM_NAMES[teamId] || teamId,
          lat: data.lat,
          lng: data.lng,
          updatedAt: data.updatedAt,
        };
      })
    );
    const active = locations.filter(Boolean).filter(loc => {
      if (!loc) return false;
      const age = Date.now() - new Date(loc.updatedAt).getTime();
      return age < 5 * 60 * 1000; // only show locations updated in last 5 minutes
    });
    return NextResponse.json({ locations: active });
  } catch {
    return NextResponse.json({ locations: [] });
  }
}

// POST - update car location
export async function POST(req: NextRequest) {
  try {
    const { teamId, lat, lng } = await req.json();
    if (!teamId || !lat || !lng) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    await redisSet(`rynkeby:location:${teamId}`, {
      lat,
      lng,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE - stop tracking
export async function DELETE(req: NextRequest) {
  try {
    const { teamId } = await req.json();
    await fetch(`${REDIS_URL}/del/rynkeby:location:${teamId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
