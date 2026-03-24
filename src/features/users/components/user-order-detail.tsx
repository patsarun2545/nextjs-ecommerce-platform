"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor } from "@/lib/utils";
import formatDate from "@/lib/formatDate";
import {
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Eye,
  User,
  Calendar,
  Package,
} from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

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

export default function UserOrderDetail({ user }: UserOrderDetailProps) {
  const totalSpent = user.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left */}
      <div className="flex flex-col gap-6">

        {/* Profile */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 flex flex-col items-center gap-3">
            <Avatar className="size-16">
              <AvatarImage src={user.picture ?? undefined} />
              <AvatarFallback className="text-xl">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{user.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <Badge
                className={
                  user.status === "Active"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100"
                }
              >
                {user.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {[
              { icon: <Mail size={13} />, label: "Email", value: user.email },
              { icon: <Phone size={13} />, label: "Phone", value: user.tel ?? "Not provided" },
              { icon: <MapPin size={13} />, label: "Address", value: user.address ?? "Not provided" },
              { icon: <Calendar size={13} />, label: "Joined", value: formatDate(user.createdAt) },
            ].map((field, i, arr) => (
              <div key={i}>
                <div className="flex items-start gap-3 py-3">
                  <span className="text-muted-foreground mt-0.5">{field.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                    <p className="text-sm font-medium break-words">{field.value}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Orders</span>
              <span>{user.orders.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cancelled</span>
              <span>{user.orders.filter((o) => o.status === "Cancelled").length}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total Spent</span>
              <span>{formatPrice(totalSpent)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <CardTitle className="text-lg">Order History</CardTitle>
              <Badge variant="secondary">
                <Package size={13} className="mr-1" />
                {user.orders.length} orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {user.orders.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="pl-4">Order #</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="hidden sm:table-cell text-center">Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <ScrollArea className="h-[480px]">
                  <Table>
                    <TableBody>
                      {user.orders.map((order, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium text-sm">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-center text-sm">
                            {order.totalItems}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye size={14} />
                                <span className="hidden sm:inline">View</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}