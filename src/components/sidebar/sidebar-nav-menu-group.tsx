"use client";

import { ReactNode } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  SignedIn,
  SignedOut,
} from "@/services/clerk/components/sign-in-status";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavMenuGroup({
  items,
  className,
}: {
  items: {
    label: string;
    href: string;
    icon: ReactNode;
    authState?: "signed-in" | "signed-out";
  }[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const html = (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          if (item.authState === "signed-out") {
            return <SignedOut key={item.href}>{html}</SignedOut>;
          }

          if (item.authState === "signed-in") {
            return <SignedIn key={item.href}>{html}</SignedIn>;
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
