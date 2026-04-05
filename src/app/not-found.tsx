import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4">
        <div className="text-5xl">404</div>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-zinc-400 max-w-sm">
          This link doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
