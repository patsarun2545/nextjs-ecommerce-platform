"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { generatePromptPayQR } from "@/lib/generatePromptPayQR";
import { getStatusColor, getStatusText } from "@/lib/utils";
import { OrderType } from "@/types/order";
import {
  Ban,
  CreditCard,
  MapPin,
  Package,
  Phone,
  StickyNote,
  Truck,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import PaymentFormModal from "./payment-form-modal";
import CancelOrderModal from "./cancel-order-modal";

interface OrderDetailProps {
  order: OrderType;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isPaymentFormModal, setIsPaymentFormModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const handleGenerateQR = () => {
    try {
      setIsGeneratingQR(true);
      const qrCode = generatePromptPayQR(order.totalAmount);
      setQrCodeURL(qrCode);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง QR Code");
    } finally {
      setIsGeneratingQR(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Order Items */}
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <CardTitle className="text-lg">
                หมายเลขคำสั่งซื้อ: {order.orderNumber}
              </CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b">
              <div className="grid grid-cols-12 bg-muted py-3 px-4 text-xs font-medium text-muted-foreground">
                <div className="col-span-1 hidden sm:block">รูป</div>
                <div className="col-span-8 sm:col-span-5">ชื่อสินค้า</div>
                <div className="col-span-2 hidden sm:block text-right">ราคา/ชิ้น</div>
                <div className="col-span-1 hidden sm:block text-center">จำนวน</div>
                <div className="col-span-4 sm:col-span-3 text-right pr-2">รวม</div>
              </div>
            </div>

            <ScrollArea className="h-[280px]">
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

        {/* Shipping Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-green-50 flex items-center justify-center">
                <Truck size={14} className="text-green-600" />
              </div>
              ข้อมูลการจัดส่ง
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {[
              {
                icon: <MapPin size={13} />,
                label: "ที่อยู่จัดส่ง",
                value: order.address || "ไม่ได้ระบุ",
              },
              {
                icon: <Phone size={13} />,
                label: "เบอร์โทรศัพท์",
                value: order.phone || "ไม่ได้ระบุ",
              },
              {
                icon: <Package size={13} />,
                label: "หมายเลขพัสดุ",
                value: order.trackingNumber || "ยังไม่มีข้อมูล",
              },
              {
                icon: <StickyNote size={13} />,
                label: "หมายเหตุ",
                value: order.note || "ไม่มี",
              },
            ].map((field, i, arr) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-3">
                  <span className="text-muted-foreground shrink-0">{field.icon}</span>
                  <span className="text-sm text-muted-foreground shrink-0">{field.label}:</span>
                  <span className="text-sm font-medium truncate">{field.value}</span>
                </div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-6">

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">สรุปคำสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ยอดสินค้า</span>
              <span>{formatPrice(order.totalAmount - order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ค่าจัดส่ง</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>ยอดรวมทั้งสิ้น</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Actions (Pending only) */}
        {order.status === "Pending" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                  <CreditCard size={14} className="text-blue-600" />
                </div>
                ชำระเงิน
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {qrCodeURL ? (
                <div className="rounded-md border p-4 flex flex-col items-center">
                  <p className="text-center text-sm font-medium mb-3">
                    สแกน QR Code เพื่อชำระเงิน
                  </p>
                  <Image
                    alt="PromptPay QR Code"
                    src={qrCodeURL}
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <Button onClick={handleGenerateQR} disabled={isGeneratingQR} className="w-full">
                  <CreditCard size={16} />
                  <span>
                    {isGeneratingQR ? "กำลังสร้าง QR Code..." : "ชำระเงินด้วย PromptPay"}
                  </span>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsPaymentFormModal(true)}
              >
                <Upload size={16} />
                <span>อัพโหลดหลักฐานการชำระเงิน</span>
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsCancelModal(true)}
              >
                <Ban size={16} />
                <span>ยกเลิกคำสั่งซื้อ</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Proof */}
        {order.paymentImage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-md bg-emerald-50 flex items-center justify-center">
                  <CreditCard size={14} className="text-emerald-600" />
                </div>
                หลักฐานการชำระเงิน
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
                  ชำระเงินเมื่อ: {order.paymentAtFormatted}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <PaymentFormModal
        open={isPaymentFormModal}
        onOpenChange={setIsPaymentFormModal}
        orderId={order.id}
      />

      <CancelOrderModal
        open={isCancelModal}
        onOpenChange={setIsCancelModal}
        orderId={order.id}
      />
    </div>
  );
}