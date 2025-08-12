import { AppSidebarClient } from "@/components/app-sidebar-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">Jobbly</span>
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem></SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">dasdas</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
