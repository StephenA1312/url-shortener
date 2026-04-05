"use client";

import { useState } from "react";
import Link from "next/link";

interface ResultCardProps {
  result: {
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    expiresAt: string | null;
  };
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-5 space-y-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Your short link</p>
      <div className="flex items-center gap-3">
        <code className="text-lg font-mono text-blue-500 flex-1 truncate">
          {result.shortUrl}
        </code>
        <button
          onClick={copyToClipboard}
          className="shrink-0 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <Link
          href={`/stats/${result.shortCode}`}
          className="shrink-0 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Stats
        </Link>
      </div>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 truncate">
        &rarr; {result.originalUrl}
      </p>
      {result.expiresAt && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Expires: {new Date(result.expiresAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
