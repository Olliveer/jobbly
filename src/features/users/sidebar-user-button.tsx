import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Suspense } from "react";
import SidebarUserButtonClient from "./sidebar-user-button-client";
import { SignOutButton } from "@/services/clerk/components/auth-buttons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  if (!user) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return <SidebarUserButtonClient user={user} />;
}
