import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const userEmail = req.nextauth.token?.email;

    // السماح فقط لهذا الإيميل بالدخول على صفحات /admin
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      userEmail !== "ahmed.alnjjar40@gmail.com"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // لازم يكون مسجل دخول
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
