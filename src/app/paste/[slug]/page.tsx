import { notFound } from "next/navigation";
import { findPasteBySlug, markPasteViewed } from "@/backend/lib/pastes";
import Link from "next/link";
import { CopyButton } from "@/frontend/components/copy-button";

export const dynamic = "force-dynamic";

export default async function PastePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paste = findPasteBySlug(slug);

  if (!paste) notFound();

  if (paste.viewOnce && paste.viewed) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4">
          <div className="text-5xl">&#128065;</div>
          <h1 className="text-2xl font-bold">This paste has been viewed</h1>
          <p className="text-zinc-400 max-w-sm">
            This was a view-once paste and has already been read. The content is
            no longer available.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Create a new paste
          </Link>
        </div>
      </main>
    );
  }

  // Mark as viewed if view-once
  if (paste.viewOnce) {
    markPasteViewed(paste.id);
  }

  return (
    <main className="flex-1 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            &larr; Back
          </Link>
          <div className="flex items-center gap-3">
            {paste.viewOnce && (
              <span className="text-xs bg-red-950/50 border border-red-900 text-red-400 px-2.5 py-1 rounded-full">
                View once
              </span>
            )}
            <span className="text-xs text-zinc-500">
              {new Date(paste.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
            <span className="text-sm text-zinc-400 font-mono">/{slug}</span>
            <CopyButton text={paste.content} />
          </div>
          <pre className="p-4 text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
            {paste.content}
          </pre>
        </div>

        {paste.viewOnce && (
          <p className="text-center text-xs text-red-400">
            This paste will be deleted after you leave this page.
          </p>
        )}
      </div>
    </main>
  );
}
