import { generateShortCode } from "./short-code";
import { validateUrl } from "./url-validation";
import type { LinkRecord, ClickRecord, StatsResult, ReferrerStat } from "@/backend/types";

const RESERVED_CODES = ["api", "stats", "expired", "paste", "_next", "favicon.ico"];

export async function createLink(
  urlStore: KVNamespace,
  url: string,
  customCode?: string,
  expiresAt?: string
): Promise<LinkRecord> {
  const shortCode = customCode || generateShortCode();

  if (RESERVED_CODES.includes(shortCode)) {
    throw new Error("This short code is reserved.");
  }

  if (customCode && !/^[a-zA-Z0-9-]{3,32}$/.test(customCode)) {
    throw new Error(
      "Custom code must be 3-32 characters, alphanumeric or hyphens only."
    );
  }

  const urlError = validateUrl(url);
  if (urlError) {
    throw new Error(urlError);
  }

  const existing = await urlStore.get(`link:${shortCode}`);
  if (existing) {
    throw new Error("This short code is already taken.");
  }

  const record: LinkRecord = {
    shortCode,
    originalUrl: url,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || null,
    clickCount: 0,
  };

  await urlStore.put(`link:${shortCode}`, JSON.stringify(record));
  return record;
}

export async function findByCode(
  urlStore: KVNamespace,
  code: string
): Promise<LinkRecord | null> {
  return urlStore.get<LinkRecord>(`link:${code}`, "json");
}

export function isExpired(link: { expiresAt: string | null }): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt) < new Date();
}

export async function recordClick(
  urlStore: KVNamespace,
  clickStore: KVNamespace,
  shortCode: string,
  referrer: string | null,
  userAgent: string | null,
  ipAddress: string | null
): Promise<void> {
  const newClick: ClickRecord = {
    clickedAt: new Date().toISOString(),
    referrer,
    userAgent,
    ipAddress,
  };

  const [existingClicks, link] = await Promise.all([
    clickStore.get<ClickRecord[]>(`clicks:${shortCode}`, "json"),
    urlStore.get<LinkRecord>(`link:${shortCode}`, "json"),
  ]);

  const clicks = [newClick, ...(existingClicks || [])].slice(0, 1000);
  const tasks: Promise<void>[] = [
    clickStore.put(`clicks:${shortCode}`, JSON.stringify(clicks)),
  ];

  if (link) {
    link.clickCount += 1;
    tasks.push(urlStore.put(`link:${shortCode}`, JSON.stringify(link)));
  }

  await Promise.all(tasks);
}

export async function getStats(
  urlStore: KVNamespace,
  clickStore: KVNamespace,
  code: string
): Promise<StatsResult | null> {
  const [link, allClicks] = await Promise.all([
    urlStore.get<LinkRecord>(`link:${code}`, "json"),
    clickStore.get<ClickRecord[]>(`clicks:${code}`, "json"),
  ]);

  if (!link) return null;

  const clicks = allClicks || [];
  const recentClicks = clicks.slice(0, 50);

  const counts = new Map<string | null, number>();
  for (const c of clicks) {
    counts.set(c.referrer, (counts.get(c.referrer) || 0) + 1);
  }
  const referrerStats: ReferrerStat[] = Array.from(counts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { link, recentClicks, referrerStats };
}
