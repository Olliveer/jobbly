import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function upsertUserResume(
  userId: string,
  data: Omit<typeof UserResumeTable.$inferInsert, "userId">,
) {
  // revalidate cache
  await db
    .insert(UserResumeTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: UserResumeTable.userId,
      set: data,
    });
}

export async function getUserResumeFileKey(userId: string) {
  const resume = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      resumeFileKey: true,
    },
  });

  if (!resume) return null;

  return resume.resumeFileKey;
}
