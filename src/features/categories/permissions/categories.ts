import { UserType } from "@/types/user";

export const canCreateCategory = (user: UserType) => {
  return user.role === "Admin";
};

export const canUdateCategory = (user: UserType) => {
  return user.role === "Admin";
};
