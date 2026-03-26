import { ArrowRight, ShoppingBag, Sparkles, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZDRlZDgiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2MmgxMHYtMmgtNHptMC0zMFYwaDJWNGgzdjJoLTVWNHptLTEyIDB2NGgtMlYySDkuMzc1QzguMDYyIDIgNyAzLjA2MiA3IDQuMzc1djQyLjI1QzcgNDcuOTM4IDguMDYyIDQ5IDkuMzc1IDQ5SDM2di0ySDkuMzc1QzkuMTY3IDQ3IDkgNDYuODMzIDkgNDYuNjI1VjQuMzc1QzkgNC4xNjcgOS4xNjcgNCA5LjM3NSA0SDI0VjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      <div className="max-w-7xl mx-auto relative px-4 xl:px-0 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
              <Sparkles size={14} className="text-blue-500" />
              <span>ยินดีต้อนรับสู่ Tle Store</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
              ช็อปสินค้าไอที
              <span className="block mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 bg-clip-text text-transparent">
                ราคาคุ้มค่า
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed">
              ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าไอทีครบวงจร
              พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['รับประกัน 1 ปี', 'จัดส่งรวดเร็ว', 'ลดสูงสุด 50%'].map((feat) => (
                <span key={feat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-blue-100 text-slate-600 shadow-sm">
                  <span className="size-1.5 rounded-full bg-blue-500" />
                  {feat}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 shadow-lg shadow-blue-200 group"
              >
                <ShoppingBag size={18} />
                <span>ช็อปเลย</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-blue-100 text-slate-700 font-semibold text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150"
              >
                เกี่ยวกับเรา
              </Link>
            </div>


          </div>

          {/* Right Content */}
          <div className="hidden md:flex items-center justify-center relative">
            {/* Decorative rings */}
            <div className="absolute size-[420px] rounded-full bg-gradient-to-br from-blue-100 to-blue-50" />
            <div className="absolute size-[340px] rounded-full border-2 border-blue-200/60 border-dashed animate-[spin_30s_linear_infinite]" />
            <div className="absolute size-[260px] rounded-full border border-blue-300/40" />

            {/* Product image */}
            <div className="relative z-10 size-[360px] drop-shadow-2xl">
              <Image
                alt="Tech Gadgets"
                src="/images/banner.png"
                fill
                className="object-contain hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute top-8 right-0 flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl shadow-lg border border-blue-50 z-20">
              <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">รับประกัน 1 ปีเต็ม</p>
                <p className="text-[10px] text-slate-500">ทุกสินค้า</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl shadow-lg border border-blue-50 z-20">
              <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                <Zap size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">ลดสูงสุด 50%</p>
                <p className="text-[10px] text-slate-500">ราคาพิเศษวันนี้</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}