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
import { Separator } from "@/components/ui/separator";
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
import { OrderType } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import { Ban, Check, Truck } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "../actions/orders";
import { toast } from "sonner";

interface AdminOrderDetailProps {
  order: OrderType;
}

export default function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );

  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("order-id", order.id);
      formData.append("status", selectedStatus);

      if (trackingNumber) {
        formData.append("tracking-number", trackingNumber);
      }

      const result = await updateOrderStatusAction(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <CardTitle className="text-xl">Order Details</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 border rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            alt={item.productTitle}
                            src={
                              item.productImage ||
                              "/images/no-product-image.webp"
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{item.productTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.totalPirce)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm">Name</Label>
                <div className="font-medium">
                  {order.customer.name || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <div className="font-medium">{order.customer.email}</div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Phone</Label>
                <div className="font-medium">
                  {order.phone || "Not provided"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm">Address</Label>
                <div className="font-medium">
                  {order.address || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Tracking Number
                </Label>
                <div className="font-medium">
                  {order.trackingNumber || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Notes</Label>
                <div className="font-medium">{order.note || "None"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping fee:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Order Status</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as OrderStatus)
                  }
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

              {(selectedStatus === "Shipped" ||
                selectedStatus === "Delivered") && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(event) => setTrackingNumber(event.target.value)}
                    />
                  </div>
                )}
            </div>

            {order.paymentImage && (
              <div className="space-y-2">
                <Label>Payment Proof</Label>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                  <Image
                    alt="Payment proof"
                    src={order.paymentImage}
                    fill
                    className="object-contain"
                  />
                </div>
                {order.paymentAt && (
                  <p className="text-sm text-muted-foreground">
                    Paid at: {order.paymentAtFormatted}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={handleUpdateStatus}
              disabled={
                isPending ||
                selectedStatus === order.status ||
                (["Shipped", "Delivered"].includes(selectedStatus) &&
                  !trackingNumber)
              }
            >
              <>
                {selectedStatus === "Shipped" && <Truck size={16} />}
                {selectedStatus === "Delivered" && <Check size={16} />}
                {selectedStatus === "Cancelled" && <Ban size={16} />}
              </>
              <span>Update Status</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


