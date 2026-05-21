import { getProductsFiltered, getCategories } from "@/features/products/db/products";
import ProductsClient from "@/components/customer-page/products/sidebar-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
};

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    price?: string;
    status?: string;
  }>;
}

import { Suspense } from "react";

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
    <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
      <ProductsClient
        products={products}
        categories={["ทั้งหมด", ...categories.map((c) => c.name)]}
        searchParams={params}
      />
    </Suspense>
  );
}