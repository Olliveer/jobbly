import { auth, currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SidebarUserButtonClient from "./sidebar-user-button-client";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

async function SidebarUserSuspense() {
  const { userId } = await auth();

  return (
    <SidebarUserButtonClient
      user={{
        email: "john.doe@example.com",
        name: "John Doe",
        imageUrl: "https://github.com/shadcn.png",
      }}
    />
  );
}
