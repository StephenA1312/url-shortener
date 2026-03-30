import { ShortenForm } from "@/frontend/components/shorten-form";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">URL Shortener</h1>
          <p className="text-zinc-400">Shorten any link instantly</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <ShortenForm />
        </div>
      </div>
    </main>
  );
}
