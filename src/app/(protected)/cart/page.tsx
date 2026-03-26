import CartItems from "@/features/carts/components/cart-items";
import EmptyCart from "@/features/carts/components/empty-cart";
import { getUserCart } from "@/features/carts/db/carts";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import CartSummary from "@/features/carts/components/cart-summary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตะกร้าของฉัน",
};

export default async function CartPage() {
  const user = await authCheck();
  if (!user) {
    redirect("/auth/signin");
  }

  const cart = await getUserCart(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ตะกร้าของฉัน</h1>

        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>กลับหน้าสินค้า</span>
          </Link>
        </Button>
      </div>

      {!cart || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems cart={cart} />
          </div>
          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
}