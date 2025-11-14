import { IsBreakPoint } from "@/components/is-break-point";
import { JobListingItems } from "@/components/job-listing-items";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ClientSheet } from "../_client-sheet";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getJobListing } from "@/features/job-listings/db/job-listings";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { convertSearchParamsToString } from "@/lib/convert-search-params-to-string";
import { XIcon } from "lucide-react";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { ApplyButton } from "@/features/job-listings/components/apply-button";

function JobListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <>
      <ResizablePanelGroup autoSaveId="job-board-panel" direction="horizontal">
        <ResizablePanel id="left" order={1} defaultSize={60} minSize={30}>
          <div className="p-4 h-screen overflow-x-auto">
            <JobListingItems searchParams={searchParams} params={params} />
          </div>
        </ResizablePanel>
        <IsBreakPoint
          breakpoint="min-width: 1024px"
          otherwise={
            <ClientSheet>
              <SheetContent hideCloseButton className="p-4 overflow-y-auto">
                <SheetHeader className="sr-only">
                  <SheetTitle>Job Details</SheetTitle>
                </SheetHeader>
                <Suspense fallback={<Spinner className="size-16" />}>
                  <JobListingDetails
                    searchParams={searchParams}
                    params={params}
                  />
                </Suspense>
              </SheetContent>
            </ClientSheet>
          }
        >
          <ResizableHandle withHandle className="mx-2" />
          <ResizablePanel id="right" order={2} defaultSize={40} minSize={30}>
            <div className="p-4 h-screen overflow-y-auto">
              <Suspense fallback={<Spinner className="size-16" />}>
                <JobListingDetails
                  params={params}
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          </ResizablePanel>
        </IsBreakPoint>
      </ResizablePanelGroup>
    </>
  );
}

async function JobListingDetails({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { jobId } = await params;
  const jobListing = await getJobListing(jobId);
  if (jobListing == null) {
    return notFound();
  }

  const nameInitials = jobListing.organization.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <Avatar className="size-14 @max-md:hidden">
            <AvatarImage
              src={jobListing.organization.imageUrl ?? undefined}
              alt={jobListing.organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {jobListing.title}
            </h1>
            <div className="text-base text-muted-foreground">
              {jobListing.organization.name}
            </div>
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @min-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4">
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @max-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
            <Button size="icon" variant="outline" asChild>
              <Link
                href={`/?${convertSearchParamsToString(await searchParams)}`}
              >
                <span className="sr-only">Close</span>
                <XIcon />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <JobListingBadges jobListing={jobListing} />
        </div>
        <Suspense fallback={<Button disabled>Apply</Button>}>
          <ApplyButton jobListingId={jobListing.id} />
        </Suspense>
      </div>

      <MarkdownRenderer source={jobListing.description} />
    </div>
  );
}

export default JobListingPage;
