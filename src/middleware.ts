import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

interface Payload extends JWTPayload {
  id: string;
}
const decryptToken = async (token: string): Promise<Payload | null> => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload as Payload;
  } catch (error) {
    return null;
  }
};
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const response = NextResponse.next();
  if (!token) return response;
  const payload = await decryptToken(token);
  const isTokenExpired = payload?.exp && payload.exp < Date.now() / 1000;

  if (!payload || isTokenExpired) {
    response.cookies.delete("token");
    return response;
  }

  response.headers.set("x-user-id", payload.id);
  return response;
}

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*"],
};
