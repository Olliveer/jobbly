import {
  pgTable,
  integer,
  text,
  varchar,
  pgEnum,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt, id } from "../schemaHelpers";
import { OrganizationTable } from "./organizations";
import { relations } from "drizzle-orm";
import { JobListingApplicationTable } from "./job-listing-application";

export const wageIntervals = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;
export type WageInterval = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listing_wage_interval",
  wageIntervals
);

export const locationRequirements = ["in-office", "remote", "hybrid"] as const;
export type LocationRequirement = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements
);

export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  experienceLevels
);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export type JobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listing_status",
  jobListingStatuses
);

export const jobListingTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
] as const;
export type JobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listing_type", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id,

    organizationId: varchar()
      .references(() => OrganizationTable.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    wage: integer("wage"),
    wageInterval: wageIntervalEnum("wage_interval"),
    stateAbbreviation: varchar("state_abbreviation"),
    city: varchar("city"),
    isFeatured: boolean("is_featured").notNull().default(false),
    locationRequirement: locationRequirementEnum(
      "location_requirement"
    ).notNull(),
    experienceLevel: experienceLevelEnum("experience_level").notNull(),
    status: jobListingStatusEnum("status").notNull().default("draft"),
    type: jobListingTypeEnum("type").notNull(),
    postedAt: timestamp("posted_at", { withTimezone: true }).defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.stateAbbreviation)]
);

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    organization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
  })
);
