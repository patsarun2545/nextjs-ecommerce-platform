import { authCheck } from "@/features/auths/db/auths";
import { getUserById } from "@/features/users/db/users";
import UserEditForm from "@/features/users/components/user-edit-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

interface AdminUserEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const me = await authCheck();
  if (!me || me.role !== "Admin") redirect("/");

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">
            {user.name ?? user.email}
          </h1>
          <p className="text-muted-foreground text-sm">
            Edit user information and account settings
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href={`/admin/users/${id}`}>
            <ArrowLeft size={16} />
            <span>Back to User</span>
          </Link>
        </Button>
      </div>

      <UserEditForm user={user} />
    </div>
  );
}