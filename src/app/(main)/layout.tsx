import { authCheck } from "@/features/auths/db/auths";
import HeaderCustomer from "@/components/customer-page/header/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await authCheck();

  return (
    <div className="min-h-svh flex flex-col">
      <HeaderCustomer user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
}