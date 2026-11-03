import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env.js";

const app = new Hono({ strict: false });

app.use(
  "*",
  cors({
    origin: env.frontendUrl,
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.get("/", (c) => {
  return c.json({ name: "StayFinder API" });
});

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});