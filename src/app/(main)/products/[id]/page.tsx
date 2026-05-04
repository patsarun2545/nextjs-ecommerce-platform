import { getProductById, getFeatureProducts } from "@/features/products/db/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/customer-page/products/products-detail-client";
import ProductCard from "@/components/customer-page/products/product-card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product?.title ?? "สินค้า",
  };
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
    <main className="container mx-auto px-4 py-8">

      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              หน้าหลัก
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-foreground transition-colors">
              สินค้าทั้งหมด
            </Link>
          </li>
          {product.category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/products?category=${product.category.name}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li
            aria-current="page"
            className="text-foreground font-medium line-clamp-1 max-w-[200px]"
          >
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>กลับหน้าสินค้า</span>
          </Link>
        </Button>
      </div>

      <ProductDetailClient product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border text-secondary-foreground text-xs font-semibold">
              <Sparkles size={12} aria-hidden="true" />
              สินค้าในหมวดเดียวกัน
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}