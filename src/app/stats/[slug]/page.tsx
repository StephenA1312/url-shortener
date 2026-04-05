import { notFound } from "next/navigation";
import { getStats, isExpired } from "@/backend/lib/links";
import Link from "next/link";

export const dynamic = "force-dynamic";

function maskIp(ip: string | null): string {
  if (!ip) return "-";
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
  }
  return ip.replace(/:[\da-f]+$/i, ":*");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function truncateUserAgent(ua: string | null): string {
  if (!ua) return "-";
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|Arc)\/[\d.]+/);
  return match ? match[0] : ua.slice(0, 30) + (ua.length > 30 ? "..." : "");
}

export default async function StatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stats = getStats(slug);

  if (!stats) notFound();

  const { link, recentClicks, referrerStats } = stats;
  const expired = isExpired(link);
  const maxReferrerCount = referrerStats.length > 0 ? referrerStats[0].count : 1;

  return (
    <main className="flex-1 px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            &larr; Back
          </Link>
        </div>

        {expired && (
          <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-yellow-700 dark:text-yellow-300 text-sm">
            This link has expired and no longer redirects.
          </div>
        )}

        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-mono">/{link.shortCode}</h1>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline break-all"
          >
            {link.originalUrl}
          </a>
          <div className="flex gap-4 text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
            {link.expiresAt && (
              <span>
                Expires: {new Date(link.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-5xl font-bold">{link.clickCount.toLocaleString()}</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Total Clicks</p>
        </div>

        {referrerStats.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Top Referrers</h2>
            <div className="space-y-3">
              {referrerStats.map((r, i) => {
                const label = r.referrer || "Direct";
                const pct = (r.count / maxReferrerCount) * 100;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-700 dark:text-zinc-300 truncate">{label}</span>
                      <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-2">
                        {r.count}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recentClicks.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Recent Clicks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-400 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4">Referrer</th>
                    <th className="pb-2 pr-4">Browser</th>
                    <th className="pb-2">IP</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-700 dark:text-zinc-300">
                  {recentClicks.map((click) => (
                    <tr
                      key={click.id}
                      className="border-b border-zinc-200/50 dark:border-zinc-800/50 last:border-0"
                    >
                      <td className="py-2 pr-4 text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {timeAgo(click.clickedAt)}
                      </td>
                      <td className="py-2 pr-4 truncate max-w-[150px]">
                        {click.referrer || "Direct"}
                      </td>
                      <td className="py-2 pr-4 truncate max-w-[150px]">
                        {truncateUserAgent(click.userAgent)}
                      </td>
                      <td className="py-2 text-zinc-400 dark:text-zinc-500">
                        {maskIp(click.ipAddress)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {recentClicks.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-500 text-sm">No clicks yet.</p>
        )}
      </div>
    </main>
  );
}
