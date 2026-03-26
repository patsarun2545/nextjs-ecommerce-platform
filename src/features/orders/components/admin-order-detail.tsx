"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";;
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import {
  Ban,
  Check,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  StickyNote,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState, startTransition } from "react";
import { updateOrderStatusAction } from "../actions/orders";
import { useForm } from "@/hooks/use-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminOrderDetailProps {
  order: OrderType;
}

export default function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const { formAction, isPending } = useForm(updateOrderStatusAction);

  const handleUpdateStatus = () => {
    const formData = new FormData();
    formData.append("order-id", order.id);
    formData.append("status", selectedStatus);
    if (trackingNumber) {
      formData.append("tracking-number", trackingNumber);
    }
    startTransition(() => formAction(formData));
  };

  const statusIcon = {
    Pending: <Clock size={16} />,
    Paid: <CreditCard size={16} />,
    Shipped: <Truck size={16} />,
    Delivered: <Check size={16} />,
    Cancelled: <Ban size={16} />,
  }[selectedStatus];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Order Items */}
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b">
              <div className="grid grid-cols-12 bg-muted py-3 px-4 text-xs font-medium text-muted-foreground">
                <div className="col-span-1 hidden sm:block">Image</div>
                <div className="col-span-8 sm:col-span-5">Product Name</div>
                <div className="col-span-2 hidden sm:block text-right">Price</div>
                <div className="col-span-1 hidden sm:block text-center">Qty</div>
                <div className="col-span-4 sm:col-span-3 text-right pr-2">Total</div>
              </div>
            </div>

            <ScrollArea className="h-[280px]">   {/* ← ครอบตรงนี้ */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-3 px-4 border-b last:border-b-0 items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                >
                  <div className="col-span-1 hidden sm:block">
                    <Image
                      alt={item.productTitle}
                      src={item.productImage || "/images/no-product-image.webp"}
                      width={40}
                      height={40}
                      className="object-cover rounded-md border"
                    />
                  </div>
                  <div className="col-span-8 sm:col-span-5 truncate pr-2">
                    <div className="font-medium truncate">{item.productTitle}</div>
                  </div>
                  <div className="col-span-2 hidden sm:block text-right pr-2 text-muted-foreground">
                    {formatPrice(item.price)}
                  </div>
                  <div className="col-span-1 hidden sm:block text-center">
                    <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-right pr-2 font-medium">
                    {formatPrice(item.totalPirce)}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Customer + Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Customer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                  <User size={14} className="text-blue-600" />
                </div>
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {[
                { icon: <User size={13} />, label: "Name", value: order.customer.name || "Not provided" },
                { icon: <Mail size={13} />, label: "Email", value: order.customer.email },
                { icon: <Phone size={13} />, label: "Phone", value: order.phone || "Not provided" },
              ].map((field, i, arr) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <span className="text-muted-foreground mt-0.5">{field.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                      <p className="text-sm font-medium truncate">{field.value}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-md bg-green-50 flex items-center justify-center">
                  <Truck size={14} className="text-green-600" />
                </div>
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {[
                { icon: <MapPin size={13} />, label: "Address", value: order.address || "Not provided" },
                { icon: <Package size={13} />, label: "Tracking", value: order.trackingNumber || "Not provided" },
                { icon: <StickyNote size={13} />, label: "Notes", value: order.note || "None" },
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
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-6">

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.totalAmount - order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping fee</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Update Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                disabled={order.status === "Cancelled"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedStatus === "Shipped" || selectedStatus === "Delivered") && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Tracking Number</Label>
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleUpdateStatus}
              disabled={
                isPending ||
                selectedStatus === order.status ||
                (["Shipped", "Delivered"].includes(selectedStatus) && !trackingNumber)
              }
            >
              {statusIcon}
              <span>{isPending ? "Updating..." : "Update Status"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Payment Proof */}
        {order.paymentImage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-md bg-emerald-50 flex items-center justify-center">
                  <CreditCard size={14} className="text-emerald-600" />
                </div>
                Payment Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                <Image
                  alt="Payment proof"
                  src={order.paymentImage}
                  fill
                  className="object-contain"
                />
              </div>
              {order.paymentAt && (
                <p className="text-xs text-muted-foreground">
                  Paid at: {order.paymentAtFormatted}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}