import CartItems from "@/features/carts/components/cart-items";
import EmptyCart from "@/features/carts/components/empty-cart";
import { getUserCart } from "@/features/carts/db/carts";
import { headers } from "next/headers";
import CartSummary from "@/features/carts/components/cart-summary";

export default async function CartPage() {
  const head = await headers();
  const userId = head.get("x-user-id");
  const cart = await getUserCart(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าของฉัน</h1>

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
};

