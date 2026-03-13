import type { Metadata } from "next"
import AuthHeader from "@/features/auths/components/auth-header"
import AuthForm from "@/features/auths/components/auth-form"

export const metadata: Metadata = {
  title: 'สมัครสมาชิก',
  description:
    'ร้านค่าออไลน์อันดับ 1'
}

export default function SignUpPage() {

  const type = 'signup'

  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  )
}