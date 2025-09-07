import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/components/features/users/db/users";

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
