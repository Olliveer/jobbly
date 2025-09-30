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

export async function createJobListing(
  unsafeData: z.infer<typeof JobListingFormSchema>,
) {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId || !(await hasOrgPermission("org:job_listings:create"))) {
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

  if (!orgId || !(await hasOrgPermission("org:job_listings:update"))) {
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
