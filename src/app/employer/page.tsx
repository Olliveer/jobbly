import { getMostReccentJobListing } from "@/features/job-listings/db/job-listings";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function EmployerPage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
    return null;
  }

  const jobListings = await getMostReccentJobListing({ orgId });

  if (!jobListings) {
    redirect("/employer/job-listings/new");
  } else {
    redirect(`/employer/job-listings/${jobListings.id}`);
  }

  return <div>SuspendedPage</div>;
}
