import { TabSwitcher } from "@/frontend/components/tab-switcher";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Shortener-Paste</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Shorten links & share text instantly :)</p>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <TabSwitcher />
        </div>
      </div>
    </main>
  );
}
