import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { findPasteBySlug } from "@/backend/lib/pastes";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const slug =
    typeof body === "object" && body !== null && typeof body.slug === "string"
      ? body.slug
      : null;

  if (!slug) {
    return NextResponse.json(
      { error: "Paste slug is required." },
      { status: 400 }
    );
  }

  const { env } = getCloudflareContext();
  const paste = await findPasteBySlug(env.URL_STORE, slug);

  if (!paste) {
    return NextResponse.json({ error: "Paste not found." }, { status: 404 });
  }

  if (!paste.viewOnce) {
    return NextResponse.json(
      { error: "This paste is not marked as view-once." },
      { status: 400 }
    );
  }

  if (paste.viewed) {
    return NextResponse.json(
      { error: "This paste has already been viewed." },
      { status: 410 }
    );
  }

  // Mark as viewed. KV read-modify-write is not atomic; for a single-user
  // personal tool the race window is negligible.
  paste.viewed = true;
  await env.URL_STORE.put(`paste:${slug}`, JSON.stringify(paste));

  return NextResponse.json({ content: paste.content });
}
