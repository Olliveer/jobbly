import { auth } from "@clerk/nextjs/server";

type UserPermission =
  | "org:applicant_permissions:applicant_change_rating"
  | "org:applicant_permissions:applicant_change_stage"
  | "org:job_listing_manager:job_listing_change_status"
  | "org:job_listing_manager:job_listings_create"
  | "org:job_listing_manager:job_listings_delete"
  | "org:job_listing_manager:job_listings_update";

export async function hasOrgPermission(permission: UserPermission) {
  const { has } = await auth();

  return has({ permission });
}
