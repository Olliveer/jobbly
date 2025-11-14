import { searchParamsSchema } from "@/components/job-listing-items";
import { db } from "@/drizzle/db";
import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema";
import { and, desc, eq, SQL, or, ilike } from "drizzle-orm";
import { z } from "zod";

export async function getJobListings({
  jobId,
  searchParam,
}: {
  jobId?: string;
  searchParam?: z.infer<typeof searchParamsSchema>;
}) {
  "use cache";
  const whereClause: (SQL | undefined)[] = [];

  if (searchParam?.title) {
    whereClause.push(ilike(JobListingTable.title, `%${searchParam.title}%`));
  }

  if (searchParam?.locationRequirements) {
    whereClause.push(
      eq(JobListingTable.locationRequirement, searchParam.locationRequirements),
    );
  }

  if (searchParam?.city) {
    whereClause.push(ilike(JobListingTable.city, `%${searchParam.city}%`));
  }

  if (searchParam?.state) {
    whereClause.push(
      ilike(JobListingTable.stateAbbreviation, `%${searchParam.state}%`),
    );
  }

  if (searchParam?.type) {
    whereClause.push(eq(JobListingTable.type, searchParam.type));
  }

  if (searchParam?.jobIds) {
    whereClause.push(
      or(...searchParam.jobIds.map((id) => eq(JobListingTable.id, id))),
    );
  }

  return db.query.JobListingTable.findMany({
    where: or(
      jobId
        ? and(
            eq(JobListingTable.status, "published"),
            eq(JobListingTable.id, jobId),
          )
        : undefined,
      and(eq(JobListingTable.status, "published"), ...whereClause),
    ),
    with: {
      organization: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [desc(JobListingTable.isFeatured), desc(JobListingTable.postedAt)],
  });
}

export async function getMostReccentJobListing({ orgId }: { orgId: string }) {
  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert,
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
      eq(JobListingTable.organizationId, orgId),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function getJobListing(id: string) {
  "use cache";
  return await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function update(
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>,
) {
  const [updatedListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  // revalidateJobListingCache(newListing)

  return updatedListing;
}

// TODO: not working
export async function deleteJobListingDb(id: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  // revalidateJobListingCache(newListing)

  return deletedJobListing;
}

export async function getJobListingApplication({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}) {
  "use cache";

  return await db.query.JobListingApplicationTable.findFirst({
    where: and(
      eq(JobListingApplicationTable.jobListingId, jobId),
      eq(JobListingApplicationTable.userId, userId),
    ),
    with: {
      jobListing: {
        columns: {
          id: true,
          title: true,
          description: true,
          status: true,
          organizationId: true,
        },
      },
    },
  });
}
