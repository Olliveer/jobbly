import { createdAt, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const UserNotificationSettingsTable = pgTable(
  "user_notification_settings",
  {
    userId: varchar("user_id").references(() => UserTable.id),
    newEmailNotifications: boolean("new_email_notifications")
      .notNull()
      .default(false),
    aiPrompt: varchar("ai_prompt"),
    createdAt,
    updatedAt,
  }
);
