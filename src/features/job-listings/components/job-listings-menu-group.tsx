"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { JobListingStatus, JobListingTable } from "@/drizzle/schema";
import { useParams } from "next/navigation";
import { formatJobListingStatus } from "../lib/formatters";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface JobListing
  extends Pick<typeof JobListingTable.$inferSelect, "title" | "id"> {
  applicationCount: number;
}

type Props = {
  jobListings: JobListing[];
  status: JobListingStatus;
};

const JobListingMenuGroup: React.FC<Props> = ({ jobListings, status }) => {
  // const { jobId } = useParams();

  // verify job listing exists
  // const jobListing = jobListings.find((listing) => listing.id === jobId);

  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={status !== "delisted"}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {formatJobListingStatus(status)}
              <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {jobListings.map((listing) => (
                <JobListingMenuItem key={listing.id} listing={listing} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
};

function JobListingMenuItem({ listing }: { listing: JobListing }) {
  const { jobId } = useParams();
  const isActive = jobId === listing.id;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={isActive} asChild>
        <Link href={`/employer/job-listings/${listing.id}`}>
          <span className="truncate">{listing.title}</span>
        </Link>
      </SidebarMenuSubButton>
      {listing.applicationCount > 0 ? (
        <div className="absolute right-2 top-1/2 -translate-1/2 text-sm text-muted-foreground">
          {listing.applicationCount}
        </div>
      ) : null}
    </SidebarMenuSubItem>
  );
}

export { JobListingMenuGroup };
