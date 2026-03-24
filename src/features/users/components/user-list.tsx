"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
  role: "Customer" | "Admin";
  status: "Active" | "Banned";
  createdAt: Date;
  _count: { orders: number };
};

interface UserListProps {
  users: UserItem[];
}

export default function UserList({ users }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Users</CardTitle>

        <div className="relative">
          <Search size={16} className="absolute left-2 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">
            <div className="col-span-5 sm:col-span-3">User</div>
            <div className="col-span-3 hidden sm:block">Email</div>
            <div className="col-span-2 hidden sm:block text-center">Role</div>
            <div className="col-span-4 sm:col-span-2 text-center">Status</div>
            <div className="col-span-1 hidden sm:block text-center">Orders</div>
            <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[420px]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                >
                  <div className="col-span-5 sm:col-span-3 flex items-center gap-2 min-w-0 pr-2">
                    <Avatar className="size-7 flex-shrink-0">
                      <AvatarImage src={user.picture ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {(user.name ?? user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate">
                      {user.name ?? "—"}
                    </span>
                  </div>

                  <div className="col-span-3 hidden sm:block text-muted-foreground truncate pr-2">
                    {user.email}
                  </div>

                  <div className="col-span-2 hidden sm:flex justify-center">
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>

                  <div className="col-span-4 sm:col-span-2 flex justify-center">
                    <Badge
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <div className="col-span-1 hidden sm:block text-center text-muted-foreground">
                    {user._count.orders}
                  </div>

                  <div className="col-span-3 sm:col-span-1 text-right">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No users found matching your search
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}