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
  ChevronsUpDownIcon,
  LogInIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { type User } from "@/drizzle/schema";

type SidebarUserButtonClientProps = {
  user: User;
};

export default function SidebarUserButtonClient({
  user,
}: SidebarUserButtonClientProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { openUserProfile } = useClerk();

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserInfo user={user} />
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
            <UserInfo user={user} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openUserProfile();
              setOpenMobile(false);
            }}
          >
            <UserIcon className="mr-1" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/user-settings/notifications`}>
              <SettingsIcon className="mr-1" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
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

function UserInfo({ user }: { user: User }) {
  const nameInitials = user.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={user.imageUrl} alt={user.name} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </div>
  );
}
