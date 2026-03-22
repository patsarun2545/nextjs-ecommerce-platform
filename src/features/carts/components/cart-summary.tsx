"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { clearCartAction } from "../actions/carts";
import { toast } from "sonner";
import { useOptimistic, useTransition } from "react";

interface CartSummaryProps {
  cart: CartType;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const [, startTransition] = useTransition();
  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, action: "clear") => {
      if (action === "clear") {
        return {
          ...state,
          items: [],
          cartTotal: 0,
          itemCount: 0,
        };
      }

      return state;
    },
  );

  const handleClearCart = async () => {
    startTransition(() => {
      updateOpCart("clear");
    });

    const result = await clearCartAction();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">สรุปการสั่งซื้อ</h2>

      <div className="flex justify-between">
        <span>ยอดรวมย่อย</span>
        <span>{formatPrice(opCart.cartTotal)}</span>
      </div>

      <div className="flex justify-between text-muted-foreground">
        <span>ค่าจัดส่ง</span>
        <span>ฟรี</span>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>ทั้งหมด</span>
        <span>{formatPrice(opCart.cartTotal)}</span>
      </div>

      <div className="pt-4 space-y-2">
        <Button size="lg" className="w-full" asChild>
          <Link href="/checkout">
            <ShoppingBag size={18} />
            <span>เช็คเอาท์</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={opCart.items.length === 0}
          onClick={handleClearCart}
        >
          ล้างตะกร้า
        </Button>
      </div>
    </Card>
  );
};


