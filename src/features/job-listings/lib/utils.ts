import { JobListingStatus } from "@/drizzle/schema";

export function getNextJobListingStatus(jobListingStatus: JobListingStatus) {
  switch (jobListingStatus) {
    case "draft":
    case "delisted":
      return "published";
    case "published":
      return "delisted";
    default:
      throw new Error(`Invalid job listing status: ${jobListingStatus}`);
  }
}

const JOB_LISTING_STATUS_SORT_ORDER: Record<JobListingStatus, number> = {
  draft: 0,
  published: 1,
  delisted: 2,
};

export function sortJobListingByStatus(
  a: JobListingStatus,
  b: JobListingStatus,
) {
  return JOB_LISTING_STATUS_SORT_ORDER[a] - JOB_LISTING_STATUS_SORT_ORDER[b];
}
