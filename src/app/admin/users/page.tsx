import PageHeader from "@/components/admin-page/refactor/page-header"
import StatBadge from "@/components/admin-page/refactor/stat-badge"
import UserList from "@/features/users/components/user-list"
import { getAllUsers } from "@/features/users/db/users"

export default async function AdminUsersPage() {
  const users = await getAllUsers()
  const activeCount = users.filter((u) => u.status === "Active").length
  const bannedCount = users.filter((u) => u.status === "Banned").length

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all registered users"
        actions={
          <>
            <StatBadge count={users.length} label="Total" color="blue" />
            <StatBadge count={activeCount} label="Active" color="green" />
            <StatBadge count={bannedCount} label="Banned" color="red" />
          </>
        }
      />
      <UserList users={users} />
    </div>
  )
}