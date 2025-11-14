import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import { z } from "zod";

export const JobListingFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    experienceLevel: z.enum(experienceLevels),
    locationRequirement: z.enum(locationRequirements),
    type: z.enum(jobListingTypes),
    wage: z.number().int().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
    stateAbbreviation: z
      .string()
      .transform((value) => (value.trim() === "" ? null : value.toUpperCase()))
      .nullable(),
    city: z
      .string()
      .transform((value) => (value.trim() === "" ? null : value.toUpperCase()))
      .nullable(),
  })
  .refine(
    (listing) => {
      return listing.locationRequirement === "remote" || listing.city !== null;
    },
    {
      message: "City is required if location requirement is not remote",
      path: ["city"],
    },
  )
  .refine(
    (listing) => {
      return (
        listing.locationRequirement === "remote" ||
        listing.stateAbbreviation !== null
      );
    },
    {
      message: "State is required if location requirement is not remote",
      path: ["stateAbbreviation"],
    },
  );
