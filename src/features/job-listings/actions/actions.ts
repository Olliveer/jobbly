"use server";

import z from "zod";
import { JobListingFormSchema } from "./schemas";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { redirect } from "next/navigation";
import {
  getJobListingById,
  insertJobListing,
  update,
} from "../db/job-listings";
import { hasOrgPermission } from "@/services/clerk/lib/orgUserPermissions";
import { db } from "@/drizzle/db";
import { and, count, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { getNextJobListingStatus } from "../lib/utils";
import { hasReachedMaxPublishedJobListings } from "../lib/plan-features-helpers";

export async function createJobListing(
  unsafeData: z.infer<typeof JobListingFormSchema>,
) {
  const { orgId } = await getCurrenOrganization({});

  if (
    !orgId ||
    !(await hasOrgPermission("org:job_listing_manager:job_listings_create"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = JobListingFormSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error creating the job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof JobListingFormSchema>,
) {
  const { orgId } = await getCurrenOrganization({});

  if (
    !orgId ||
    !(await hasOrgPermission("org:job_listing_manager:job_listings_update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = JobListingFormSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error creating the job listing",
    };
  }

  const jobListing = await getJobListingById(id, orgId);

  if (!jobListing) {
    return {
      error: true,
      message: "Job listing not found",
    };
  }

  const updatedJobListing = await update(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}

export async function getPublishedJobListingsCount(orgId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.status, "published"),
        eq(JobListingTable.organizationId, orgId),
      ),
    );

  return res.count ?? 0;
}

export async function toggleJobListingStatus(id: string) {
  const { orgId } = await getCurrenOrganization({});

  if (
    !orgId ||
    !(await hasOrgPermission(
      "org:job_listing_manager:job_listing_change_status",
    ))
  ) {
    return {
      error: true,
      message: "You don't have permission to update job listing status",
    };
  }

  const jobListing = await getJobListingById(id, orgId);

  if (!jobListing) {
    return {
      error: true,
      message: "Job listing not found",
    };
  }

  const newStatus = getNextJobListingStatus(jobListing.status);

  if (
    newStatus === "published" &&
    (await hasReachedMaxPublishedJobListings())
  ) {
    return {
      error: true,
      message: "You have reached the maximum number of featured job listings",
    };
  }

  const updatedJobListing = await update(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt === null
        ? new Date()
        : undefined,
  });

  return {
    error: false,
    message: "Job listing status updated successfully",
  };
}
