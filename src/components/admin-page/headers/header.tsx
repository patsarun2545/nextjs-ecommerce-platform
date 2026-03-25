"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import Link from "next/link";
import { useSignout } from "@/hooks/use-sign-out";

interface HeaderAdminProps {
  user: UserType;
}

export default function HeaderAdmin({ user }: HeaderAdminProps) {
  const { toggleSidebar } = useSidebar();
  const { isPending, handleSignout } = useSignout();

  return (
    <header className="fixed top-0 left-0 right-0 md:left-[240px] h-16 z-10 transition-all duration-300
      bg-white border-b border-slate-200">

      <div className="flex h-full items-center justify-between px-5">

        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={19} />
        </button>

        {/* Spacer */}
        <div className="hidden md:block" />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Avatar className="size-7">
                <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-blue-600 text-white text-[11px] font-bold">
                  {user.name?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-slate-700">
                {user.name || "User"}
              </span>
              <svg className="hidden md:block w-3.5 h-3.5 text-slate-400" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 mt-1 rounded-xl border border-slate-200 shadow-lg shadow-slate-200/60 p-1"
          >
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <p className="font-semibold text-sm text-slate-800">{user.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem asChild className="rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer px-3 py-2">
              <Link href={`/admin/users/${user.id}/edit`}>My Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem
              disabled={isPending}
              onClick={handleSignout}
              className="rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer px-3 py-2 font-medium"
            >
              {isPending ? "Logging out…" : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}