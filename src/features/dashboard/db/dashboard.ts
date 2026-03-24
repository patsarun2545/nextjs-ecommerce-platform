import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getOrderGlobalTag } from "@/features/orders/db/cache";
import { getProductGlobalTag } from "@/features/products/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";

export const getDashboardStats = async () => {
  "use cache";

  cacheLife("minutes");
  cacheTag(getOrderGlobalTag());
  cacheTag(getProductGlobalTag());
  cacheTag(getUserGlobalTag());

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const stalePendingThreshold = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      ordersByStatus,
      recentOrders,
      revenueAll,
      revenueThisMonth,
      revenueLastMonth,
      ordersThisMonth,
      ordersLastMonth,
      usersThisMonth,
      usersLastMonth,
      lowStockProducts,
      topProducts,
      stalePendingOrders,
      stalePendingCount,
    ] = await Promise.all([
      db.order.count(),
      db.user.count(),
      db.product.count({ where: { status: "Active" } }),

      db.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true, email: true } },
        },
      }),

      db.order.aggregate({
        where: { status: { in: ["Paid", "Shipped", "Delivered"] } },
        _sum: { totalAmount: true },
      }),

      db.order.aggregate({
        where: {
          status: { in: ["Paid", "Shipped", "Delivered"] },
          createdAt: { gte: startOfThisMonth },
        },
        _sum: { totalAmount: true },
      }),

      db.order.aggregate({
        where: {
          status: { in: ["Paid", "Shipped", "Delivered"] },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),

      db.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),

      db.order.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),

      db.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),

      db.user.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),

      db.product.findMany({
        where: { status: "Active", stock: { lte: 5 } },
        select: { id: true, title: true, stock: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),

      db.product.findMany({
        where: { status: "Active" },
        orderBy: { sold: "desc" },
        take: 5,
        select: { id: true, title: true, sold: true, price: true },
      }),

      db.order.findMany({
        where: {
          status: "Pending",
          createdAt: { lte: stalePendingThreshold },
        },
        orderBy: { createdAt: "asc" },
        take: 5,
        include: {
          customer: { select: { name: true, email: true } },
        },
      }),

      db.order.count({
        where: {
          status: "Pending",
          createdAt: { lte: stalePendingThreshold },
        },
      }),
    ]);

    const statusMap = Object.fromEntries(
      ordersByStatus.map((s) => [s.status, s._count.status])
    );

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenueThisMonthVal = revenueThisMonth._sum.totalAmount ?? 0;
    const revenueLastMonthVal = revenueLastMonth._sum.totalAmount ?? 0;

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueAll._sum.totalAmount ?? 0,

      revenueThisMonth: revenueThisMonthVal,
      revenueGrowth: calcGrowth(revenueThisMonthVal, revenueLastMonthVal),
      ordersThisMonth,
      ordersGrowth: calcGrowth(ordersThisMonth, ordersLastMonth),
      usersThisMonth,
      usersGrowth: calcGrowth(usersThisMonth, usersLastMonth),

      ordersByStatus: {
        Pending: statusMap["Pending"] ?? 0,
        Paid: statusMap["Paid"] ?? 0,
        Shipped: statusMap["Shipped"] ?? 0,
        Delivered: statusMap["Delivered"] ?? 0,
        Cancelled: statusMap["Cancelled"] ?? 0,
      },

      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customer.name ?? o.customer.email,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
      })),

      lowStockProducts,
      topProducts,

      stalePendingOrders: stalePendingOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customer.name ?? o.customer.email,
        createdAt: o.createdAt,
        totalAmount: o.totalAmount,
      })),
      stalePendingCount,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return null;
  }
};