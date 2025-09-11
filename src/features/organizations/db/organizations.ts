import { db } from "@/drizzle/db";
import { OrganizationTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getOrganization(id: string) {
  // ENABLE when nextjs supports it, for now its only in experimental
  //   "use cache";
  //  cache tag(getUserByIdTag(id));
  return await db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  });
}

export async function insertOrganization(
  organization: typeof OrganizationTable.$inferInsert
) {
  await db.insert(OrganizationTable).values(organization).onConflictDoNothing();
  //   revalidateOrganizationCache(user.id);
}

export async function updateOrganization(
  id: string,
  organization: Partial<typeof OrganizationTable.$inferInsert>
) {
  await db
    .update(OrganizationTable)
    .set(organization)
    .where(eq(OrganizationTable.id, id));
}

export async function deleteOrganization(id: string) {
  await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
}
