import { AppSidebar } from "@/components/sidebar/app-side-bar";
import SidebarNavMenuGroup from "@/components/sidebar/sidebar-nav-menu-group";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarOrganizationButton } from "@/features/organizations/components/sidebar-organization-button";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";
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
            <SidebarGroupAction title="Add Job Listing" asChild>
              <Link href="/employer/job-listings/new">
                <PlusIcon />
                <span className="sr-only">Add Job Listing</span>
              </Link>
            </SidebarGroupAction>
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
