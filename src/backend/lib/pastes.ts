import { generateShortCode } from "./short-code";
import type { PasteRecord } from "@/backend/types";

const RESERVED_CODES = ["api", "stats", "expired", "paste", "_next", "favicon.ico"];

export async function createPaste(
  urlStore: KVNamespace,
  content: string,
  customSlug?: string,
  viewOnce?: boolean
): Promise<PasteRecord> {
  const slug = customSlug || generateShortCode();

  if (RESERVED_CODES.includes(slug)) {
    throw new Error("This slug is reserved.");
  }

  if (customSlug && !/^[a-zA-Z0-9-]{3,32}$/.test(customSlug)) {
    throw new Error(
      "Custom slug must be 3-32 characters, alphanumeric or hyphens only."
    );
  }

  const [existingPaste, existingLink] = await Promise.all([
    urlStore.get(`paste:${slug}`),
    urlStore.get(`link:${slug}`),
  ]);

  if (existingPaste) {
    throw new Error("This slug is already taken.");
  }
  if (existingLink) {
    throw new Error("This slug is already taken by a short link.");
  }

  const record: PasteRecord = {
    slug,
    content,
    createdAt: new Date().toISOString(),
    viewOnce: viewOnce || false,
    viewed: false,
  };

  await urlStore.put(`paste:${slug}`, JSON.stringify(record));
  return record;
}

export async function findPasteBySlug(
  urlStore: KVNamespace,
  slug: string
): Promise<PasteRecord | null> {
  return urlStore.get<PasteRecord>(`paste:${slug}`, "json");
}
