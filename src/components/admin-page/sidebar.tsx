'use client'

import Link from "next/link"
import { useSidebar } from "@/providers/SidebarProvider"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { UserType } from "@/types/user"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

interface SidebarAdminProps {
  user: UserType
}

export default function SidebarAdmin({ user }: SidebarAdminProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar()

  return (
    <div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-svh bg-card w-64 border-r border-border flex flex-col transition-transform duration-200
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">

          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-2"
          >
            <div className="rounded-md bg-primary p-1">
              <div className="size-6 text-primary-foreground font-bold flex items-center justify-center">
                A
              </div>
            </div>

            <span className="text-xl font-bold">
              Admin
            </span>
          </Link>

          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            className="md:hidden">
            <X size={20} />
          </Button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-128px)] overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4">

              {/* Profile Box */}
              <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.picture || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div>Menu</div>

            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  )
}


