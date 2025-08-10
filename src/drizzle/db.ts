import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/data/env/server";
import * as schema from "@/drizzle/schema";

export const db = drizzle(env.DATABASE_URL, {
  schema,
});
