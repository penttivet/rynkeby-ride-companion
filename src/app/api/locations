import { NextRequest, NextResponse } from "next/server";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const TEAM_NAMES: Record<string, string> = {
  media: "Media Team",
  oulu: "Team Oulu",
  jarvisuomi: "Team Järvi-Suomi",
  espoo: "Team Espoo",
  vantaa: "Team Vantaa",
  turku: "Team Turku",
  tampere: "Team Tampere",
  helsinki: "Team Helsinki",
};

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

export async function GET() {
  try {
    const keys = await redisScanKeys("rynkeby:location:*");
    const now = Date.now();
    const locations = [];

    for (const key of keys) {
      const raw = await redisCommand(["GET", key]);
      if (!raw) continue;
      let parsed;
      try {
        parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        continue;
      }
      // Only include locations updated in the last 5 minutes
      if (now - parsed.timestamp > 5 * 60 * 1000) continue;

      const teamId = key.replace("rynkeby:location:", "");
      locations.push({
        teamId,
        teamName: TEAM_NAMES[teamId] || teamId,
        lat: parsed.lat,
        lng: parsed.lng,
        timestamp: parsed.timestamp,
      });
    }

    return NextResponse.json({ locations });
  } catch (err) {
    return NextResponse.json({ locations: [], error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { teamId, lat, lng } = await req.json();
    if (!teamId || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const value = JSON.stringify({ lat, lng, timestamp: Date.now() });
    await redisCommand(["SET", `rynkeby:location:${teamId}`, value]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { teamId } = await req.json();
    if (!teamId) {
      return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
    }
    await redisCommand(["DEL", `rynkeby:location:${teamId}`]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
