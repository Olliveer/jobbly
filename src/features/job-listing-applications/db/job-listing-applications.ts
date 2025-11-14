"use server";

import { and, eq } from "drizzle-orm";
import {
  JobListingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export async function insertJobListingApplication(
  data: typeof JobListingApplicationTable.$inferInsert,
) {
  await db.insert(JobListingApplicationTable).values(data);
}

export async function getPublicJobListing({ id }: { id: string }) {
  // "use cache";

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    columns: {
      id: true,
    },
  });
}

export async function getUserResume({ userId }: { userId: string }) {
  // "use cache";

  return await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      userId: true,
    },
  });
}
