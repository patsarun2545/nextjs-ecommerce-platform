import { UserType } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, ShoppingCart, ClipboardList, Settings } from "lucide-react";
import { SignoutButton, UserAvatarSmall, UserDropdownAvatar } from "./user-comp";

interface DesktopUserMenuProps {
  user: UserType;
  itemCount: number;
}

export default function DesktopUserMenu({ user, itemCount }: DesktopUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border-2 border-blue-100 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-150 ml-2">
          <UserAvatarSmall user={user} />
          <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
            {user.name?.split(' ')[0] || 'บัญชีฉัน'}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 p-2 rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50"
      >
        {/* User Info Header */}
        <div className="flex flex-col items-center gap-2 px-3 py-4 mb-1 rounded-xl bg-gradient-to-b from-blue-50 to-white">
          <UserDropdownAvatar user={user} />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">{user.name || 'ผู้ใช้งาน'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1 bg-blue-50" />

        <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700" asChild>
          <Link href="/profile" className="flex items-center gap-2.5">
            <User size={15} className="text-blue-500" />
            <span className="text-sm font-medium">โปรไฟล์ของฉัน</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700" asChild>
          <Link href="/cart" className="flex items-center gap-2.5">
            <ShoppingCart size={15} className="text-blue-500" />
            <span className="text-sm font-medium">ตะกร้าของฉัน</span>
            {itemCount > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700" asChild>
          <Link href="/my-orders" className="flex items-center gap-2.5">
            <ClipboardList size={15} className="text-blue-500" />
            <span className="text-sm font-medium">ประวัติการสั่งซื้อ</span>
          </Link>
        </DropdownMenuItem>

        {user.role === "Admin" && (
          <>
            <DropdownMenuSeparator className="my-1 bg-blue-50" />
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700" asChild>
              <Link href="/admin" className="flex items-center gap-2.5">
                <Settings size={15} className="text-blue-500" />
                <span className="text-sm font-medium">หลังบ้าน</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="my-1 bg-blue-50" />
        <div className="px-1">
          <SignoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}