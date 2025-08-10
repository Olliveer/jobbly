import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  createFinalSchema(shape) {
    return z.object(shape).transform((val) => {
      const { DATABASE_URL, ...rest } = val;

      return {
        ...rest,
        DATABASE_URL: DATABASE_URL,
      };
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
