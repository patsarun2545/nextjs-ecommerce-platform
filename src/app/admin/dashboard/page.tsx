import PageHeader from "@/components/admin-page/refactor/page-header"
import DashboardClient from "@/features/dashboard/components/dashboard-all"
import { getDashboardStats } from "@/features/dashboard/db/dashboard"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  if (!stats) redirect("/")

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance"
      />
      <DashboardClient stats={stats} />
    </div>
  )
}