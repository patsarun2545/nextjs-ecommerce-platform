import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getUserIdTag } from "./cache";

export const getUserbyid = async (id: string | null) => {
  "use cache";
  cacheLife("hours");

  if (!id) return null;
  cacheTag(getUserIdTag(id));
  try {
    const user = await db.user.findFirst({
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
        pictureTd: true,
        address: true,
        tle: true,
        createAt: true,
        updateAt: true,
      },
    });

    return user ?? null;
  } catch (error) {
    console.error("Error gettimg user by id:", error);
    return null;
  }
};
