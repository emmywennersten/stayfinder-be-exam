"use client";

import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

import { useAuth } from "@/contexts/auth";

type AuthGateProps = PropsWithChildren<{
  message?: ReactNode;
}>;

// Visar innehållet bara för inloggade. Utloggade uppmanas att logga in (G9).
export default function AuthGate({
  children,
  message = "You have to be logged in to do this.",
}: AuthGateProps) {
  const auth = useAuth();

  if (auth.isPending) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  if (!auth.user) {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
        <p>{message}</p>
        <p>
          <Link href="/auth/login" className="font-medium underline">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/auth/register" className="font-medium underline">
            create an account
          </Link>
          .
        </p>
      </div>
    );
  }

  return children;
}
