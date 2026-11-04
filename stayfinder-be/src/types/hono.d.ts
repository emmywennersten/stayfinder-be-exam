import type { User } from "@supabase/supabase-js";
import type { AppSupabaseClient } from "../lib/supabase.js";

declare module "hono" {
  interface ContextVariableMap {
    supabase: AppSupabaseClient;
    user: User | null;
  }
}