import { z } from "zod";

export const newApplicationSchema = z.object({
  coverLetter: z
    .string()
    .transform((value) => (value.trim() === "" ? null : value))
    .nullable(),
});
