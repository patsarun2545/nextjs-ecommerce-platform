import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrderGlobalTag = () => {
  return getGlobalTag("orders");
};

export const getOrderIdTag = (orderId: string) => {
  return getIdTag("orders", orderId);
};

export const getUserOrdersTag = (userId: string) => {
  return `user:${userId}:orders` as const;
};

export const revalidateOrderCache = (orderId: string, userId: string) => {
  revalidateTag(getOrderGlobalTag(), "max");
  revalidateTag(getOrderIdTag(orderId), "max");
  revalidateTag(getUserOrdersTag(userId), "max");
};
