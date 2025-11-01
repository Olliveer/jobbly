import { SidebarUserButton } from "@/features/users/sidebar-user-button";
import { AppSidebar } from "@/components/sidebar/app-side-bar";
import SidebarNavMenuGroup from "@/components/sidebar/sidebar-nav-menu-group";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogInIcon,
} from "lucide-react";

export default function JobSeekerLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                label: "Job Board",
                href: "/",
                icon: <ClipboardListIcon />,
              },
              {
                label: "AI Search",
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
              },
              {
                label: "Employer Dashboard",
                href: "/employer",
                icon: <LayoutDashboardIcon />,
                authState: "signed-in",
              },
              {
                label: "Sign In",
                href: "/sign-in",
                icon: <LogInIcon />,
                authState: "signed-out",
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
