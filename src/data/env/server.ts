import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
  },
  createFinalSchema(shape) {
    return z.object(shape).transform((val) => {
      const { DATABASE_URL, CLERK_SECRET_KEY, ...rest } = val;

      return {
        ...rest,
        DATABASE_URL: DATABASE_URL,
        CLERK_SECRET_KEY: CLERK_SECRET_KEY,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
