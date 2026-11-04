"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

import T from "@/components/typography";
import { buttonClassName } from "@/components/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Visas automatiskt av Next.js om en sida kastar ett fel, t.ex. om backend inte svarar (G13).
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();
  console.error(error);

  function onRetry() {
    //hämta datan från servern och rita om sidan. 
    startTransition(() => {
      router.refresh();
      reset();
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-10">
      <T.Header size="lg">Something went wrong</T.Header>
      <p className="text-zinc-600 dark:text-zinc-400">
        We couldn’t load the data. Check that the backend is running and try again.
      </p>
      <button type="button" onClick={reset} className={buttonClassName}>
        Try again
      </button>
    </main>
  );
}
