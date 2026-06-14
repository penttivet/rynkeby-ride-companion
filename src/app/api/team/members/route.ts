import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet...




async function redisGet(key: string) {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function redisSet(key: string, value: any) {
  await fetch(`${REDIS_URL}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  if (!teamId) return NextResponse.json({ error: "teamId required" }, { status: 400 });
  try {
    const members = await redisGet(`rynkeby:team:${teamId}`) || [];
    return NextResponse.json({ members });
  } catch (e) {
    return NextResponse.json({ members: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { teamId, member } = await req.json();
    if (!teamId || !member) return NextResponse.json({ error: "Missing data" }, { status: 400 });
    const members = await redisGet(`rynkeby:team:${teamId}`) || [];
    members.push(member);
    await redisSet(`rynkeby:team:${teamId}`, members);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { teamId, memberId } = await req.json();
    if (!teamId || !memberId) return NextResponse.json({ error: "Missing data" }, { status: 400 });
    const members = await redisGet(`rynkeby:team:${teamId}`) || [];
    const filtered = members.filter((m: any) => m.id !== memberId);
    await redisSet(`rynkeby:team:${teamId}`, filtered);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
