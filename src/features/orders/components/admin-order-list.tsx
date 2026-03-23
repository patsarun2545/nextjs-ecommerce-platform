"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

interface AdminOrderListProps {
  orders: OrderType[];
}

export default function AdminOrderList({ orders }: AdminOrderListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeTab !== "all") {
      result = result.filter(
        (o) => o.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (searchTerm) {
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [orders, activeTab, searchTerm]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Orders</CardTitle>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search size={16} className="absolute left-2 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search by order number or customer..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Tabs>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">
            <div className="col-span-4 sm:col-span-2">Order #</div>
            <div className="col-span-3 hidden sm:block">Customer</div>
            <div className="col-span-2 hidden sm:block">Date</div>
            <div className="col-span-1 hidden sm:block text-center">Items</div>
            <div className="col-span-2 hidden sm:block text-right pr-2">Amount</div>
            <div className="col-span-5 sm:col-span-1 text-center">Status</div>
            <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[420px]">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                >
                  <div className="col-span-4 sm:col-span-2 font-medium truncate pr-2">
                    {order.orderNumber}
                  </div>
                  <div className="col-span-3 hidden sm:block text-muted-foreground truncate pr-2">
                    {order.customer.name || order.customer.email}
                  </div>
                  <div className="col-span-2 hidden sm:block text-muted-foreground truncate pr-2">
                    {order.createdAtFormatted}
                  </div>
                  <div className="col-span-1 hidden sm:block text-center">
                    {order.totalItems}
                  </div>
                  <div className="col-span-2 hidden sm:block text-right font-medium pr-2">
                    {formatPrice(order.totalAmount)}
                  </div>
                  <div className="col-span-5 sm:col-span-1 text-center">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No orders found matching your search
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}