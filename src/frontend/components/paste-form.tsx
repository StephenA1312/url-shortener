"use client";

import { useEffect, useRef, useState } from "react";
import { PasteResultCard } from "./paste-result-card";

interface PasteResult {
  slug: string;
  pasteUrl: string;
  viewOnce: boolean;
  createdAt: string;
}

export function PasteForm() {
  const [content, setContent] = useState("");
  const [autoCopied, setAutoCopied] = useState(false);
  const autoCopyTimer = useRef<number | null>(null);
  const [customSlug, setCustomSlug] = useState("");
  const [viewOnce, setViewOnce] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<PasteResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAutoCopied(false);
    setResult(null);
    setLoading(true);

    try {
      const body: Record<string, string | boolean> = { content };
      if (customSlug) body.customSlug = customSlug;
      if (viewOnce) body.viewOnce = true;

      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
      setContent("");
      setCustomSlug("");
      setViewOnce(false);
      await copyLink(data.pasteUrl);
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (autoCopyTimer.current) window.clearTimeout(autoCopyTimer.current);
      setAutoCopied(true);
      autoCopyTimer.current = window.setTimeout(() => setAutoCopied(false), 2000);
    } catch {
      setAutoCopied(false);
    }
  }

  useEffect(() => {
    return () => {
      if (autoCopyTimer.current) window.clearTimeout(autoCopyTimer.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text here..."
              required
              rows={8}
              maxLength={100000}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
            />
            <span className={`absolute bottom-2 right-3 text-xs tabular-nums ${content.length > 90000 ? 'text-red-400' : 'text-zinc-500'}`}>
              {(content.length / 1024).toFixed(1)} KB / 100 KB
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? "Hide" : "Show"} options
        </button>

        {showAdvanced && (
          <div className="space-y-3 pl-4 border-l-2 border-zinc-800">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Custom slug
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="my-paste"
                pattern="[a-zA-Z0-9\-]{3,32}"
                title="3-32 characters, letters, numbers, and hyphens only"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={viewOnce}
                onChange={(e) => setViewOnce(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 accent-blue-500"
              />
              <div>
                <span className="text-sm text-zinc-300">View once</span>
                <p className="text-xs text-zinc-500">
                  Content is deleted after being viewed
                </p>
              </div>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg px-6 py-3 transition-colors"
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {result && (
        <>
          <PasteResultCard result={result} />
          {autoCopied && (
            <p className="text-xs text-green-400">Link copied to clipboard.</p>
          )}
        </>
      )}
    </div>
  );
}
