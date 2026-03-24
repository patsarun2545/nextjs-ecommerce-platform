"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor } from "@/lib/utils";
import formatDate from "@/lib/formatDate";
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OrderStatus } from "@prisma/client";

type DashboardStats = {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  ordersThisMonth: number;
  ordersGrowth: number;
  usersThisMonth: number;
  usersGrowth: number;
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
  }[];
  lowStockProducts: { id: string; title: string; stock: number }[];
  topProducts: { id: string; title: string; sold: number; price: number }[];
  stalePendingOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    createdAt: Date;
    totalAmount: number;
  }[];
  stalePendingCount: number;
};

interface DashboardClientProps {
  stats: DashboardStats;
}

function GrowthBadge({ value }: { value: number }) {
  if (value > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
        <TrendingUp size={12} />+{value}%
      </span>
    );
  if (value < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
        <TrendingDown size={12} />{value}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground font-medium">
      <Minus size={12} />0%
    </span>
  );
}

const orderStatusRows = (stats: DashboardStats) => [
  { label: "Pending", count: stats.ordersByStatus.Pending, icon: <Clock size={14} />, color: "text-yellow-600" },
  { label: "Paid", count: stats.ordersByStatus.Paid, icon: <CreditCard size={14} />, color: "text-blue-600" },
  { label: "Shipped", count: stats.ordersByStatus.Shipped, icon: <Truck size={14} />, color: "text-indigo-600" },
  { label: "Delivered", count: stats.ordersByStatus.Delivered, icon: <CheckCircle size={14} />, color: "text-green-600" },
  { label: "Cancelled", count: stats.ordersByStatus.Cancelled, icon: <XCircle size={14} />, color: "text-red-500" },
];

export default function DashboardClient({ stats }: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [lastRefreshed, setLastRefreshed] = useState<Date>(() => new Date());

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      setLastRefreshed(new Date());
    });
  };

  const statCards = [
    {
      title: "Revenue This Month",
      value: formatPrice(stats.revenueThisMonth),
      growth: stats.revenueGrowth,
      sub: `Total: ${formatPrice(stats.totalRevenue)}`,
      icon: <DollarSign size={18} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Orders This Month",
      value: stats.ordersThisMonth,
      growth: stats.ordersGrowth,
      sub: `Total: ${stats.totalOrders} orders`,
      icon: <ShoppingBag size={18} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "New Users This Month",
      value: stats.usersThisMonth,
      growth: stats.usersGrowth,
      sub: `Total: ${stats.totalUsers} users`,
      icon: <Users size={18} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Active Products",
      value: stats.totalProducts,
      growth: null,
      sub: `${stats.lowStockProducts.length} low stock`,
      icon: <Package size={18} className="text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Refresh bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {`Last refreshed: ${lastRefreshed.toLocaleTimeString()}`}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isPending}
          className="gap-1.5"
        >
          <RefreshCw size={13} className={isPending ? "animate-spin" : ""} />
          {isPending ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stale pending alert */}
      {stats.stalePendingCount > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <TriangleAlert size={16} />
              {stats.stalePendingCount} Pending order{stats.stalePendingCount > 1 ? "s" : ""} waiting over 3 days
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {stats.stalePendingOrders.map((order, idx, arr) => (
              <div key={order.id}>
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{order.orderNumber}</span>
                    <span className="text-xs text-muted-foreground">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye size={13} />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                {idx < arr.length - 1 && <Separator />}
              </div>
            ))}
            {stats.stalePendingCount > 5 && (
              <p className="text-xs text-muted-foreground pt-2 text-center">
                And {stats.stalePendingCount - 5} more...{" "}
                <Link href="/admin/orders?status=Pending" className="underline">
                  View all
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Card key={idx}>
            <CardContent className="pt-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                  {card.growth !== null && <GrowthBadge value={card.growth} />}
                </div>
              </div>
              <div className={`size-10 rounded-md ${card.bg} flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/orders">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 bg-muted/50 py-2.5 px-4 text-xs font-medium">
                <div className="col-span-3">Order #</div>
                <div className="col-span-4 hidden sm:block">Customer</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-right">View</div>
              </div>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-12 py-3 px-4 border-t items-center text-sm hover:bg-gray-50 transition-colors duration-100"
                  >
                    <div className="col-span-3 font-medium truncate pr-2 text-xs sm:text-sm">
                      {order.orderNumber}
                    </div>
                    <div className="col-span-4 hidden sm:block text-muted-foreground truncate pr-2">
                      {order.customerName}
                    </div>
                    <div className="col-span-2 text-right font-medium text-xs sm:text-sm">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="sm" variant="ghost" asChild className="h-7 w-7 p-0">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye size={13} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-muted-foreground text-sm">
                  No orders yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Order Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {orderStatusRows(stats).map((row, idx, arr) => (
                <div key={idx}>
                  <div className="flex items-center justify-between py-2.5">
                    <div className={`flex items-center gap-2 text-sm ${row.color}`}>
                      {row.icon}
                      <span>{row.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{row.count}</span>
                  </div>
                  {idx < arr.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Low Stock */}
          {stats.lowStockProducts.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-6 rounded-md bg-amber-50 flex items-center justify-center">
                    <AlertTriangle size={13} className="text-amber-600" />
                  </div>
                  Low Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-0">
                {stats.lowStockProducts.map((product, idx, arr) => (
                  <div key={product.id}>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-sm truncate pr-2">{product.title}</span>
                      <Badge
                        className={
                          product.stock === 0
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {product.stock === 0 ? "Out" : `${product.stock} left`}
                      </Badge>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-6 rounded-md bg-blue-50 flex items-center justify-center">
                  <TrendingUp size={13} className="text-blue-600" />
                </div>
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, idx, arr) => (
                  <div key={product.id}>
                    <div className="flex items-center justify-between py-2.5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground w-4 flex-shrink-0">{idx + 1}</span>
                        <span className="text-sm truncate">{product.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{product.sold} sold</span>
                    </div>
                    {idx < arr.length - 1 && <Separator />}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">No sales yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}