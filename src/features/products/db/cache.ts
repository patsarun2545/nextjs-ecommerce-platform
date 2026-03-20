import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getProductGlobalTag = () => {
  return getGlobalTag("products");
};

export const getProductIdTag = (id: string) => {
  return getIdTag("products", id);
};

export const revalidateProductCache = (id: string) => {
  revalidateTag(getProductGlobalTag(), "max");
  revalidateTag(getProductIdTag(id), "max");
};
