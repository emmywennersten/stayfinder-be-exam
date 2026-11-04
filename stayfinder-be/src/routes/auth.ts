import { Hono } from "hono";

import { authValidator } from "../validators/authValidator.js";
import { requireAuth } from "../middleware/auth.js";

const auth = new Hono({ strict: false });

auth.post("/register", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return c.json({ error: error?.message ?? "Could not create account" }, 400);
  }

  return c.json({ user: { id: data.user.id, email: data.user.email } }, 201);
});

auth.post("/login", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return c.json({ error: "Wrong email or password" }, 401);
  }

  return c.json({ user: { id: data.user.id, email: data.user.email } }, 200);
});

auth.post("/logout", requireAuth, async (c) => {
  const supabase = c.get("supabase");
  const { error } = await supabase.auth.signOut();

  if (error) {
    return c.json({ error: "Could not log out" }, 500);
  }

  return c.json({ message: "Logged out" }, 200);
});

auth.get("/me", requireAuth, (c) => {
  const user = c.get("user")!;
  return c.json({ user: { id: user.id, email: user.email } }, 200);
});

export default auth;