import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
  createFinalSchema(shape) {
    return z.object(shape).transform((val) => {
      const { DATABASE_URL, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET, ...rest } =
        val;

      return {
        ...rest,
        DATABASE_URL: DATABASE_URL,
        CLERK_SECRET_KEY: CLERK_SECRET_KEY,
        CLERK_WEBHOOK_SECRET: CLERK_WEBHOOK_SECRET,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
