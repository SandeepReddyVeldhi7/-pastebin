import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

export async function GET() {
  try {
    await redis.ping();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
 