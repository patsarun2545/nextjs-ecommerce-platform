"use server";

import { InitialFormState } from "@/types/action";
import { db } from "@/lib/db";
import { compare, genSalt, hash } from "bcrypt";
import { revalidateUserCache } from "@/features/users/db/cache";
import { authCheck } from "@/features/auths/db/auths";
import {
  adminUpdateUserSchema,
  adminResetPasswordSchema,
  userUpdateProfileSchema,
  userUpdateEmailSchema,
  userChangePasswordSchema,
} from "@/features/users/schemas/users";

// ── Admin Actions ────────────────────────────────────────────────────────────

export async function adminUpdateUserAction(
  _prevState: InitialFormState,
  formData: FormData
) {
  const me = await authCheck();
  if (!me || me.role !== "Admin") {
    return { success: false, message: "ไม่มีสิทธิ์เข้าถึง" };
  }

  const userId = formData.get("user-id") as string;
  if (!userId) return { success: false, message: "ไม่พบข้อมูล User" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    tel: formData.get("tel") as string,
    address: formData.get("address") as string,
    role: formData.get("role") as string,
    status: formData.get("status") as string,
  };

  const { success, data, error } = adminUpdateUserSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: error.flatten().fieldErrors,
    };
  }

  // Check duplicate email
  const existing = await db.user.findFirst({
    where: { email: data.email, NOT: { id: userId } },
  });
  if (existing) {
    return { success: false, message: "อีเมลนี้มีผู้ใช้งานแล้ว" };
  }

  await db.user.update({
    where: { id: userId },
    data: {
      name: data.name || null,
      email: data.email,
      tel: data.tel || null,
      address: data.address || null,
      role: data.role,
      status: data.status,
    },
  });

  revalidateUserCache(userId);
  return { success: true, message: "อัพเดทข้อมูลผู้ใช้สำเร็จ" };
}

export async function adminResetPasswordAction(
  _prevState: InitialFormState,
  formData: FormData
) {
  const me = await authCheck();
  if (!me || me.role !== "Admin") {
    return { success: false, message: "ไม่มีสิทธิ์เข้าถึง" };
  }

  const userId = formData.get("user-id") as string;
  if (!userId) return { success: false, message: "ไม่พบข้อมูล User" };

  const raw = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const { success, data, error } = adminResetPasswordSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: error.flatten().fieldErrors,
    };
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(data.newPassword, salt);

  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidateUserCache(userId);
  return { success: true, message: "รีเซ็ตรหัสผ่านสำเร็จ" };
}

// ── User Self-Edit Actions ───────────────────────────────────────────────────

export async function userUpdateProfileAction(
  _prevState: InitialFormState,
  formData: FormData
) {
  const me = await authCheck();
  if (!me) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  const raw = {
    name: formData.get("name") as string,
    tel: formData.get("tel") as string,
    address: formData.get("address") as string,
  };

  const { success, data, error } = userUpdateProfileSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: error.flatten().fieldErrors,
    };
  }

  await db.user.update({
    where: { id: me.id },
    data: {
      name: data.name || null,
      tel: data.tel || null,
      address: data.address || null,
    },
  });

  revalidateUserCache(me.id);
  return { success: true, message: "อัพเดทข้อมูลสำเร็จ" };
}

export async function userUpdateEmailAction(
  _prevState: InitialFormState,
  formData: FormData
) {
  const me = await authCheck();
  if (!me) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  const raw = {
    email: formData.get("email") as string,
    currentPassword: formData.get("currentPassword") as string,
  };

  const { success, data, error } = userUpdateEmailSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: error.flatten().fieldErrors,
    };
  }

  // Verify current password
  const user = await db.user.findUnique({ where: { id: me.id } });
  if (!user) return { success: false, message: "ไม่พบข้อมูลผู้ใช้" };

  const isValid = await compare(data.currentPassword, user.password);
  if (!isValid) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: { currentPassword: ["รหัสผ่านปัจจุบันไม่ถูกต้อง"] },
    };
  }

  // Check duplicate email
  const existing = await db.user.findFirst({
    where: { email: data.email, NOT: { id: me.id } },
  });
  if (existing) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: { email: ["อีเมลนี้มีผู้ใช้งานแล้ว"] },
    };
  }

  await db.user.update({
    where: { id: me.id },
    data: { email: data.email },
  });

  revalidateUserCache(me.id);
  return { success: true, message: "เปลี่ยนอีเมลสำเร็จ" };
}

export async function userChangePasswordAction(
  _prevState: InitialFormState,
  formData: FormData
) {
  const me = await authCheck();
  if (!me) return { success: false, message: "กรุณาเข้าสู่ระบบ" };

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const { success, data, error } = userChangePasswordSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({ where: { id: me.id } });
  if (!user) return { success: false, message: "ไม่พบข้อมูลผู้ใช้" };

  const isValid = await compare(data.currentPassword, user.password);
  if (!isValid) {
    return {
      success: false,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      errors: { currentPassword: ["รหัสผ่านปัจจุบันไม่ถูกต้อง"] },
    };
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(data.newPassword, salt);

  await db.user.update({
    where: { id: me.id },
    data: { password: hashedPassword },
  });

  revalidateUserCache(me.id);
  return { success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" };
}