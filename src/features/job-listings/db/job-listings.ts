import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getMostReccentJobListing({ orgId }: { orgId: string }) {
  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

export async function insertJobListing(
  data: typeof JobListingTable.$inferInsert
) {
  const [jobListing] = await db.insert(JobListingTable).values(data).returning({
    id: JobListingTable.id,
    organizationId: JobListingTable.organizationId,
  });

  return jobListing;
}
