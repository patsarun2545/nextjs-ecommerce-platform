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

export default async function AdminOrderPage({ searchParams }: AdminOrderPageProps) {
  const user = await authCheck();
  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const status = (await searchParams).status as OrderStatus;
  const orders = await getAllOrders(user.id, status);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const paidCount = orders.filter((o) => o.status === "Paid").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground text-sm">
            View and manage customer orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-blue-600">{orders.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-yellow-500">
              {pendingCount}
            </span>
            Pending
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-blue-500">{paidCount}</span>
            Paid
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-indigo-500">
              {shippedCount}
            </span>
            Shipped
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-green-600">
              {deliveredCount}
            </span>
            Delivered
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-semibold text-red-500">{cancelledCount}</span>
            Cancelled
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Orders</CardTitle>

          <Tabs defaultValue={status || "all"}>
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all" asChild>
                <Link href="/admin/orders">All</Link>
              </TabsTrigger>
              <TabsTrigger value="Pending" asChild>
                <Link href="/admin/orders?status=Pending">Pending</Link>
              </TabsTrigger>
              <TabsTrigger value="Paid" asChild>
                <Link href="/admin/orders?status=Paid">Paid</Link>
              </TabsTrigger>
              <TabsTrigger value="Shipped" asChild>
                <Link href="/admin/orders?status=Shipped">Shipped</Link>
              </TabsTrigger>
              <TabsTrigger value="Delivered" asChild>
                <Link href="/admin/orders?status=Delivered">Delivered</Link>
              </TabsTrigger>
              <TabsTrigger value="Cancelled" asChild>
                <Link href="/admin/orders?status=Cancelled">Cancelled</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <AdminOrderList orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
};


