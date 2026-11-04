import type { Context, Next } from "hono";

import { createSupabaseForRequest } from "../lib/supabase.js";

export async function optionalAuth(c: Context, next: Next) {
  const supabase = createSupabaseForRequest(c);
  c.set("supabase", supabase);

  const { data, error } = await supabase.auth.getUser();
  c.set("user", error ? null : data.user);

  await next();
}

export async function requireAuth(c: Context, next: Next) {
  if (!c.get("user")) {
    return c.json({ error: "You must be logged in" }, 401);
  }

  await next();
}