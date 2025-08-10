import { pgTable, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const UserResumeTable = pgTable("user_resume", {
  userId: varchar("user_id").references(() => UserTable.id),
  resumeFileUrl: varchar("resume_file_url").notNull(),
  resumeFileKey: varchar("resume_file_key").notNull(),
  aiSummary: varchar("ai_summary"),
  createdAt,
  updatedAt,
});

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.userId],
    references: [UserTable.id],
  }),
}));
