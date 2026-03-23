"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { generatePromptPayQR } from "@/lib/generatePromptPayQR";
import { getStatusColor, getStatusText } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { Ban, CreditCard, Upload } from "lucide-react";
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
  const [isGeneratingQR, setIsGenerateingQR] = useState(false);

  const [isPaymentFormModal, setIsPaymentFormModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const handleGenerateQR = () => {
    try {
      setIsGenerateingQR(true);

      const qrCode = generatePromptPayQR(order.totalAmount);
      setQrCodeURL(qrCode);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง QR Code");
    } finally {
      setIsGenerateingQR(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              หมายเลขคำสั่งซื้อ: {order.orderNumber}
            </CardTitle>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </CardHeader>

          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สินค้า</TableHead>
                  <TableHead className="text-right">ราคาต่อชิ้น</TableHead>
                  <TableHead className="text-center">จำนวน</TableHead>
                  <TableHead className="text-right">ราคารวม</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative size-10 border rounded-md overflow-hidden">
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลการจัดส่ง</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-1">ที่อยู่จัดส่ง:</h3>
                <p className="text-muted-foreground">{order.address || "-"}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">เบอร์โทรศัพท์:</h3>
                <p className="text-muted-foreground">{order.phone || "-"}</p>
              </div>

              {order.note && (
                <div>
                  <h3 className="font-medium mb-1">หมายเหตุ:</h3>
                  <p className="text-muted-foreground">{order.note}</p>
                </div>
              )}

              {order.trackingNumber && (
                <div>
                  <h3 className="font-medium mb-1">หมายเลขพัสดุ:</h3>
                  <p className="font-medium text-primary">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">สรุปคำสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดสินค้า:</span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>ยอดรวมทั้งสิ้น:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {order.status === "Pending" && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-2">
                  {qrCodeURL ? (
                    <div className="rounded-md border p-4 flex flex-col items-center">
                      <h3 className="text-center font-medium mb-3">
                        สแกน QR Code เพื่อชำระเงิน
                      </h3>
                      <div className="mb-3">
                        <Image
                          alt="PromptPay QR Code"
                          src={qrCodeURL}
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateQR}
                      disabled={isGeneratingQR}
                    >
                      <CreditCard />
                      <span>
                        {isGeneratingQR
                          ? "กำลังสร้าง QR Code..."
                          : "ชำระเงินด้วย PromptPay"}
                      </span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentFormModal(true)}
                  >
                    <Upload size={16} />
                    <span>อัพโหลดหลักฐานการชำระเงิน</span>
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setIsCancelModal(true)}
                  >
                    <Ban size={16} />
                    <span>ยกเลิกคำสั่งซื้อ</span>
                  </Button>
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
            )}

            {order.paymentImage && (
              <div className="flex flex-col gap-2 pt-2">
                <h3 className="font-medium">หลักฐานการชำระเงิน:</h3>
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
                    ชำระเงินเมื่อ: {order.paymentAtFormatted}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


