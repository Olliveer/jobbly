import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export async function insertUserNotificationSettings(
  userNotificationSettings: typeof UserNotificationSettingsTable.$inferInsert
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values(userNotificationSettings)
    .onConflictDoNothing();
}
