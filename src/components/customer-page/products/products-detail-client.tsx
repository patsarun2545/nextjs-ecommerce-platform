"use client";

import { useState } from "react";
import AddToCartButton from "@/features/carts/components/add-to-cart-button";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, Truck, RotateCcw, Star, Tag,
  Package, ChevronLeft, ChevronRight, Share2,
  Heart, BadgeCheck, Minus, Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductImage { id: string; url: string; isMain: boolean; }

interface ProductDetailClientProps {
  product: {
    id: string; title: string; description: string | null;
    price: number; basePrice: number; stock: number; lowStock: number;
    sku: string; sold: number;
    category?: { id: string; name: string } | null;
    mainImage?: { url: string; fileId: string } | null;
    images: ProductImage[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImg, setActiveImg] = useState(Math.max(0, product.images.findIndex(img => img.isMain)));
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [copied, setCopied] = useState(false);

  const images: ProductImage[] = product.images.length > 0
    ? product.images
    : [{ id: "placeholder", url: "/images/no-product.png", isMain: true }];

  const discount = product.basePrice > product.price
    ? Math.round(((product.basePrice - product.price) / product.basePrice) * 100) : 0;
  const savings = product.basePrice - product.price;

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stockInfo =
    product.stock <= 0 ? { label: "สินค้าหมด", cls: "text-red-600 bg-red-50 border-red-200" }
      : product.stock <= product.lowStock ? { label: `เหลือ ${product.stock} ชิ้น`, cls: "text-amber-600 bg-amber-50 border-amber-200" }
        : { label: "พร้อมส่ง", cls: "text-green-700 bg-green-50 border-green-200" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

      {/* ── Images ── */}
      <div className="flex flex-col gap-3">
        {/* Main */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm group">
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md">
              <Tag size={11} /> -{discount}%
            </div>
          )}
          <button
            onClick={() => setWishlist(!wishlist)}
            className={cn(
              "absolute top-3 right-3 z-20 size-8 flex items-center justify-center rounded-xl border transition-all duration-150",
              wishlist ? "bg-red-50 border-red-300 text-red-500" : "bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400"
            )}
          >
            <Heart size={14} className={wishlist ? "fill-current" : ""} />
          </button>

          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
            <Image src={images[activeImg]?.url || "/images/no-product.png"} alt={product.title} fill className="object-cover" priority />
          </div>

          {images.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 size-8 flex items-center justify-center rounded-xl bg-white/90 border border-slate-200 shadow hover:bg-white transition-colors">
                <ChevronLeft size={14} className="text-slate-600" />
              </button>
              <button onClick={nextImg} className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 size-8 flex items-center justify-center rounded-xl bg-white/90 border border-slate-200 shadow hover:bg-white transition-colors">
                <ChevronRight size={14} className="text-slate-600" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={cn("rounded-full transition-all duration-200", i === activeImg ? "w-4 h-1.5 bg-blue-600" : "size-1.5 bg-black/20 hover:bg-black/40")} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setActiveImg(i)}
                className={cn("relative size-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                  i === activeImg ? "border-blue-600 shadow-md shadow-blue-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-300"
                )}>
                <Image src={img.url} alt={`${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-5">

        {/* Category + SKU */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.category && (
            <Link href={`/products?category=${product.category.name}`}
              className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
              {product.category.name}
            </Link>
          )}
          <span className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            SKU: {product.sku}
          </span>
        </div>

        {/* Title + Rating */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">{product.title}</h1>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={12} className={s <= 4 ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">4.0</span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-sm text-slate-400">ขายแล้ว <span className="font-semibold text-slate-600">{product.sold.toLocaleString()}</span> ชิ้น</span>
          </div>
        </div>

        {/* Price */}
        <div className="p-4 rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
            {product.basePrice > product.price && (
              <span className="text-blue-200 line-through text-base mb-0.5">{formatPrice(product.basePrice)}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="inline-block mt-1.5 px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold">
              ประหยัด {formatPrice(savings)} ({discount}%)
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2.5">
          <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold", stockInfo.cls)}>
            <Package size={13} />{stockInfo.label}
          </span>
          {product.stock > product.lowStock && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <BadgeCheck size={13} className="text-blue-400" />จัดส่งทันที
            </span>
          )}
        </div>

        {/* Qty + CTA */}
        {product.stock > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">จำนวน</span>
              <div className="flex items-center rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  className="px-3.5 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center font-bold text-slate-800 text-sm border-x border-slate-200 py-2">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}
                  className="px-3.5 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Plus size={13} />
                </button>
              </div>
              <span className="text-xs text-slate-400">สูงสุด {product.stock} ชิ้น</span>
            </div>

            <div className="flex gap-2.5">
              <AddToCartButton
                productId={product.id}
                stock={product.stock}
                quantity={qty}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 border-0 transition-colors"
              />
              <button onClick={handleShare}
                className={cn("size-11 flex items-center justify-center rounded-xl border-2 transition-all duration-150 shrink-0",
                  copied ? "border-green-400 bg-green-50 text-green-600" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                )}>
                <Share2 size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: ShieldCheck, label: "รับประกัน", sub: "1 ปีเต็ม", bg: "bg-blue-50 text-blue-600" },
            { icon: Truck, label: "จัดส่ง", sub: "รวดเร็ว", bg: "bg-indigo-50 text-indigo-600" },
            { icon: RotateCcw, label: "คืนสินค้า", sub: "7 วัน", bg: "bg-violet-50 text-violet-600" },
          ].map(({ icon: Icon, label, sub, bg }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-center">
              <div className={cn("size-8 rounded-lg flex items-center justify-center", bg)}>
                <Icon size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-2.5">รายละเอียดสินค้า</h3>
            <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}