import DashboardClient from "@/features/dashboard/components/dashboard-all";
import { getDashboardStats } from "@/features/dashboard/db/dashboard";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  if (!stats) {
    redirect("/");
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your store performance
          </p>
        </div>
      </div>

      <DashboardClient stats={stats} />
    </div>
  );
}