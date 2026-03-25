import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, ShoppingBagIcon, User, ShoppingCart, ClipboardList, Settings, ChevronRight } from "lucide-react"
import { UserType } from "@/types/user"
import { MobileNavLinks } from "./navlinks"
import Link from "next/link"
import { AuthButtons, SignoutButton, UserDropdownAvatar } from "./user-comp"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MobileMenuProps {
  user: UserType | null
  itemCount: number
}

export default function MobileMenu({ user, itemCount }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden' asChild>
        <button className="flex items-center justify-center size-9 rounded-xl hover:bg-blue-50 transition-colors duration-150">
          <Menu size={20} className="text-slate-600" />
        </button>
      </SheetTrigger>

      <SheetContent side='left' className='flex flex-col w-full md:max-w-sm p-0 border-r border-blue-100'>
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-slate-100">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm">
              <ShoppingBagIcon size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Tle Store
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="flex flex-col p-4 gap-3">

            {/* User Card */}
            {user ? (
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 p-4 flex items-center gap-3">
                <UserDropdownAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name || 'ผู้ใช้งาน'}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <AuthButtons />
            )}

            {/* User Links */}
            {user && (
              <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-blue-100">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">โปรไฟล์ของฉัน</span>
                  <ChevronRight size={14} className="text-slate-300 ml-auto" />
                </Link>

                <Link href="/cart" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-blue-100">
                    <ShoppingCart size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">ตะกร้าของฉัน</span>
                  {itemCount > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-blue-100">
                    <ClipboardList size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">ประวัติการสั่งซื้อ</span>
                  <ChevronRight size={14} className="text-slate-300 ml-auto" />
                </Link>
              </div>
            )}

            {/* Nav Links */}
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">เมนูหลัก</p>
              <MobileNavLinks />
            </div>

            {/* Admin */}
            {user?.role === 'Admin' && (
              <Link
                href='/admin'
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                <Settings size={15} />
                หลังบ้าน
              </Link>
            )}

            {/* Sign out */}
            {user && (
              <div className="pt-1">
                <SignoutButton isMobile />
              </div>
            )}

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}