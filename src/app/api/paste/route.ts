import { NextRequest, NextResponse } from "next/server";
import { createPaste } from "@/backend/lib/pastes";
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
    const { content, customSlug, viewOnce } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    if (content.length > 100000) {
      return NextResponse.json(
        { error: "Content is too large (max 100KB)." },
        { status: 400 }
      );
    }

    const paste = createPaste(
      content,
      customSlug || undefined,
      viewOnce || false
    );
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return NextResponse.json({
      slug: paste.slug,
      pasteUrl: `${baseUrl}/paste/${paste.slug}`,
      viewOnce: paste.viewOnce,
      createdAt: paste.createdAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    const status = message.includes("already taken") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
