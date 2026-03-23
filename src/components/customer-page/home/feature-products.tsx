import { getFeatureProducts } from "@/features/products/db/products";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import ProductCard from "../products/product-card";

export default async function FeatureProducts() {
  const products = await getFeatureProducts();

  return (
    <section className="relative bg-white py-16 md:py-20">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} />
              สินค้าแนะนำ
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              สินค้าขายดี
              <span className="block text-blue-600">ประจำสัปดาห์</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150 group shrink-0"
          >
            ดูสินค้าทั้งหมด
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    </section>
  );
}