// Visas automatiskt av Next.js medan en sida hämtar data (G13).
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-6 py-10">
      <p className="text-zinc-500">Loading stays…</p>
      <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
    </main>
  );
}
