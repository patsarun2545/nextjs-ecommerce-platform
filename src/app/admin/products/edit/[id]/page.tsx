import { getCategories } from "@/features/categories/db/categories";
import ProductForm from "@/features/products/components/product-form";
import { getProductById } from "@/features/products/db/products";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground text-sm">
            Update product information
          </p>
        </div>

        {/* Back Button */}
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </Button>
      </div>

      {/* Form */}
      <ProductForm categories={categories} product={product} />
    </div>
  );
}