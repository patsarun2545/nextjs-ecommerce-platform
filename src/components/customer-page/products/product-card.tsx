import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/features/carts/components/add-to-cart-button";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.basePrice > product.price
      ? ((product.basePrice - product.price) / product.basePrice) * 100
      : 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative block pt-[100%] bg-slate-50 overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md">
            -{Math.round(discount)}%
          </span>
        )}

        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <Image
            alt={product.title}
            src={product.mainImage?.url || "/images/no-product.png"}
            fill
            className="object-cover"
          />
        </div>

        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-white text-xs font-semibold">
              สินค้าหมด
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug min-h-[36px] group-hover:text-blue-700 transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* Price & Stock */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-lg font-extrabold text-slate-900 leading-none">
              {formatPrice(product.price)}
            </p>
            {product.basePrice > product.price && (
              <p className="text-xs line-through text-slate-400 mt-0.5">
                {formatPrice(product.basePrice)}
              </p>
            )}
          </div>

          {product.stock > 0 ? (
            <span
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold border",
                product.stock <= product.lowStock
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-green-50 text-green-600 border-green-200"
              )}
            >
              {product.stock <= product.lowStock ? "เหลือน้อย" : "พร้อมส่ง"}
            </span>
          ) : (
            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-500 border border-red-200">
              หมด
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <AddToCartButton
          productId={product.id}
          stock={product.stock}
          className="w-full gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-100 border-0 transition-colors duration-150"
        />
      </div>
    </div>
  );
}