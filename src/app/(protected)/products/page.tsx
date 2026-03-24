import { getProductsFiltered, getCategories } from "@/features/products/db/products";
import ProductsClient from "@/components/customer-page/products/products-client";

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    price?: string;
    status?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    getProductsFiltered({
      q: params?.q,
      category: params?.category,
      sort: params?.sort,
      priceRange: params?.price,
      status: params?.status,
    }),
    getCategories(),
  ]);

  return (
    <ProductsClient
      products={products}
      categories={["ทั้งหมด", ...categories.map((c) => c.name)]}
      searchParams={params}
    />
  );
}