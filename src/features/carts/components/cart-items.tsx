"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { removeFromCartAction, updateCartItemAction } from "../actions/carts";
import { toast } from "sonner";

interface CartItemsProps {
  cart: CartType;
}

interface CartOptimistic {
  type: "update" | "remove";
  itemId: string;
  newCount?: number;
}

export default function CartItems({ cart }: CartItemsProps) {
  const [, startTransition] = useTransition();

  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, { type, itemId, newCount }: CartOptimistic) => {
      if (type === "update" && newCount !== undefined) {
        const updatedItems = state.items.map((item) => {
          if (item.id === itemId) {
            const newPrice = newCount * item.product.price;
            return {
              ...item,
              count: newCount,
              price: newPrice,
            };
          }

          return item;
        });

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price,
          0,
        );

        const newItemCount = updatedItems.reduce(
          (sum, item) => sum + item.count,
          0,
        );

        return {
          ...state,
          items: updatedItems,
          cartTotal: newTotal,
          itemCount: newItemCount,
        };
      }

      if (type === "remove") {
        const updatedItems = state.items.filter((item) => itemId !== item.id);

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price,
          0,
        );

        const newItemCount = updatedItems.reduce(
          (sum, item) => sum + item.count,
          0,
        );

        return {
          ...state,
          items: updatedItems,
          cartTotal: newTotal,
          itemCount: newItemCount,
        };
      }

      return state;
    },
  );

  const handleUpdateQty = async (itemId: string, newCount: number) => {
    startTransition(() => {
      updateOpCart({ type: "update", itemId, newCount });
    });

    const formData = new FormData();
    formData.append("cart-item-id", itemId);
    formData.append("new-count", newCount.toString());

    const result = await updateCartItemAction(formData);

    if (result && result.message) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    startTransition(() => {
      updateOpCart({ type: "remove", itemId });
    });

    const result = await removeFromCartAction(itemId);
    if (result && result.message) {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">รายการในตะกร้า</h2>

      {opCart.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative size-24 border border-primary rounded-md overflow-hidden">
            <Link href={`/products/${item.product.id}`}>
              <Image
                alt={item.product.title}
                src={
                  item.product.mainImage?.url || "/images/no-product-image.webp"
                }
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* Product Detail */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <Link
                href={`/products/${item.product.id}`}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                {item.product.title}
              </Link>
              <p className="font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="text-sm text-muted-foreground">
              ประเภท: {item.product.category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              ราคาต่อหน่วย: {formatPrice(item.product.price)}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="size-8"
                  disabled={item.count <= 1}
                  onClick={() => handleUpdateQty(item.id, item.count - 1)}
                >
                  <Minus size={14} />
                </Button>

                <span className="w-10 text-center">{item.count}</span>

                <Button
                  variant="outline"
                  className="size-8"
                  disabled={item.count >= item.product.stock}
                  onClick={() => handleUpdateQty(item.id, item.count + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive/90 hover:text-destructive"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};


