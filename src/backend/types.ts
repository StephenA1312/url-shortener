export interface LinkRecord {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
}

export interface ClickRecord {
  clickedAt: string;
  referrer: string | null;
  userAgent: string | null;
  ipAddress: string | null;
}

export interface PasteRecord {
  slug: string;
  content: string;
  createdAt: string;
  viewOnce: boolean;
  viewed: boolean;
}

export interface ReferrerStat {
  referrer: string | null;
  count: number;
}

export interface StatsResult {
  link: LinkRecord;
  recentClicks: ClickRecord[];
  referrerStats: ReferrerStat[];
}
