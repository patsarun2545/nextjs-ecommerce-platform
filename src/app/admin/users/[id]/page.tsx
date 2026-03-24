import { Button } from "@/components/ui/button";
import { authCheck } from "@/features/auths/db/auths";
import UserOrderDetail from "@/features/users/components/user-order-detail";
import { getUserWithOrders } from "@/features/users/db/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const { id } = await params;
  const targetUser = await getUserWithOrders(id);

  if (!targetUser) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">
            {targetUser.name ?? targetUser.email}
          </h1>
          <p className="text-muted-foreground text-sm">
            View user details and order history
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <ArrowLeft size={16} />
            <span>Back to Users</span>
          </Link>
        </Button>
      </div>

      <UserOrderDetail user={targetUser} />
    </div>
  );
}