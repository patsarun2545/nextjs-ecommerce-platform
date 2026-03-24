import PageHeader from "@/components/admin-page/refactor/page-header"
import UserOrderDetail from "@/features/users/components/user-order-detail"
import { getUserWithOrders } from "@/features/users/db/users"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params
  const targetUser = await getUserWithOrders(id)
  if (!targetUser) notFound()

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title={targetUser.name ?? targetUser.email}
        description="View user details and order history"
        actions={
          <>
            <Button asChild>
              <Link href={`/admin/users/${id}/edit`}>
                <Pencil size={16} />
                Edit
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <ArrowLeft size={16} />
                Back to Users
              </Link>
            </Button>
          </>
        }
      />
      <UserOrderDetail user={targetUser} />
    </div>
  )
}