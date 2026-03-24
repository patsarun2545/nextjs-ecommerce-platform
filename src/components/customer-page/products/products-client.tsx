"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import ProductCard from "./product-card";
import {
  Search, ChevronDown, LayoutGrid, LayoutList,
  X, SlidersHorizontal, PackageSearch, ChevronRight,
} from "lucide-react";
import { ProductType } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

const SORT_OPTIONS = [
  { label: "ล่าสุด", value: "newest" },
  { label: "ราคาน้อย → มาก", value: "price_asc" },
  { label: "ราคามาก → น้อย", value: "price_desc" },
  { label: "ขายดีที่สุด", value: "popular" },
];

const PRICE_RANGES = [
  { label: "ต่ำกว่า ฿500", value: "0-500" },
  { label: "฿500 – ฿1,000", value: "500-1000" },
  { label: "฿1,000 – ฿5,000", value: "1000-5000" },
  { label: "฿5,000 – ฿10,000", value: "5000-10000" },
  { label: "มากกว่า ฿10,000", value: "10000-999999" },
];

const STOCK_STATUSES = ["พร้อมส่ง", "เหลือน้อย"];

interface ProductsClientProps {
  products: ProductType[];
  categories: string[];
  searchParams?: {
    category?: string; sort?: string; q?: string; price?: string; status?: string;
  };
}

interface SidebarContentProps {
  categories: string[];
  activeCategory: string;
  activePrice: string | undefined;
  activeStatus: string | undefined;
  onNavigate: (updates: Record<string, string | undefined>) => void;
}

function SidebarContent({
  categories,
  activeCategory,
  activePrice,
  activeStatus,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="space-y-3">
      {/* Categories */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">หมวดหมู่</p>
        </div>
        <ul className="p-2 space-y-0.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <li key={cat}>
                <button
                  onClick={() => onNavigate({ category: cat })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-100 ${isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  {cat}
                  {isActive && <ChevronRight size={12} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ช่วงราคา</p>
        </div>
        <ul className="p-2 space-y-0.5">
          {PRICE_RANGES.map((range) => {
            const isActive = activePrice === range.value;
            return (
              <li key={range.value}>
                <button
                  onClick={() => onNavigate({ price: isActive ? undefined : range.value })}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-100 text-left ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <span className={`size-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isActive ? "border-blue-600 bg-blue-600" : "border-slate-300"
                    }`}>
                    {isActive && <svg viewBox="0 0 8 6" className="size-2"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Stock */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</p>
        </div>
        <ul className="p-2 space-y-0.5">
          {STOCK_STATUSES.map((s) => {
            const isActive = activeStatus === s;
            return (
              <li key={s}>
                <button
                  onClick={() => onNavigate({ status: isActive ? undefined : s })}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-100 text-left ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <span className={`size-3.5 rounded border-2 flex items-center justify-center shrink-0 ${isActive ? "border-blue-600 bg-blue-600" : "border-slate-300"
                    }`}>
                    {isActive && <svg viewBox="0 0 8 6" className="size-2"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  {s}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function ProductsClient({ products, categories, searchParams }: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [gridView, setGridView] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams?.q ?? "");

  const buildUrl = useCallback((updates: Record<string, string | undefined>) => {
    const current = new URLSearchParams();
    if (searchParams?.q) current.set("q", searchParams.q);
    if (searchParams?.category) current.set("category", searchParams.category);
    if (searchParams?.sort) current.set("sort", searchParams.sort);
    if (searchParams?.price) current.set("price", searchParams.price);
    if (searchParams?.status) current.set("status", searchParams.status);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "ทั้งหมด" || val === "newest") current.delete(key);
      else current.set(key, val);
    });
    const qs = current.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const navigate = (updates: Record<string, string | undefined>) =>
    startTransition(() => router.push(buildUrl(updates)));

  const activeCategory = searchParams?.category ?? "ทั้งหมด";
  const activeSort = searchParams?.sort ?? "newest";
  const activePrice = searchParams?.price;
  const activeStatus = searchParams?.status;
  const hasFilters = !!(
    searchParams?.q ||
    (searchParams?.category && searchParams.category !== "ทั้งหมด") ||
    searchParams?.price || searchParams?.status
  );

  const sidebarProps: SidebarContentProps = {
    categories,
    activeCategory,
    activePrice,
    activeStatus,
    onNavigate: navigate,
  };

  return (
    <main className={`min-h-screen bg-slate-50 transition-opacity duration-150 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Link href="/" className="hover:text-blue-500 transition-colors">หน้าหลัก</Link>
                <span>/</span>
                <span className="text-slate-700 font-medium">สินค้าทั้งหมด</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold text-slate-900">สินค้าทั้งหมด</h1>
                <span className="text-sm text-slate-400">
                  {isPending ? "..." : <><span className="font-semibold text-blue-600">{products.length}</span> รายการ</>}
                </span>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); navigate({ q: searchValue }); }} className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              />
              {searchValue && (
                <button type="button" onClick={() => { setSearchValue(""); navigate({ q: undefined }); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={14} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-5">

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-500">ตัวกรอง:</span>
            {searchParams?.q && <Chip label={`"${searchParams.q}"`} onRemove={() => { setSearchValue(""); navigate({ q: undefined }); }} />}
            {searchParams?.category && searchParams.category !== "ทั้งหมด" && <Chip label={searchParams.category} onRemove={() => navigate({ category: undefined })} />}
            {searchParams?.price && <Chip label={PRICE_RANGES.find(r => r.value === searchParams.price)?.label ?? searchParams.price} onRemove={() => navigate({ price: undefined })} />}
            {searchParams?.status && <Chip label={searchParams.status} onRemove={() => navigate({ status: undefined })} />}
            <button onClick={() => { setSearchValue(""); startTransition(() => router.push(pathname)); }} className="ml-auto text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
              ล้างทั้งหมด
            </button>
          </div>
        )}

        <div className="flex gap-5">
          {/* Sidebar */}
          <aside className="hidden lg:block w-48 shrink-0">
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                  <SlidersHorizontal size={13} />
                  ตัวกรอง
                  {hasFilters && <span className="size-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">!</span>}
                </button>
                <div className="relative">
                  <select value={activeSort} onChange={(e) => navigate({ sort: e.target.value })}
                    className="appearance-none pl-3 pr-7 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-0.5 p-1 bg-white border border-slate-200 rounded-lg">
                <button onClick={() => setGridView(true)} className={`p-1.5 rounded-md transition-colors ${gridView ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                  <LayoutGrid size={14} />
                </button>
                <button onClick={() => setGridView(false)} className={`p-1.5 rounded-md transition-colors ${!gridView ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                  <LayoutList size={14} />
                </button>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              gridView ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {products.map((p, i) => <ProductCard key={i} product={p} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {products.map((p, i) => <ListCard key={i} product={p} />)}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <PackageSearch size={24} className="text-blue-300" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-1">ไม่พบสินค้า</h3>
                <p className="text-sm text-slate-400 max-w-xs">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
                <button onClick={() => { setSearchValue(""); startTransition(() => router.push(pathname)); }}
                  className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                  ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative ml-auto w-64 h-full bg-slate-50 shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white sticky top-0">
              <p className="font-bold text-slate-800 text-sm">ตัวกรอง</p>
              <button onClick={() => setMobileSidebarOpen(false)} className="size-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                <X size={13} className="text-slate-500" />
              </button>
            </div>
            <div className="p-3 flex-1"><SidebarContent {...sidebarProps} /></div>
          </div>
        </div>
      )}
    </main>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-medium text-blue-700">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors"><X size={10} /></button>
    </span>
  );
}

function ListCard({ product }: { product: ProductType }) {
  const discount = product.basePrice > product.price
    ? Math.round(((product.basePrice - product.price) / product.basePrice) * 100) : 0;
  return (
    <Link href={`/products/${product.id}`}
      className="group flex gap-3.5 bg-white rounded-xl border border-slate-200 p-3.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/40 transition-all duration-200">
      <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
        {discount > 0 && <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">-{discount}%</span>}
        {product.mainImage?.url
          ? (
            <Image
              src={product.mainImage.url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          )
          : <div className="size-full bg-gradient-to-br from-blue-50 to-slate-100" />}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          {product.category && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{product.category.name}</span>}
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mt-0.5 group-hover:text-blue-700 transition-colors">{product.title}</h3>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-900">฿{product.price.toLocaleString()}</span>
            {product.basePrice > product.price && <span className="text-xs line-through text-slate-400">฿{product.basePrice.toLocaleString()}</span>}
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${product.stock <= 0 ? "bg-red-50 text-red-500 border-red-100"
            : product.stock <= 5 ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-green-50 text-green-600 border-green-100"}`}>
            {product.stock <= 0 ? "หมด" : product.stock <= 5 ? "เหลือน้อย" : "พร้อมส่ง"}
          </span>
        </div>
      </div>
      <div className="self-center shrink-0 hidden sm:block">
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
      </div>
    </Link>
  );
}