"use client";

import Form from "next/form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Save, KeyRound, ShieldCheck, UserCog } from "lucide-react";

type UserEditData = {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
  tel: string | null;
  address: string | null;
  role: "Customer" | "Admin";
  status: "Active" | "Banned";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left: Profile summary */}
      <div className="flex flex-col gap-5">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage src={user.picture ?? undefined} />
              <AvatarFallback className="text-2xl">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{user.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                {role}
              </Badge>
              <Badge
                className={
                  status === "Active"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100"
                }
              >
                {status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Role & Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                <ShieldCheck size={14} className="text-blue-600" />
              </div>
              Role & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              * Changes will be saved with the main form below
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right: Forms */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Info form */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-blue-50 flex items-center justify-center">
                <UserCog size={14} className="text-blue-600" />
              </div>
              User Information
            </CardTitle>
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
                  {infoErrors?.name && <ErrorMessage error={infoErrors.name[0]} />}
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
                  {infoErrors?.email && <ErrorMessage error={infoErrors.email[0]} />}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <InputForm
                  label="Phone"
                  id="tel"
                  defaultValue={user.tel ?? ""}
                  placeholder="0812345678"
                />
                {infoErrors?.tel && <ErrorMessage error={infoErrors.tel[0]} />}
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
                {infoErrors?.address && <ErrorMessage error={infoErrors.address[0]} />}
              </div>

              <div className="flex justify-end pt-2">
                <SubmitBtn
                  name="Save Changes"
                  icon={Save}
                  pending={infoIsPending}
                />
              </div>
            </CardContent>
          </Form>
        </Card>

        {/* Reset password form */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="size-7 rounded-md bg-amber-50 flex items-center justify-center">
                <KeyRound size={14} className="text-amber-600" />
              </div>
              Reset Password
            </CardTitle>
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
                  {pwErrors?.newPassword && <ErrorMessage error={pwErrors.newPassword[0]} />}
                </div>

                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Confirm New Password"
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {pwErrors?.confirmPassword && <ErrorMessage error={pwErrors.confirmPassword[0]} />}
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