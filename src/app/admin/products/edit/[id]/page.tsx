import PageHeader from "@/components/admin-page/refactor/page-header"
import ProductForm from "@/features/products/components/product-form"
import { getCategories } from "@/features/categories/db/categories"
import { getProductById } from "@/features/products/db/products"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Edit Product"
        description="Update product information"
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </Button>
        }
      />
      <ProductForm categories={categories} product={product} />
    </div>
  )
}