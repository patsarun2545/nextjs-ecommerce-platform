import PageHeader from "@/components/admin-page/refactor/page-header"
import StatBadge from "@/components/admin-page/refactor/stat-badge"
import AdminOrderList from "@/features/orders/components/admin-order-list"
import { getAllOrders } from "@/features/orders/db/orders"

export default async function AdminOrderPage() {
  const orders = await getAllOrders()

  const pendingCount   = orders.filter((o) => o.status === "Pending").length
  const paidCount      = orders.filter((o) => o.status === "Paid").length
  const shippedCount   = orders.filter((o) => o.status === "Shipped").length
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders"
        actions={
          <>
            <StatBadge count={orders.length}   label="Total"     color="blue" />
            <StatBadge count={pendingCount}    label="Pending"   color="yellow" />
            <StatBadge count={paidCount}       label="Paid"      color="blue" />
            <StatBadge count={shippedCount}    label="Shipped"   color="indigo" />
            <StatBadge count={deliveredCount}  label="Delivered" color="green" />
            <StatBadge count={cancelledCount}  label="Cancelled" color="red" />
          </>
        }
      />
      <AdminOrderList orders={orders} />
    </div>
  )
}