import { db } from "@/backend/db";
import { links, clicks } from "@/backend/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateShortCode } from "./short-code";

const RESERVED_CODES = ["api", "stats", "expired", "paste", "_next", "favicon.ico"];

export function createLink(
  url: string,
  customCode?: string,
  expiresAt?: string
) {
  const shortCode = customCode || generateShortCode();

  if (RESERVED_CODES.includes(shortCode)) {
    throw new Error("This short code is reserved.");
  }

  if (customCode && !/^[a-zA-Z0-9-]{3,32}$/.test(customCode)) {
    throw new Error(
      "Custom code must be 3-32 characters, alphanumeric or hyphens only."
    );
  }

  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("URL must use http or https protocol.");
  }

  const existing = db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .get();

  if (existing) {
    throw new Error("This short code is already taken.");
  }

  const result = db
    .insert(links)
    .values({
      originalUrl: url,
      shortCode,
      expiresAt: expiresAt || null,
    })
    .returning()
    .get();

  return result;
}

export function findByCode(code: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .get();
}

export function isExpired(link: { expiresAt: string | null }) {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}

export function recordClick(
  linkId: number,
  referrer: string | null,
  userAgent: string | null,
  ipAddress: string | null
) {
  db.update(links)
    .set({ clickCount: sql`${links.clickCount} + 1` })
    .where(eq(links.id, linkId))
    .run();

  db.insert(clicks)
    .values({ linkId, referrer, userAgent, ipAddress })
    .run();
}

export function getStats(code: string) {
  const link = db
    .select()
    .from(links)
    .where(eq(links.shortCode, code))
    .get();

  if (!link) return null;

  const recentClicks = db
    .select()
    .from(clicks)
    .where(eq(clicks.linkId, link.id))
    .orderBy(desc(clicks.clickedAt))
    .limit(50)
    .all();

  const referrerStats = db
    .select({
      referrer: clicks.referrer,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(clicks)
    .where(eq(clicks.linkId, link.id))
    .groupBy(clicks.referrer)
    .orderBy(desc(sql`count(*)`))
    .limit(10)
    .all();

  return { link, recentClicks, referrerStats };
}
