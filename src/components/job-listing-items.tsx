import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema";
import { getJobListings } from "@/features/job-listings/db/job-listings";
import { convertSearchParamsToString } from "@/lib/convert-search-params-to-string";
import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DaySince from "./days-since";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import { z } from "zod";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
  params?: Promise<{ jobId: string }>;
}

export const searchParamsSchema = z.object({
  title: z.string().min(1).optional().catch(undefined),
  city: z.string().min(1).optional().catch(undefined),
  state: z.string().min(1).optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirements: z
    .enum(locationRequirements)
    .optional()
    .catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional()
    .catch([]),
});

const JobListingItems: React.FC<Props> = async ({ params, searchParams }) => {
  const jobId = params ? (await params).jobId : undefined;

  const { success, data } = searchParamsSchema.safeParse(await searchParams);
  const search = success ? data : {};

  const jobListings = await getJobListings({
    jobId,
    searchParam: search,
  });

  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listings found</div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-4">
        {jobListings.map((jobListing) => (
          <Link
            key={jobListing.id}
            href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(search)}`}
            className="block"
          >
            <JobListingItem
              jobListing={jobListing}
              organization={jobListing.organization}
            />
          </Link>
        ))}
      </div>
    </Suspense>
  );
};

function JobListingItem({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "stateAbbreviation"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >;
  organization: Pick<
    typeof OrganizationTable.$inferSelect,
    "name" | "imageUrl"
  >;
}) {
  const nameInitials = organization.name
    .split("")
    .splice(0, 4)
    .map((char) => char[0])
    .join("");

  return (
    <Card
      className={cn(
        "@contaier",
        jobListing.isFeatured && "bg-featured/20 border-featured",
      )}
    >
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{jobListing.title}</CardTitle>
            <CardDescription className="text-base">
              {organization.name}
            </CardDescription>
          </div>
          {jobListing.postedAt !== null && (
            <div className="text-sm font-medium text-primary ml-auto ">
              <DaySince date={jobListing.postedAt} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-primary/35" : undefined}
        />
      </CardContent>
    </Card>
  );
}

export { JobListingItems };
