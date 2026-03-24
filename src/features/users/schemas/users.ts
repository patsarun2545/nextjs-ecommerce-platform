import { z } from "zod";

const SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';
const MIN_PASSWORD_LENGTH = 8;

const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, { message: `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร` })
  .regex(/[A-Z]/, { message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว" })
  .regex(/[a-z]/, { message: "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว" })
  .regex(/[0-9]/, { message: "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว" })
  .regex(new RegExp(`[${SPECIAL_CHARS}]`), {
    message: `รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (${SPECIAL_CHARS})`,
  });

const VALID_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
const isValidEmailDomain = (email: string) => {
  const domain = email?.split("@")[1]?.toLowerCase() ?? "";
  return VALID_DOMAINS.includes(domain);
};

export const adminUpdateUserSchema = z.object({
  name: z.string().min(3, { message: "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร" }).optional().or(z.literal("")),
  email: z
    .string()
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
    .refine(isValidEmailDomain, { message: "โดเมนอีเมลไม่ถูกต้อง" }),
  tel: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  role: z.enum(["Customer", "Admin"], { message: "Role ไม่ถูกต้อง" }),
  status: z.enum(["Active", "Banned"], { message: "Status ไม่ถูกต้อง" }),
});

export const adminResetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export const userUpdateProfileSchema = z.object({
  name: z.string().min(3, { message: "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร" }).optional().or(z.literal("")),
  tel: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
});

export const userUpdateEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
    .refine(isValidEmailDomain, { message: "โดเมนอีเมลไม่ถูกต้อง" }),
  currentPassword: z.string().min(1, { message: "กรุณากรอกรหัสผ่านปัจจุบัน" }),
});

export const userChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "กรุณากรอกรหัสผ่านปัจจุบัน" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });