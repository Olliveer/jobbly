import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function insertUser(user: typeof UserTable.$inferInsert) {
  await db.insert(UserTable).values(user).onConflictDoNothing();
  //   revalidateUserCache(user.id);
}

export async function updateUser(
  id: string,
  user: Partial<typeof UserTable.$inferInsert>
) {
  await db.update(UserTable).set(user).where(eq(UserTable.id, id));
}

export async function deleteUser(id: string) {
  return await db.delete(UserTable).where(eq(UserTable.id, id));
}

export async function getUser(id: string) {
  // ENABLE when nextjs supports it, for now its only in experimental
  //   "use cache";
  //  cache tag(getUserByIdTag(id));
  return await db.query.UserTable.findFirst({ where: eq(UserTable.id, id) });
}
