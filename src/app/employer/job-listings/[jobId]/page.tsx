import MarkdownPartial from "@/components/markdown/markdown-partial";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import { getJobListingById } from "@/features/job-listings/db/job-listings";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ jobId: string }>;
};

export default async function JobListingPage(props: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: Props) {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
    return null;
  }

  const { jobId } = await params;
  const jobListing = await getJobListingById(jobId, orgId);

  if (!jobListing) {
    return notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <Button variant="outline" asChild>
            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
              <EditIcon className="size-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
}
