"use client";

// app/my-orders/my-orders-client.tsx
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, ChevronRight, Package, Truck, CheckCircle2,
  XCircle, Clock, CreditCard, Search, X, Hash,
} from "lucide-react";

type OrderStatus = "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem {
  id: string; quantity: number; price: number; totalPirce: number;
  productTitle: string; productImage: string | null; productId: string;
}
interface Order {
  id: string; orderNumber: string; totalAmount: number; shippingFee: number;
  status: OrderStatus; createdAtFormatted: string; totalItems: number; items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; cls: string; step: number }> = {
  Pending:   { label: "รอชำระเงิน",  icon: Clock,        cls: "text-amber-600 bg-amber-50 border-amber-200",   step: 0 },
  Paid:      { label: "ชำระแล้ว",    icon: CreditCard,   cls: "text-blue-600 bg-blue-50 border-blue-200",       step: 1 },
  Shipped:   { label: "จัดส่งแล้ว",  icon: Truck,        cls: "text-indigo-600 bg-indigo-50 border-indigo-200", step: 2 },
  Delivered: { label: "ได้รับแล้ว",  icon: CheckCircle2, cls: "text-green-600 bg-green-50 border-green-200",    step: 3 },
  Cancelled: { label: "ยกเลิกแล้ว", icon: XCircle,      cls: "text-red-500 bg-red-50 border-red-200",          step: -1 },
};

const STATUS_FILTERS = [
  { label: "ทั้งหมด",     value: "all" },
  { label: "รอชำระ",      value: "Pending" },
  { label: "ชำระแล้ว",   value: "Paid" },
  { label: "จัดส่งแล้ว", value: "Shipped" },
  { label: "ได้รับแล้ว", value: "Delivered" },
  { label: "ยกเลิก",     value: "Cancelled" },
];

const STEPS = [
  { label: "รอชำระ",     icon: Clock },
  { label: "ชำระแล้ว",  icon: CreditCard },
  { label: "จัดส่ง",    icon: Truck },
  { label: "ได้รับแล้ว",icon: CheckCircle2 },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);

export default function MyOrdersClient({ orders }: { orders: Order[] }) {
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchStatus = activeStatus === "all" || o.status === activeStatus;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.productTitle.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const hasFilters = activeStatus !== "all" || !!search;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 py-5">

          {/* Row 1: title + search */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Link href="/" className="hover:text-blue-500 transition-colors">หน้าหลัก</Link>
                <span>/</span>
                <span className="text-slate-700 font-medium">ประวัติการสั่งซื้อ</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold text-slate-900">ประวัติการสั่งซื้อ</h1>
                <span className="text-sm text-slate-400">
                  <span className="font-semibold text-blue-600">{filtered.length}</span> รายการ
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาเลขที่ / ชื่อสินค้า..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: status tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-0.5 scrollbar-none">
            {STATUS_FILTERS.map((f) => {
              const count = f.value === "all"
                ? orders.length
                : orders.filter((o) => o.status === f.value).length;
              const isActive = activeStatus === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveStatus(f.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-500"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-5">

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-500">ตัวกรอง:</span>
            {activeStatus !== "all" && (
              <Chip
                label={STATUS_FILTERS.find((f) => f.value === activeStatus)?.label ?? activeStatus}
                onRemove={() => setActiveStatus("all")}
              />
            )}
            {search && <Chip label={`"${search}"`} onRemove={() => setSearch("")} />}
            <button
              onClick={() => { setActiveStatus("all"); setSearch(""); }}
              className="ml-auto text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
            >
              ล้างทั้งหมด
            </button>
          </div>
        )}

        {/* Order list */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {filtered.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-blue-300" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">ไม่มีคำสั่งซื้อ</h3>
            <p className="text-sm text-slate-400 max-w-xs">ยังไม่มีรายการสั่งซื้อในหมวดนี้</p>
            <button
              onClick={() => { setActiveStatus("all"); setSearch(""); }}
              className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              ดูทั้งหมด
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Order Card ─────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;
  const preview = order.items.slice(0, 3);
  const remaining = order.items.length - 3;
  const currentStep = cfg.step;

  return (
    <Link
      href={`/my-orders/${order.id}`}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/40 transition-all duration-200 overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Hash size={11} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-600 font-mono">{order.orderNumber}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-400">{order.createdAtFormatted}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cfg.cls}`}>
          <Icon size={10} />{cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex gap-3.5 p-3.5">
        {/* Thumbnails */}
        <div className="flex -space-x-2 shrink-0 self-center">
          {preview.map((item) => (
            <div key={item.id} className="size-14 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
              {item.productImage
                ? <img src={item.productImage} alt={item.productTitle} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="size-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <Package size={14} className="text-slate-300" />
                  </div>
              }
            </div>
          ))}
          {remaining > 0 && (
            <div className="size-14 rounded-lg border-2 border-white bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">+{remaining}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <p className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
              {order.items[0]?.productTitle}
              {order.items.length > 1 && (
                <span className="text-slate-400 font-normal text-xs"> +{order.items.length - 1} รายการ</span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{order.totalItems} ชิ้น</p>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-bold text-slate-900">{fmt(order.totalAmount)}</span>
            <span className="text-[10px] text-slate-400">รวมจัดส่ง</span>
          </div>
        </div>

        <div className="self-center shrink-0 hidden sm:block">
          <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Progress steps */}
      {order.status !== "Cancelled" && (
        <div className="px-4 pb-3.5">
          <div className="flex items-start">
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const StepIcon = step.icon;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1 min-w-0">
                    <div className={`size-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      active ? "border-blue-600 bg-blue-600 shadow-sm shadow-blue-300"
                      : done  ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-white"
                    }`}>
                      <StepIcon size={11} className={active ? "text-white" : done ? "text-blue-400" : "text-slate-300"} />
                    </div>
                    <span className={`text-[9px] font-semibold leading-none text-center ${
                      active ? "text-blue-600" : done ? "text-blue-400" : "text-slate-300"
                    }`}>{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mb-3 rounded-full transition-colors ${
                      done && i < currentStep ? "bg-blue-300" : "bg-slate-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Link>
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