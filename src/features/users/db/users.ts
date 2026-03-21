import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getUserIdTag } from "./cache";

export const getUserById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getUserIdTag(id));
  try {
    const user = await db.user.findUnique({
      where: {
        id,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        status: true,
        pictureId: true,
        address: true,
        tel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error gettimg user by id:", error);
    return null;
  }
};
