import { NextResponse } from "next/server";
import NextAuth from "next-auth";

const { auth } = NextAuth({
  providers: [],
  session: {
    strategy: "jwt",
  },
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isLoggedIn && (isPublicRoute || req.nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/accounts/:path*", "/dashboard", "/auth/:path*"],
};
