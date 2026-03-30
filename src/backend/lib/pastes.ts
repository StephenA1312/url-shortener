import { db, sqlite } from "@/backend/db";
import { pastes } from "@/backend/db/schema";
import { links } from "@/backend/db/schema";
import { eq } from "drizzle-orm";
import { generateShortCode } from "./short-code";

const RESERVED_CODES = ["api", "stats", "expired", "paste", "_next", "favicon.ico"];

export function createPaste(
  content: string,
  customSlug?: string,
  viewOnce?: boolean
) {
  const slug = customSlug || generateShortCode();

  if (RESERVED_CODES.includes(slug)) {
    throw new Error("This slug is reserved.");
  }

  if (customSlug && !/^[a-zA-Z0-9-]{3,32}$/.test(customSlug)) {
    throw new Error(
      "Custom slug must be 3-32 characters, alphanumeric or hyphens only."
    );
  }

  // Check against existing pastes
  const existingPaste = db
    .select()
    .from(pastes)
    .where(eq(pastes.slug, slug))
    .get();

  if (existingPaste) {
    throw new Error("This slug is already taken.");
  }

  // Check against existing links too
  const existingLink = db
    .select()
    .from(links)
    .where(eq(links.shortCode, slug))
    .get();

  if (existingLink) {
    throw new Error("This slug is already taken by a short link.");
  }

  const result = db
    .insert(pastes)
    .values({
      slug,
      content,
      viewOnce: viewOnce || false,
    })
    .returning()
    .get();

  return result;
}

export function findPasteBySlug(slug: string) {
  return db
    .select()
    .from(pastes)
    .where(eq(pastes.slug, slug))
    .get();
}

/**
 * Atomically marks a view-once paste as viewed and returns the original content.
 * Uses raw SQL so the WHERE clause ensures only one request can "win".
 */
export function consumeViewOncePaste(id: number): string | null {
  const stmt = sqlite.prepare(
    `UPDATE pastes SET viewed = 1 WHERE id = ? AND viewed = 0 RETURNING content`
  );
  const row = stmt.get(id) as { content: string } | undefined;
  return row ? row.content : null;
}
