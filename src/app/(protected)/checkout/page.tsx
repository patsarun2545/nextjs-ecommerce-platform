import { authCheck } from "@/features/auths/db/auths";
import { getUserCart } from "@/features/carts/db/carts";
import CheckoutForm from "@/features/orders/components/checkout-form";
import CheckoutSummary from "@/features/orders/components/checkout-summary";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  const cart = await getUserCart(user.id);

  if (!cart || cart.products.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>

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
};


