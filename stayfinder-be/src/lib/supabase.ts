import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createServerClient } from "@supabase/ssr";

import { env } from "../env.js";
import type { Database } from "../types/database.types.js";

export function createSupabaseForRequest(c: Context) {
  return createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      getAll() {
        const cookies = getCookie(c);
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            path: "/",
            httpOnly: true,
            sameSite: "Lax",
            secure: env.isProduction,
            maxAge: options.maxAge,
            expires: options.expires,
          });
        });
      },
    },
  });
}
export type AppSupabaseClient = ReturnType<typeof createSupabaseForRequest>;