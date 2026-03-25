"use client";

import Form from "next/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import ErrorMessage from "@/components/shared/error-message";
import { useForm } from "@/hooks/use-form";
import {
  userUpdateProfileAction,
  userUpdateEmailAction,
  userChangePasswordAction,
} from "@/features/users/actions/users";
import {
  Save,
  Mail,
  KeyRound,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { UserType } from "@/types/user";

interface ProfileEditFormProps {
  user: UserType;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const {
    errors: profileErrors,
    formAction: profileFormAction,
    isPending: profileIsPending,
    clearErrors: clearProfileErrors,
  } = useForm(userUpdateProfileAction);

  const {
    errors: emailErrors,
    formAction: emailFormAction,
    isPending: emailIsPending,
    clearErrors: clearEmailErrors,
  } = useForm(userUpdateEmailAction);

  const {
    errors: pwErrors,
    formAction: pwFormAction,
    isPending: pwIsPending,
    clearErrors: clearPwErrors,
  } = useForm(userChangePasswordAction);

  const infoFields = [
    { icon: <Mail size={13} />, label: "อีเมล", value: user.email },
    {
      icon: <Phone size={13} />,
      label: "เบอร์โทรศัพท์",
      value: user.tel ?? "ยังไม่ได้ระบุ",
    },
    {
      icon: <MapPin size={13} />,
      label: "ที่อยู่จัดส่ง",
      value: user.address ?? "ยังไม่ได้ระบุ",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* Left — Profile card (mirrors user-edit-form) */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">

            {/* Avatar + name + badge */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={user.picture ?? undefined} />
                <AvatarFallback className="text-base">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-snug truncate">
                  {user.name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <div className="flex gap-1.5 mt-1.5">
                  <Badge
                    variant={user.role === "Admin" ? "default" : "secondary"}
                    className="text-xs px-2 py-0"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Info fields */}
            <div className="flex flex-col gap-2.5">
              {infoFields.map((field, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-muted-foreground mt-0.5 shrink-0">
                    {field.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground leading-none mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium break-words leading-snug">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Right — Edit forms (2-col span) */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Profile info */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <Form action={profileFormAction} onChange={clearProfileErrors}>
            <CardContent className="flex flex-col gap-4 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="ชื่อผู้ใช้"
                    id="name"
                    defaultValue={user.name ?? ""}
                    placeholder="ชื่อผู้ใช้"
                  />
                  {profileErrors?.name && (
                    <ErrorMessage error={profileErrors.name[0]} />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <InputForm
                    label="เบอร์โทรศัพท์"
                    id="tel"
                    defaultValue={user.tel ?? ""}
                    placeholder="0812345678"
                  />
                  {profileErrors?.tel && (
                    <ErrorMessage error={profileErrors.tel[0]} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
                <textarea
                  id="address"
                  name="address"
                  defaultValue={user.address ?? ""}
                  placeholder="กรุณาระบุที่อยู่จัดส่ง ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
                {profileErrors?.address && (
                  <ErrorMessage error={profileErrors.address[0]} />
                )}
              </div>

              <div className="flex justify-end pt-1">
                <SubmitBtn
                  name="บันทึกข้อมูล"
                  icon={Save}
                  pending={profileIsPending}
                />
              </div>
            </CardContent>
          </Form>
        </Card>

        {/* Change email */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-indigo-50 flex items-center justify-center">
                <Mail size={14} className="text-indigo-600" />
              </div>
              เปลี่ยนอีเมล
            </CardTitle>
          </CardHeader>
          <Form action={emailFormAction} onChange={clearEmailErrors}>
            <CardContent className="flex flex-col gap-4 pt-5">
              <div className="flex flex-col gap-2">
                <InputForm
                  label="อีเมลใหม่"
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="example@gmail.com"
                  required
                />
                {emailErrors?.email && <ErrorMessage error={emailErrors.email[0]} />}
              </div>

              <div className="flex flex-col gap-2">
                <InputForm
                  label="รหัสผ่านปัจจุบัน (เพื่อยืนยันตัวตน)"
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {emailErrors?.currentPassword && (
                  <ErrorMessage error={emailErrors.currentPassword[0]} />
                )}
              </div>

              <Separator />

              <div className="flex justify-end">
                <SubmitBtn
                  name="เปลี่ยนอีเมล"
                  icon={Mail}
                  pending={emailIsPending}
                  className="bg-indigo-600 hover:bg-indigo-700"
                />
              </div>
            </CardContent>
          </Form>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-amber-50 flex items-center justify-center">
                <KeyRound size={14} className="text-amber-600" />
              </div>
              เปลี่ยนรหัสผ่าน
            </CardTitle>
          </CardHeader>
          <Form action={pwFormAction} onChange={clearPwErrors}>
            <CardContent className="flex flex-col gap-4 pt-5">
              <div className="flex flex-col gap-2">
                <InputForm
                  label="รหัสผ่านปัจจุบัน"
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {pwErrors?.currentPassword && (
                  <ErrorMessage error={pwErrors.currentPassword[0]} />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="รหัสผ่านใหม่"
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {pwErrors?.newPassword && (
                    <ErrorMessage error={pwErrors.newPassword[0]} />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <InputForm
                    label="ยืนยันรหัสผ่านใหม่"
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {pwErrors?.confirmPassword && (
                    <ErrorMessage error={pwErrors.confirmPassword[0]} />
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <SubmitBtn
                  name="เปลี่ยนรหัสผ่าน"
                  icon={KeyRound}
                  pending={pwIsPending}
                  className="bg-amber-500 hover:bg-amber-600"
                />
              </div>
            </CardContent>
          </Form>
        </Card>

      </div>
    </div>
  );
}