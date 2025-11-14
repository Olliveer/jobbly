import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { getUser } from "@/features/users/db/users";

export async function getCurrentUser({
  allData = false,
}: {
  allData?: boolean;
}) {
  const { userId } = await auth();

  if (userId && allData) {
    const user = await getUser(userId);

    return {
      userId,
      user,
    };
  }

  return {
    userId,
  };
}
