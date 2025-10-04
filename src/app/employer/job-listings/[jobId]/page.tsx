import ActionButton from "@/components/action-button";
import { AsyncCan } from "@/components/async-can";
import MarkdownPartial from "@/components/markdown/markdown-partial";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { JobListingStatus } from "@/drizzle/schema";
import { toggleJobListingStatus } from "@/features/job-listings/actions/actions";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import { getJobListingById } from "@/features/job-listings/db/job-listings";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import { hasReachedMaxPublishedJobListings } from "@/features/job-listings/lib/plan-features-helpers";
import { getNextJobListingStatus } from "@/features/job-listings/lib/utils";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { hasOrgPermission } from "@/services/clerk/lib/orgUserPermissions";
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";

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
          <AsyncCan
            condition={() =>
              hasOrgPermission("org:job_listing_manager:job_listings_update")
            }
            loadingFallback={<Skeleton className="w-10 h-10" />}
          >
            <Button variant="outline" asChild>
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" /> Edit
              </Link>
            </Button>
          </AsyncCan>
          <StatusUpdateButton status={jobListing.status} id={jobListing.id} />
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

function StatusUpdateButton({
  status,
  id,
}: {
  status: JobListingStatus;
  id: string;
}) {
  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant="outline"
      areYouSureDescription="This will immediately publish your job listing. Are you sure?"
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  );
  return (
    <AsyncCan
      condition={() =>
        hasOrgPermission("org:job_listing_manager:job_listing_change_status")
      }
      loadingFallback={<Skeleton className="w-10 h-10" />}
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncCan
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();

            return !isMaxed;
          }}
          loadingFallback={<Skeleton className="w-10 h-10" />}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText=" You must upgrade your plan to publish more job listings."
            />
          }
        >
          {button}
        </AsyncCan>
      ) : (
        button
      )}
    </AsyncCan>
  );
}

function UpgradePopover({
  buttonText,
  popoverText,
}: {
  buttonText: ReactNode;
  popoverText: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {popoverText}
        <Button asChild size={"sm"}>
          <Link href="/employer/pricing">Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function statusToggleButtonText(status: JobListingStatus) {
  switch (status) {
    case "draft":
    case "delisted":
      return (
        <>
          <EyeIcon className="size-4" /> Publish
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" /> Delist
        </>
      );
    default:
      throw new Error(`Invalid job listing status: ${status}`);
  }
}
