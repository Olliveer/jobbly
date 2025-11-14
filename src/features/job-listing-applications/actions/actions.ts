"use server";

import { newApplicationSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { z } from "zod";
import {
  getPublicJobListing,
  insertJobListingApplication,
} from "../db/job-listing-applications";
import { inngest } from "@/services/inngest/client";
import { UserResumeTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";

export async function createJobListingApplication({
  jobId,
  content,
}: {
  jobId: string;
  content: z.infer<typeof newApplicationSchema>;
}) {
  const permissionError = {
    error: true,
    message: "You are not authorized to create a job listing application.",
  };

  const { userId } = await getCurrentUser({});

  if (!userId) {
    return permissionError;
  }

  const [userResume, jobListing] = await Promise.all([
    getUserResume({ userId }),
    getPublicJobListing({ id: jobId }),
  ]);

  if (!userResume || !jobListing) {
    return permissionError;
  }

  const { success, data } = newApplicationSchema.safeParse(content);

  if (!success) {
    return {
      error: true,
      message: "Invalid application content.",
    };
  }

  await insertJobListingApplication({
    userId,
    jobListingId: jobId,
    ...data,
  });

  // todo: AI GENERATION inngest
  // await inngest.send({
  //   name: "app/job-application.created",
  //   data: {
  //     userId,
  //     jobId,
  //   },
  // });

  return {
    error: false,
    message: "Job listing application created successfully.",
  };
}

export async function getUserResume({ userId }: { userId: string }) {
  return await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}
