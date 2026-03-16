import { authCheck } from "@/features/auths/db/auths"
import { redirect } from "next/navigation"
import HeaderCustomer from "@/components/customer-page/header/header"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await authCheck()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex flex-col justify-center min-h-svh">
      <HeaderCustomer user={null} />
      <main>{children}</main>
    </div>
  )
}