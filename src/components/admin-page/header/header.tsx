"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/providers/SidebarProvider";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import Link from "next/link";
import { useSignout } from "@/hooks/use-signout";

interface HeaderAdminProps {
  user: UserType
}

export default function HeaderAdmin({ user }: HeaderAdminProps) {
  const { toggleSidebar } = useSidebar()
  const { isPending, handleSignout } = useSignout()
  return (
    <header className="fixed top-0 inset-x-0 md:left-64 h-16 bg-card border-b border-border z-10 transition-all duration-200">
      <div className="flex h-full items-center justify-between px-4">

        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size='icon'>
              <Avatar>
                <AvatarImage src={user.picture || undefined} alt={user.name || 'User'} />
                <AvatarFallback className="bg-primary text-primary-foreground">{user.name?.slice(0, 2).toUpperCase() || 'US'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link
                href='/profile'
                className='w-full'
              >
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isPending}
              onClick={handleSignout}
              className='cursor-pointer text-destructive hover:!text-destructive/80'>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}