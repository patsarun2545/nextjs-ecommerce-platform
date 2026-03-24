"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor } from "@/lib/utils";
import formatDate from "@/lib/formatDate";
import {
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Eye,
  Calendar,
  Package,
  Search,
} from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { useState, useMemo } from "react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  totalPirce: number;
  productTitle: string;
  productImage: string | null;
};

type OrderWithItems = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  createdAt: Date;
  totalItems: number;
  items: OrderItem[];
};

type UserWithOrders = {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
  role: "Customer" | "Admin";
  status: "Active" | "Banned";
  address: string | null;
  tel: string | null;
  createdAt: Date;
  orders: OrderWithItems[];
};

interface UserOrderDetailProps {
  user: UserWithOrders;
}

const STATUS_TABS = ["all", "pending", "paid", "shipped", "delivered", "cancelled"] as const;

export default function UserOrderDetail({ user }: UserOrderDetailProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const totalSpent = user.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const cancelledCount = user.orders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  const filteredOrders = useMemo(() => {
    let result = [...user.orders];

    if (activeTab !== "all") {
      result = result.filter(
        (o) => o.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (searchTerm) {
      result = result.filter((o) =>
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [user.orders, activeTab, searchTerm]);

  const infoFields = [
    { icon: <Mail size={13} />, label: "Email", value: user.email },
    {
      icon: <Phone size={13} />,
      label: "Phone",
      value: user.tel ?? "Not provided",
    },
    {
      icon: <MapPin size={13} />,
      label: "Address",
      value: user.address ?? "Not provided",
    },
    {
      icon: <Calendar size={13} />,
      label: "Joined",
      value: formatDate(user.createdAt),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* Left — Profile card */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={user.picture ?? undefined} />
                <AvatarFallback className="text-base">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-snug truncate">
                  {user.name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <Badge
                    variant={user.role === "Admin" ? "default" : "secondary"}
                    className="text-xs px-2 py-0"
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    className={`text-xs px-2 py-0 ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="flex flex-col gap-2.5">
              {infoFields.map((field, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-muted-foreground mt-0.5 shrink-0">
                    {field.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground leading-none mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium break-words leading-snug">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { value: user.orders.length, label: "Orders" },
                { value: cancelledCount, label: "Cancelled" },
                { value: formatPrice(totalSpent), label: "Spent" },
              ].map((stat, i) => (
                <div key={i} className="rounded-lg bg-muted/50 py-2 px-1">
                  <p className="text-sm font-semibold leading-snug truncate">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right — Order History */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <CardTitle className="text-lg">Order History</CardTitle>
              <Badge variant="secondary" className="w-fit">
                <Package size={13} className="mr-1" />
                {user.orders.length} orders
              </Badge>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 mb-3">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="capitalize text-xs">
                    {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-2.5 text-muted-foreground"
                />
                <Input
                  placeholder="Search by order number..."
                  className="pl-8 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="border rounded-md overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 bg-muted py-3 px-4 text-xs font-medium text-muted-foreground">
                <div className="col-span-4 sm:col-span-3">Order #</div>
                <div className="col-span-3 hidden sm:block">Date</div>
                <div className="col-span-1 hidden sm:block text-center">Items</div>
                <div className="col-span-2 hidden sm:block text-right pr-2">Amount</div>
                <div className="col-span-5 sm:col-span-2 text-center">Status</div>
                <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
              </div>

              {/* Rows */}
              <ScrollArea className="h-[380px]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 py-3 px-4 border-t items-center hover:bg-muted/30 transition-colors duration-100 text-sm"
                    >
                      <div className="col-span-4 sm:col-span-3 font-medium truncate pr-2">
                        {order.orderNumber}
                      </div>
                      <div className="col-span-3 hidden sm:block text-muted-foreground truncate pr-2">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="col-span-1 hidden sm:block text-center text-muted-foreground">
                        {order.totalItems}
                      </div>
                      <div className="col-span-2 hidden sm:block text-right font-medium pr-2">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div className="col-span-5 sm:col-span-2 text-center">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="col-span-3 sm:col-span-1 text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye size={14} />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-muted-foreground">
                    <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No orders found</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}