import PageHeader from "@/components/admin-page/refactor/page-header"
import StatBadge from "@/components/admin-page/refactor/stat-badge"
import { getCategories } from '@/features/categories/db/categories'
import CategoryForm from '@/features/categories/components/category-form'
import CategoryList from '@/features/categories/components/category-list'

export default async function CategoriesAdminPage() {
  const categories = await getCategories()
  const activeCount = categories.filter((c) => c.status === 'Active').length
  const inactiveCount = categories.filter((c) => c.status === 'Inactive').length

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Category Management"
        description="Organize your product categories efficiently"
        actions={
          <>
            <StatBadge count={categories.length} label="Total" color="blue" />
            <StatBadge count={activeCount} label="Active" color="green" />
            <StatBadge count={inactiveCount} label="Inactive" color="gray" />
          </>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <CategoryForm />
        </div>
        <div className="lg:col-span-2">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}