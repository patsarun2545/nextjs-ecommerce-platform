import Link from "next/link"

interface AuthFooterProps {
  type: 'signup' | 'signin'
}

const authTextMap = {
  signup: { footerText: 'มีบัญชีแล้ว?', linkText: 'เข้าสู่ระบบ', linkHref: '/auth/signin' },
  signin: { footerText: 'ยังไม่มีบัญชี?', linkText: 'สมัครสมาชิก', linkHref: '/auth/signup' }
}

export default function AuthFooter({ type }: AuthFooterProps) {
  const { footerText, linkText, linkHref } = authTextMap[type]
  return (
    <div className="text-center">
      <p className="text-accent-foreground">
        {footerText}{' '}
        <Link href={linkHref} className="text-primary hover:underline">
          {linkText}
        </Link>
      </p>
    </div>
  )
}