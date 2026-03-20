import { getCategories } from "@/features/categories/db/categories";
import ProductForm from "@/features/products/components/product-form";
import { getProductById } from "@/features/products/db/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground text-sm">
          Update product information
        </p>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  );
};

export default EditProductPage;
