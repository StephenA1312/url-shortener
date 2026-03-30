"use client";

import { useState } from "react";
import { PasteResultCard } from "./paste-result-card";

interface PasteResult {
  slug: string;
  pasteUrl: string;
  viewOnce: boolean;
  createdAt: string;
}

export function PasteForm() {
  const [content, setContent] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [viewOnce, setViewOnce] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<PasteResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
            required
            rows={8}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          {showAdvanced ? "- Hide" : "+ Show"} options
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
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg px-6 py-3 transition-colors"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {result && <PasteResultCard result={result} />}
    </div>
  );
}
