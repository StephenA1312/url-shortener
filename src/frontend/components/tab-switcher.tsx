"use client";

import { useState } from "react";
import { ShortenForm } from "./shorten-form";
import { PasteForm } from "./paste-form";

export function TabSwitcher() {
  const [tab, setTab] = useState<"shorten" | "paste">("shorten");
  const [visible, setVisible] = useState(true);

  function switchTab(next: "shorten" | "paste") {
    if (next === tab) return;
    setVisible(false);
    setTimeout(() => {
      setTab(next);
      setVisible(true);
    }, 120);
  }

  return (
    <div className="space-y-6">
      <div className="relative flex bg-zinc-800 rounded-lg p-1">
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-zinc-700 rounded-md transition-transform duration-200 ease-in-out"
          style={{ transform: tab === "paste" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
        />
        <button
          onClick={() => switchTab("shorten")}
          className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
            tab === "shorten" ? "text-white" : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Shorten URL
        </button>
        <button
          onClick={() => switchTab("paste")}
          className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
            tab === "paste" ? "text-white" : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Pastebin
        </button>
      </div>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 120ms ease, transform 120ms ease",
        }}
      >
        {tab === "shorten" ? <ShortenForm /> : <PasteForm />}
      </div>
    </div>
  );
}
