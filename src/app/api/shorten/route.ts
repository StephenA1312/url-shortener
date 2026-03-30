import { NextRequest, NextResponse } from "next/server";
import { createLink } from "@/backend/lib/links";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customCode, expiresAt } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required." },
        { status: 400 }
      );
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
