import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? "admin_session";
  const COOKIE_VALUE = process.env.ADMIN_COOKIE_VALUE ?? "ok";

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isAdminPath) return NextResponse.next();

  // allow login page always
  if (isLoginPage) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  if (cookie !== COOKIE_VALUE) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ให้ middleware ทำงานเฉพาะ /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
