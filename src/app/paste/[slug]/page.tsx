import { notFound } from "next/navigation";
import { findPasteBySlug } from "@/backend/lib/pastes";
import Link from "next/link";
import { CopyButton } from "@/frontend/components/copy-button";
import { PasteReveal } from "@/frontend/components/paste-reveal";

export const dynamic = "force-dynamic";

export default async function PastePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paste = findPasteBySlug(slug);

  if (!paste) notFound();

  const hasBeenViewed = paste.viewOnce && paste.viewed;
  if (hasBeenViewed) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4">
          <div className="text-5xl">&#128065;</div>
          <h1 className="text-2xl font-bold">This paste has been viewed</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
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

  const awaitsReveal = paste.viewOnce && !paste.viewed;

  return (
    <main className="flex-1 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            &larr; Back
          </Link>
          <div className="flex items-center gap-3">
            {paste.viewOnce && (
              <span className="text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full">
                View once
              </span>
            )}
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {new Date(paste.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">/{slug}</span>
            {!awaitsReveal && <CopyButton text={paste.content} />}
          </div>
          {awaitsReveal ? (
            <PasteReveal slug={slug} />
          ) : (
            <pre className="p-4 text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
              {paste.content}
            </pre>
          )}
        </div>

        {paste.viewOnce && (
          <p className="text-center text-xs text-red-600 dark:text-red-400">
            This paste will not be available after you leave this page.
          </p>
        )}
      </div>
    </main>
  );
}
