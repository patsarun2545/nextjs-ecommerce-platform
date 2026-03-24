import PageHeader from "@/components/admin-page/refactor/page-header"
import StatBadge from "@/components/admin-page/refactor/stat-badge"
import ProductList from "@/features/products/components/product-list"
import { getProducts } from "@/features/products/db/products"

export default async function ProductAdminPage() {
  const products = await getProducts()
  const activeCount = products.filter((p) => p.status === "Active").length
  const inactiveCount = products.filter((p) => p.status === "Inactive").length
  const lowStockCount = products.filter((p) => p.stock <= p.lowStock).length

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Product Management"
        description="Manage your product inventory and details"
        actions={
          <>
            <StatBadge count={products.length} label="Total" color="blue" />
            <StatBadge count={activeCount} label="Active" color="green" />
            <StatBadge count={inactiveCount} label="Inactive" color="gray" />
            <StatBadge count={lowStockCount} label="Low Stock" color="amber" />
          </>
        }
      />
      <ProductList products={products} />
    </div>
  )
}