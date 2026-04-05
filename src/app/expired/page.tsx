import Link from "next/link";

export default async function ExpiredPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4">
        <div className="text-5xl">&#9203;</div>
        <h1 className="text-2xl font-bold">Link Expired</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
          The short link{" "}
          {code && (
            <code className="text-zinc-700 dark:text-zinc-300 font-mono">/{code}</code>
          )}{" "}
          has expired and is no longer available.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          Create a new link
        </Link>
      </div>
    </main>
  );
}
