import { authCheck } from "@/features/auths/db/auths";
import { getMyOrders } from "@/features/orders/db/orders";
import { redirect } from "next/navigation";
import MyOrdersClient from "@/components/customer-page/orders/orders-client";

export default async function MyOrdersPage() {
  const user = await authCheck();
  if (!user) redirect("/auth/signin");

  const orders = await getMyOrders(user.id);

  return <MyOrdersClient orders={orders} />;
}