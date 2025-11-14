import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignUpButton } from "@/services/clerk/components/auth-buttons";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { getJobListingApplication } from "../db/job-listings";
import { connection } from "next/server";
import { differenceInDays } from "date-fns";
import { getUserResume } from "@/features/job-listing-applications/actions/actions";
import Link from "next/link";
import { NewJobListingApplicationForm } from "@/features/job-listing-applications/components/new-job-listing-application-form";

async function ApplyButton({ jobListingId }: { jobListingId: string }) {
  const { userId } = await getCurrentUser({});

  if (!userId) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to create an account before applying for a job.
          <SignUpButton />
        </PopoverContent>
      </Popover>
    );
  }

  const application = await getJobListingApplication({
    jobId: jobListingId,
    userId,
  });

  if (application != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      style: "short",
      numeric: "always",
    });

    await connection();
    const difference = differenceInDays(application.createdAt, new Date());

    return (
      <div className="text-muted-foreground text-sm">
        You applied for this job{" "}
        {difference === 0 ? "today" : formatter.format(difference, "days")}
      </div>
    );
  }

  const userResume = await getUserResume({ userId });
  if (!userResume) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to upload your resume before applying for a job.
          <Button asChild>
            <Link href="/user-settings/resume">Upload Resume</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something you can only do
            once per job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ApplyButton };
