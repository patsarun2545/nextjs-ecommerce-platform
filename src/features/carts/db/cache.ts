import { getUserIdTag } from "@/features/users/db/cache";
import { revalidateTag } from "next/cache";

export const getCartTag = (userId: string) => {
  return `cart:${userId}` as const;
};

export const revalidateCartCache = (userId: string) => {
  revalidateTag(getCartTag(userId),"max");
  revalidateTag(getUserIdTag(userId),"max");
};
