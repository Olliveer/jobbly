import { SidebarUserButton } from "@/components/features/users/sidebar-user-button";
import { AppSidebar } from "@/components/sidebar/app-side-bar";
import SidebarNavMenuGroup from "@/components/sidebar/sidebar-nav-menu-group";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedOut } from "@/services/clerk/components/sign-in-status";
import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
