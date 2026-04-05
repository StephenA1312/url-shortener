import { NextRequest, NextResponse } from "next/server";
import { createLink } from "@/backend/lib/links";
import { checkRateLimit } from "@/backend/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { url, customCode, expiresAt } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required." },
        { status: 400 }
      );
    }

    if (expiresAt) {
      const date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date." },
          { status: 400 }
        );
      }
      if (date <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future." },
          { status: 400 }
        );
      }
    }

    const link = createLink(url, customCode || undefined, expiresAt || undefined);
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return NextResponse.json({
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      originalUrl: link.originalUrl,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    const status = message.includes("already taken") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
