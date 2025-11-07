import { NextResponse } from "next/server";

const AUTH_COOKIE = "admin_auth";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const isAuth = request.cookies.get(AUTH_COOKIE)?.value === "1";

  const isAuthPage = pathname === "/signin" || pathname === "/auth/admin/signin";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/users" || pathname.startsWith("/users/");

  if (!isAuth && isAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname + (request.nextUrl.search || ""));
    return NextResponse.redirect(url);
  }

  if (isAuth && isAuthPage) {
    const next = searchParams.get("next");
    return NextResponse.redirect(new URL(next || "/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/auth/admin/signin",
    "/admin/:path*",
    "/users/:path*",
  ],
};


