"use client";

import { useState } from "react";

interface PasteResultCardProps {
  result: {
    slug: string;
    pasteUrl: string;
    viewOnce: boolean;
  };
}

export function PasteResultCard({ result }: PasteResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result.pasteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-xl p-5 space-y-3">
      <p className="text-sm text-zinc-400">Your paste link</p>
      <div className="flex items-center gap-3">
        <code className="text-lg font-mono text-blue-400 flex-1 truncate">
          {result.pasteUrl}
        </code>
        <button
          onClick={copyToClipboard}
          className="shrink-0 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {result.viewOnce && (
        <p className="text-xs text-red-400">
          This paste will be deleted after being viewed once.
        </p>
      )}
    </div>
  );
}
