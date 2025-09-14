export default async function JobListingPage({
  params,
}: {
  params: {
    jobId: string;
  };
}) {
  const { jobId } = await params;

  return <div>Job Listing {jobId}</div>;
}
