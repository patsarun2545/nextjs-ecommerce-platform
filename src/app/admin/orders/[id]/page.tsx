import PageHeader from "@/components/admin-page/refactor/page-header"
import AdminOrderDetail from "@/features/orders/components/admin-order-detail"
import { getOrderById } from "@/features/orders/db/orders"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)  // ไม่ต้องส่ง userId แล้ว
  if (!order) redirect("/admin/orders")

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title={`Order #${order.orderNumber}`}
        description={`Created on ${order.createdAtFormatted}`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/orders">
              <ArrowLeft size={16} />
              Back to Orders
            </Link>
          </Button>
        }
      />
      <AdminOrderDetail order={order} />
    </div>
  )
}