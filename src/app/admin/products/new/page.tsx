import PageHeader from "@/components/admin-page/refactor/page-header"
import ProductForm from "@/features/products/components/product-form"
import { getCategories } from "@/features/categories/db/categories"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Add New Product"
        description="Create a new product"
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </Button>
        }
      />
      <ProductForm categories={categories} />
    </div>
  )
}