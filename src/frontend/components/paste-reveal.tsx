"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

type RevealStatus = "idle" | "loading" | "ready" | "error";

export function PasteReveal({ slug }: { slug: string }) {
  const [status, setStatus] = useState<RevealStatus>("idle");
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReveal() {
    if (status === "loading") return;
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/paste/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Unable to reveal the paste.");
      }
      setContent(data.content ?? null);
      setStatus("ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStatus("error");
    }
  }

  return (
    <div className="p-4 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
      {content ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Reveal ready
            </span>
            <CopyButton text={content} />
          </div>
          <pre className="p-2 bg-zinc-100 dark:bg-black/30 rounded-md overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
            {content}
          </pre>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleReveal}
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2 transition-colors text-sm"
          >
            {status === "loading" ? "Revealing..." : "Reveal content"}
          </button>
          {status === "error" && error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
