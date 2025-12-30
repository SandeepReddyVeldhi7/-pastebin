import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/app/lib/redis";
import { now } from "@/app/lib/time";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json(
      { error: "Invalid ttl_seconds" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json(
      { error: "Invalid max_views" },
      { status: 400 }
    );
  }

  const id = nanoid(10);


  const createdAt = await now();
  const expiresAt =
    ttl_seconds !== undefined
      ? createdAt + ttl_seconds * 1000
      : null;

  const paste = {
    id,
    content,
    created_at_ms: createdAt,
    expires_at_ms: expiresAt,
    max_views: max_views ?? null,
    view_count: 0,
  };

  await redis.set(`paste:${id}`, JSON.stringify(paste));

  return NextResponse.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
