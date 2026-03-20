import { UserType } from "@/types/user";

export const canCreateProduct = (user: UserType) => {
  return user.role === "Admin";
};
