"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@/services/clerk/components/auth-buttons";
import { useClerk } from "@clerk/nextjs";
import {
  ArrowLeftRightIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogInIcon,
  SettingsIcon,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import { type User } from "@/drizzle/schema";
import { type Organization } from "@/drizzle/schema";

type SidebarOrganizationButtonClientProps = {
  organization: Organization;
  user: User;
};

export function SidebarOrganizationButtonClient({
  organization,
  user,
}: SidebarOrganizationButtonClientProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { openOrganizationProfile } = useClerk();

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <OrganizationInfo organization={organization} user={user} />
            <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          align="end"
          side={isMobile ? "bottom" : "right"}
          className="min-w-68 max-w-80"
        >
          <DropdownMenuLabel className="font-normal p-1">
            <OrganizationInfo organization={organization} user={user} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openOrganizationProfile();
              setOpenMobile(false);
            }}
          >
            <Building2Icon className="mr-1" />
            <span>Manage Organization</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/employer/user-settings`}>
              <UserRoundCogIcon className="mr-1" />
              <span>User Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/employer/pricing`}>
              <CreditCardIcon className="mr-1" />
              <span>Change Plan</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/organizations/select`}>
              <ArrowLeftRightIcon className="mr-1" />
              <span>Switch Organization</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem>
              <LogInIcon className="mr-1" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenu>
  );
}

function OrganizationInfo({
  organization,
  user,
}: {
  organization: Organization;
  user: User;
}) {
  const nameInitials = organization.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage
          src={organization.imageUrl ?? undefined}
          alt={organization.name}
        />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">
          {organization.name}
        </span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </div>
  );
}
