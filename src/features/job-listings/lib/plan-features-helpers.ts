import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { getPublishedJobListingsCount } from "../actions/actions";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";

export async function hasReachedMaxPublishedJobListings() {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
    return true;
  }

  const count = await getPublishedJobListingsCount(orgId);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
    hasPlanFeature("post_3_job_listings").then((has) => has && count < 3),
    hasPlanFeature("post_15_job_listings").then((has) => has && count < 15),
  ]);

  return !canPost.some(Boolean);
}
