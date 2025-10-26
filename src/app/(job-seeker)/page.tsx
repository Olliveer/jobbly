import { JobListingItems } from "@/components/job-listing-items";

export default function JobSeekerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <div className="m-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  );
}
