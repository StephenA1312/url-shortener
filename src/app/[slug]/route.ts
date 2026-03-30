import { NextRequest, NextResponse } from "next/server";
import { findByCode, isExpired, recordClick } from "@/backend/lib/links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = findByCode(slug);

  if (!link) {
    return new NextResponse("Link not found.", { status: 404 });
  }

  if (isExpired(link)) {
    return NextResponse.redirect(
      new URL(`/expired?code=${slug}`, request.url),
      302
    );
  }

  const referrer = request.headers.get("referer") || null;
  const userAgent = request.headers.get("user-agent") || null;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  recordClick(link.id, referrer, userAgent, ip);

  return NextResponse.redirect(link.originalUrl, 302);
}
