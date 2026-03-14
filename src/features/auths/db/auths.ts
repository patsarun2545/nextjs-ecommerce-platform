import { signupSchema, signinSchema } from "@/features/auths/schemas/auths";
import { db } from "@/lib/db";
import { genSalt, hash, compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninInput {
  email: string;
  password: string;
}

const generateJwtToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRECT_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
};

const serCookieToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input);
    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }
    const user = await db.user.findUnique({
      where: {
        email: data.email,
        status: "Active",
      },
    });

    if (user) {
      return {
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = await generateJwtToken(newUser.id);

    await serCookieToken(token);
  } catch (error) {
    console.error("Error Sign Up:", error);
    return { message: "เกิดข้อผิดพลาดในการสมัคสมาชิก" };
  }
};

export const signin = async (input: SigninInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);
    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !(await compare(data.password, user.password))) {
      return {
        message: "อีเมลหรือนรหัสผ่านไม่ถูกต้อง",
      };
    }

    if (user.status !== "Active") {
      return {
        message: "บัญชีของคุณถูกระงับ",
      };
    }
    const token = await generateJwtToken(user.id);

    await serCookieToken(token);
  } catch (error) {
    console.error("Error Sign In:", error);
    return { message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
  }
};
