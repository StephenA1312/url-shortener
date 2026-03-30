"use client";

import { useState } from "react";
import { ShortenForm } from "./shorten-form";
import { PasteForm } from "./paste-form";

export function TabSwitcher() {
  const [tab, setTab] = useState<"shorten" | "paste">("shorten");

  return (
    <div className="space-y-6">
      <div className="flex bg-zinc-800 rounded-lg p-1">
        <button
          onClick={() => setTab("shorten")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "shorten"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Shorten URL
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "paste"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Pastebin
        </button>
      </div>

      {tab === "shorten" ? <ShortenForm /> : <PasteForm />}
    </div>
  );
}
