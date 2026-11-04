"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth";

const linkClassName =
  "text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white";

// Navigeringen visar olika innehåll för inloggad och utloggad (G3).
export default function AuthHeader() {
  const auth = useAuth();
  const router = useRouter();

  async function onLogout() {
    await auth.logout();
    router.push("/");
    router.refresh();
  }

  if (auth.isPending) {
    return <span className="text-sm text-zinc-500">Loading…</span>;
  }

  if (!auth.user) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/auth/login" className={linkClassName}>
          Log in
        </Link>
        <Link href="/auth/register" className={linkClassName}>
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/host/properties/new" className={linkClassName}>
        List a stay
      </Link>
      <span className="text-sm text-zinc-500">{auth.user.email}</span>
      <button type="button" onClick={onLogout} className={linkClassName}>
        Log out
      </button>
    </nav>
  );
}
