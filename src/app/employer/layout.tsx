import { AsyncCan } from "@/components/async-can";
import { AppSidebar } from "@/components/sidebar/app-side-bar";
import SidebarNavMenuGroup from "@/components/sidebar/sidebar-nav-menu-group";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { JobListingStatus } from "@/drizzle/schema";
import { getJobListings } from "@/features/job-listings/actions/actions";
import { JobListingMenuGroup } from "@/features/job-listings/components/job-listings-menu-group";
import { sortJobListingByStatus } from "@/features/job-listings/lib/utils";
import { SidebarOrganizationButton } from "@/features/organizations/components/sidebar-organization-button";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
import { hasOrgPermission } from "@/services/clerk/lib/orgUserPermissions";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
}

async function LayoutSuspense({ children }: { children: React.ReactNode }) {
  const { orgId } = await getCurrenOrganization({});

  if (!orgId) {
    return redirect("/organizations/select");
  }

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
            <AsyncCan
              condition={() =>
                hasOrgPermission("org:job_listing_manager:job_listings_create")
              }
            >
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href="/employer/job-listings/new">
                  <PlusIcon />
                  <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncCan>
            <SidebarContent className="group-data-[state=collapsed]:hidden">
              <JobListingMenu orgId={orgId} />
            </SidebarContent>
          </SidebarGroup>

          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                label: "Job Board",
                href: "/",
                icon: <ClipboardListIcon />,
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings({ orgId });

  if (
    jobListings.length === 0 &&
    (await hasOrgPermission("org:job_listing_manager:job_listings_create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon />
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }

  return Object.entries(
    Object.groupBy(jobListings, (listing) => listing.status),
  )
    .sort(([a], [b]) => {
      return sortJobListingByStatus(
        a as JobListingStatus,
        b as JobListingStatus,
      );
    })
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ));
}
