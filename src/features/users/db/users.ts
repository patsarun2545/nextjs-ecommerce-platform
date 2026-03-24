import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getUserGlobalTag, getUserIdTag } from "./cache";

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

export const getAllUsers = async () => {
  "use cache";

  cacheLife("minutes");
  cacheTag(getUserGlobalTag());

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

export const getUserWithOrders = async (userId: string) => {
  "use cache";

  cacheLife("minutes");
  cacheTag(getUserIdTag(userId));

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        status: true,
        address: true,
        tel: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      orders: user.orders.map((order) => ({
        ...order,
        totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      })),
    };
  } catch (error) {
    console.error("Error getting user with orders:", error);
    return null;
  }
};