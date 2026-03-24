// app/products/[id]/page.tsx
import { getProductById, getFeatureProducts } from "@/features/products/db/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/customer-page/products/products-detail-client";
import ProductCard from "@/components/customer-page/products/product-card";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [product, related] = await Promise.all([
    getProductById(id),
    getFeatureProducts(),
  ]);

  if (!product) notFound();

  const relatedProducts = related
    .filter((p) => p.id !== product.id && p.category?.id === product.category?.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">สินค้าทั้งหมด</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/products?category=${product.category.name}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-600 font-medium line-clamp-1 max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8">
        <ProductDetailClient product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
                <Sparkles size={12} />
                สินค้าในหมวดเดียวกัน
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={i} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}