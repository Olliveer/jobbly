import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getMostReccentJobListing({ orgId }: { orgId: string }) {
  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  // revalidateJobListingCache(newListing)

  return newListing;
}

export async function getJobListingById(id: string, orgId: string) {
  return await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}
