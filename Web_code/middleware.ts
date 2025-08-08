import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const userRole = req.nextauth.token?.role;

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      userRole !== "ADMIN" // بدون تعديل الحالة
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/trips/:path*",
    "/reservations/:path*",
    "/properties/:path*",
    "/favorites/:path*",
    "/admin/:path*",
  ],
};
