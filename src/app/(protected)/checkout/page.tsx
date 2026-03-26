import { authCheck } from "@/features/auths/db/auths";
import { getUserCart } from "@/features/carts/db/carts";
import CheckoutForm from "@/components/customer-page/orders/checkout-form";
import CheckoutSummary from "@/components/customer-page/orders/checkout-summary";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ชำระเงิน",
};

export default async function CheckoutPage() {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  const cart = await getUserCart(user.id);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ชำระเงิน</h1>

        <Button variant="outline" asChild>
          <Link href="/cart">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>กลับหน้าตะกร้าสินค้า</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm user={user} />
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}