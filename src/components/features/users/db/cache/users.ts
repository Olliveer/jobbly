import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getUserGlobalTag() {
  return getGlobalTag("users");
}

export function getUserByIdTag(id: string) {
  return getIdTag("users", id);
}

export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserByIdTag(id));
}
