import UserList from "@/features/users/components/user-list";
import { getAllUsers } from "@/features/users/db/users";
import { authCheck } from "@/features/auths/db/auths";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const users = await getAllUsers();

  const activeCount = users.filter((u) => u.status === "Active").length;
  const bannedCount = users.filter((u) => u.status === "Banned").length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage all registered users
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-blue-600">{users.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-green-600">{activeCount}</span>
            Active
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-red-500">{bannedCount}</span>
            Banned
          </Badge>
        </div>
      </div>

      <UserList users={users} />
    </div>
  );
}