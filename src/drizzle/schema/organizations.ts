import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { JobListingTable } from "./job-listing";
import { OrganizationUserSettingsTable } from "./organization-user-settings";

export const OrganizationTable = pgTable("organizations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  createdAt,
  updatedAt,
});

export const organizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  })
);
