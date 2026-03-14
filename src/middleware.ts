import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const response = NextResponse.next();
  if (!token) return response;
};

export const config = {
  matcher: ["/", "/auth/:path*"],
};
