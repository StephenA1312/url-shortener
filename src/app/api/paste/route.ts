import { NextRequest, NextResponse } from "next/server";
import { createPaste } from "@/backend/lib/pastes";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
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

    const { env } = getCloudflareContext();
    const paste = await createPaste(
      env.URL_STORE,
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
