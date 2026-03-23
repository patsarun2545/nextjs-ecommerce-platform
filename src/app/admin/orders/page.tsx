import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authCheck } from "@/features/auths/db/auths";
import AdminOrderList from "@/features/orders/components/admin-order-list";
import { getAllOrders } from "@/features/orders/db/orders";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AdminOrderPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrderPage() {
  const user = await authCheck();
  if (!user || user.role !== "Admin") redirect("/");

  const orders = await getAllOrders(user.id);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const paidCount = orders.filter((o) => o.status === "Paid").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground text-sm">
            View and manage customer orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-blue-600">{orders.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-yellow-500">{pendingCount}</span>
            Pending
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-blue-500">{paidCount}</span>
            Paid
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-indigo-500">{shippedCount}</span>
            Shipped
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-green-600">{deliveredCount}</span>
            Delivered
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-red-500">{cancelledCount}</span>
            Cancelled
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <AdminOrderList orders={orders} />
        </div>
      </div>
    </div>
  );
}