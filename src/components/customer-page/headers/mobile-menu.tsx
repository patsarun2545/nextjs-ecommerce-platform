import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"

import { Menu, ShoppingBagIcon } from "lucide-react"
import { UserType } from "@/types/user"
import { Separator } from "@/components/ui/separator"
import { MobileNavLinks } from "./navlinks"
import Link from "next/link"
import { UserAvatar, AuthButtons, SignoutButton } from "./user-comp"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MobileMenuProps {
  user: UserType | null
}

export default function MobileMenu({ user }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden' asChild>
        <button className="flex items-center justify-center size-9 rounded-xl hover:bg-blue-50 transition-colors duration-150">
          <Menu size={20} className="text-slate-600" />
        </button>
      </SheetTrigger>

      <SheetContent side='left' className='flex flex-col w-full md:max-w-sm p-0 border-r border-blue-100'>
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-blue-50">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm">
              <ShoppingBagIcon size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Tle Store
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 flex flex-col gap-5 py-5 overflow-hidden'>
          {/* User Profile / Auth */}
          {user ? <UserAvatar user={user} /> : <AuthButtons />}

          <div className='px-4'>
            <Separator className='bg-blue-50' />
          </div>

          {/* Nav Links */}
          <div className='px-4'>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">เมนูหลัก</p>
            <ScrollArea className='h-48 sm:h-60 w-full'>
              <MobileNavLinks />

              {user && user.role === 'Admin' && (
                <div className='mt-3'>
                  <Separator className='mb-3 bg-blue-50' />
                  <Link
                    href='/admin'
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-150 text-sm"
                  >
                    หลังบ้าน
                  </Link>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {user && (
          <SheetFooter className="px-5 pb-6">
            <SignoutButton isMobile />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}