"use client";

import Form from "next/form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import ErrorMessage from "@/components/shared/error-message";
import { useForm } from "@/hooks/use-form";
import {
  adminUpdateUserAction,
  adminResetPasswordAction,
} from "@/features/users/actions/users";
import {
  Save,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import formatDate from "@/lib/formatDate";

type UserEditData = {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
  tel: string | null;
  address: string | null;
  role: "Customer" | "Admin";
  status: "Active" | "Banned";
  createdAt: Date;
};

interface UserEditFormProps {
  user: UserEditData;
}

export default function UserEditForm({ user }: UserEditFormProps) {
  const [role, setRole] = useState<string>(user.role);
  const [status, setStatus] = useState<string>(user.status);

  const {
    errors: infoErrors,
    formAction: infoFormAction,
    isPending: infoIsPending,
    clearErrors: clearInfoErrors,
  } = useForm(adminUpdateUserAction);

  const {
    errors: pwErrors,
    formAction: pwFormAction,
    isPending: pwIsPending,
    clearErrors: clearPwErrors,
  } = useForm(adminResetPasswordAction);

  const infoFields = [
    { icon: <Mail size={13} />, label: "Email", value: user.email },
    {
      icon: <Phone size={13} />,
      label: "Phone",
      value: user.tel ?? "Not provided",
    },
    {
      icon: <MapPin size={13} />,
      label: "Address",
      value: user.address ?? "Not provided",
    },
    {
      icon: <Calendar size={13} />,
      label: "Joined",
      value: formatDate(user.createdAt),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* Left — Profile card (mirrors UserOrderDetail) */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">

            {/* Avatar + name + badges */}
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
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <Badge
                    variant={role === "Admin" ? "default" : "secondary"}
                    className="text-xs px-2 py-0"
                  >
                    {role}
                  </Badge>
                  <Badge
                    className={`text-xs px-2 py-0 ${
                      status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {status}
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

            <Separator className="my-4" />

            {/* Role & Status selects — compact, inline with card */}
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium flex items-center gap-1.5">
                <ShieldCheck size={11} />
                Access Control
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Role
                  </Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                * Saved with the main form
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right — Edit forms (2-col span) */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* User Info form */}
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                <UserCog size={14} className="text-blue-600" />
              </div>
              <CardTitle className="text-base">User Information</CardTitle>
            </div>
          </CardHeader>
          <Form action={infoFormAction} onChange={clearInfoErrors}>
            <CardContent className="flex flex-col gap-4 pt-5">
              <input type="hidden" name="user-id" value={user.id} />
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="status" value={status} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Name"
                    id="name"
                    defaultValue={user.name ?? ""}
                    placeholder="Full name"
                  />
                  {infoErrors?.name && (
                    <ErrorMessage error={infoErrors.name[0]} />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Email"
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    placeholder="example@gmail.com"
                    required
                  />
                  {infoErrors?.email && (
                    <ErrorMessage error={infoErrors.email[0]} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <InputForm
                  label="Phone"
                  id="tel"
                  defaultValue={user.tel ?? ""}
                  placeholder="0812345678"
                />
                {infoErrors?.tel && (
                  <ErrorMessage error={infoErrors.tel[0]} />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  defaultValue={user.address ?? ""}
                  placeholder="Shipping address"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
                {infoErrors?.address && (
                  <ErrorMessage error={infoErrors.address[0]} />
                )}
              </div>

              <div className="flex justify-end pt-1">
                <SubmitBtn
                  name="Save Changes"
                  icon={Save}
                  pending={infoIsPending}
                />
              </div>
            </CardContent>
          </Form>
        </Card>

        {/* Reset Password form */}
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-amber-50 flex items-center justify-center">
                <KeyRound size={14} className="text-amber-600" />
              </div>
              <CardTitle className="text-base">Reset Password</CardTitle>
            </div>
          </CardHeader>
          <Form action={pwFormAction} onChange={clearPwErrors}>
            <CardContent className="flex flex-col gap-4 pt-5">
              <input type="hidden" name="user-id" value={user.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="New Password"
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
                    label="Confirm New Password"
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
                  name="Reset Password"
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