'use client'

import Link from "next/link"
import { useSidebar } from "@/providers/SidebarProvider"
import { UserType } from "@/types/user"
import { ScrollArea } from "../../ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar"
import SidebarLink from "./sidebar-link"
import { usePathname } from "next/navigation"
import { useSignout } from "@/hooks/use-sign-out"
import {
  LogOut,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  FolderTree,
  ClipboardList,
} from "lucide-react"

interface SidebarAdminProps {
  user: UserType
}

export default function SidebarAdmin({ user }: SidebarAdminProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const { isPending, handleSignout } = useSignout()
  const pathname = usePathname()

  const sidebarLinks = [
    { href: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { href: "/admin/products", icon: <ShoppingCart size={18} />, label: "Products" },
    { href: "/admin/categories", icon: <FolderTree size={18} />, label: "Categories" },
    { href: "/admin/orders", icon: <ClipboardList size={18} />, label: "Orders" },
  ]

  return (
    <div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-svh w-[240px] flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        bg-white border-r border-slate-200`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-600">
              <span className="text-xs font-black text-white">A</span>
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">
              AdminPanel
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="md:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="px-3 py-4">

              {/* User profile */}
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                    {user.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Label */}
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-400 px-2 mb-1.5">
                Menu
              </p>

              <nav className="space-y-0.5">
                {sidebarLinks.map((link, index) => (
                  <SidebarLink
                    key={index}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname === link.href}
                    onClose={toggleSidebar}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={handleSignout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 disabled:opacity-40"
          >
            <LogOut size={16} />
            <span>{isPending ? "Logging out…" : "Log Out"}</span>
          </button>
        </div>
      </aside>
    </div>
  )
}