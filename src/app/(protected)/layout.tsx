import HeaderCustomer from "@/components/customer-page/headers/header";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: MainLayoutProps) {
  const user = await authCheck();

  if (!user || user.status !== "Active") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-svh flex flex-col">
      <HeaderCustomer user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
}