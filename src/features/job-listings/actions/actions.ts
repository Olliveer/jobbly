"use server";

import z from "zod";
import { JobListingFormSchema } from "./schemas";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { redirect } from "next/navigation";
import { insertJobListing } from "../db/job-listings";

export async function createJobListing(
  unsafeData: z.infer<typeof JobListingFormSchema>
) {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
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
