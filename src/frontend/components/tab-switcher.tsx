"use client";

import { useState, useRef, useId } from "react";
import { ShortenForm } from "./shorten-form";
import { PasteForm } from "./paste-form";

const TABS = [
  { key: "shorten" as const, label: "Shorten URL" },
  { key: "paste" as const, label: "Pastebin" },
];

export function TabSwitcher() {
  const [tab, setTab] = useState<"shorten" | "paste">("shorten");
  const [visible, setVisible] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabListId = useId();

  function switchTab(next: "shorten" | "paste") {
    if (next === tab) return;
    setVisible(false);
    setTimeout(() => {
      setTab(next);
      setVisible(true);
    }, 120);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const idx = TABS.findIndex((t) => t.key === tab);
    let next: number;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (idx + 1) % TABS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (idx - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = TABS.length - 1;
    } else {
      return;
    }

    switchTab(TABS[next].key);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="relative flex bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1"
        onKeyDown={handleKeyDown}
      >
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-white dark:bg-zinc-700 rounded-md transition-transform duration-200 ease-in-out shadow-sm dark:shadow-none"
          style={{ transform: tab === "paste" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
        />
        {TABS.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`${tabListId}-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`${tabListId}-panel`}
            tabIndex={tab === t.key ? 0 : -1}
            onClick={() => switchTab(t.key)}
            className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              tab === t.key ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${tabListId}-panel`}
        aria-labelledby={`${tabListId}-${tab}`}
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
