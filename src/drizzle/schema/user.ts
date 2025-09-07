import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";

export const UserTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  email: text("email").notNull().unique(),
  createdAt,
  updatedAt,
});

export type User = typeof UserTable.$inferSelect;
