import { auth } from "@clerk/nextjs/server";
import { getOrganization } from "@/features/organizations/db/organizations";

export async function getCurrenOrganization({
  allData = false,
}: {
  allData?: boolean;
}) {
  const { orgId } = await auth();

  if (orgId && allData) {
    const organization = await getOrganization(orgId);

    return {
      orgId,
      organization,
    };
  }

  return {
    orgId,
  };
}
