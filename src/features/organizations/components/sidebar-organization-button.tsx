import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Suspense } from "react";
import { SignOutButton } from "@/services/clerk/components/auth-buttons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { SidebarOrganizationButtonClient } from "./sidebar-organization-button-client";
import { getCurrenOrganization } from "@/services/clerk/lib/get-current-organization";

export function SidebarOrganizationButton() {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
}

async function SidebarOrganizationSuspense() {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrenOrganization({ allData: true }),
  ]);

  if (!user || !organization) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return (
    <SidebarOrganizationButtonClient organization={organization} user={user} />
  );
}
