'use client'

import Form from "next/form"
import { CardContent, CardFooter } from "@/components/ui/card"
import InputForm from "@/components/shared/input-form"
import SubmitBtn from "@/components/shared/submit-btn"
import AuthFooter from "@/features/auths/components/auth-footer"

interface AuthFormProps {
  type: 'signup' | 'signin'
}

export default function AuthForm({ type }: AuthFormProps) {

  const renderInput = (label: string, id: string, type = 'text', required = false) => (
    <div>
      <InputForm label={label} id={id} type={type} required={required}></InputForm>
    </div>
  )

  return (
    <Form action=''>
      <CardContent className="flex flex-col gap-4">
        {type === 'signup' && renderInput('ชื่อผู้ใช้', 'name')}
        {renderInput('อีเมล', 'email', 'email', true)}
        {renderInput('รหัสผ่าน', 'password', 'password', true)}
        {type === 'signup' && renderInput('ยืนยันรหัสผ่าน', 'confirmPassword', 'password', true)}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6">
        <AuthFooter type={type} />
        <SubmitBtn
          name={type === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          className="w-full" />
      </CardFooter>
    </Form>
  )
}