import { NextRequest, NextResponse } from "next/server";
import { findPasteBySlug, consumeViewOncePaste } from "@/backend/lib/pastes";

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

  const paste = findPasteBySlug(slug);
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

  const content = consumeViewOncePaste(paste.id);
  if (!content) {
    return NextResponse.json(
      { error: "This paste has already been viewed." },
      { status: 410 }
    );
  }

  return NextResponse.json({ content });
}
