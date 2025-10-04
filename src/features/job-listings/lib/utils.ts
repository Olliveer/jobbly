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
