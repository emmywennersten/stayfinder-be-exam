"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth";
import type { FieldErrors } from "@/types/api";
import FieldError from "./FieldError";
import T from "./typography";
import { buttonClassName, fieldClassName } from "./ui";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError(undefined);
    setFieldErrors({});
    setPending(true);

    const result = isLogin
      ? await auth.login(email, password)
      : await auth.register(email, password);

    setPending(false);

    if (result.error) {
      setError(result.error);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-sm flex-col gap-4">
      <T.Header size="lg">{isLogin ? "Log in" : "Create account"}</T.Header>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input name="email" type="email" autoComplete="email" className={fieldClassName} />
        <FieldError message={fieldErrors.email} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          className={fieldClassName}
        />
        <FieldError message={fieldErrors.password} />
      </label>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
      </button>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {isLogin ? "No account yet? " : "Already have an account? "}
        <Link href={isLogin ? "/auth/register" : "/auth/login"} className="underline">
          {isLogin ? "Create one" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
