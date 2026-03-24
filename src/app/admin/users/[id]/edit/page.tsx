import PageHeader from "@/components/admin-page/refactor/page-header"
import UserEditForm from "@/features/users/components/user-edit-form"
import { getUserById } from "@/features/users/db/users"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface AdminUserEditPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params
  const user = await getUserById(id)
  if (!user) notFound()

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title={user.name ?? user.email}
        description="Edit user information and account settings"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${id}`}>
              <ArrowLeft size={16} />
              Back to User
            </Link>
          </Button>
        }
      />
      <UserEditForm user={user} />
    </div>
  )
}