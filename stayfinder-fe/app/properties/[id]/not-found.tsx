import Link from "next/link";

import T from "@/components/typography";

export default function PropertyNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-10">
      <T.Header size="lg">This stay doesn’t exist</T.Header>
      <p className="text-zinc-600 dark:text-zinc-400">
        It may have been removed, or the link is wrong.
      </p>
      <Link href="/" className="text-sm font-medium underline">
        Back to all stays
      </Link>
    </main>
  );
}
