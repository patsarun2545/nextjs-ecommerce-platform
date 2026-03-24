import { authCheck } from "@/features/auths/db/auths";
import ProfileEditForm from "@/components/customer-page/profile/profile-edit-from";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfileEditPage() {
  const user = await authCheck();
  if (!user) redirect("/auth/signin");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">แก้ไขโปรไฟล์</h1>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft size={16} />
            <span>กลับหน้าหลัก</span>
          </Link>
        </Button>
      </div>

      <ProfileEditForm user={user} />
    </div>
  );
}