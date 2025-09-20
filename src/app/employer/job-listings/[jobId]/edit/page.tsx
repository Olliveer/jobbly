import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/job-listings/components/job-listing-form";
import { getJobListingById } from "@/features/job-listings/db/job-listings";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ jobId: string }>;
};

export default async function EditJobListingPage(props: Props) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
      <p className="text-muted-foreground mb-6">
        This does not post the listing yet. It just saves a draft.
      </p>

      <Card>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <SuspendedPage {...props} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedPage(props: Props) {
  const { jobId } = await props.params;
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
    return notFound();
  }

  const jobListing = await getJobListingById(jobId, orgId);

  if (!jobListing) {
    return notFound();
  }

  return <JobListingForm jobListing={jobListing} />;
}
