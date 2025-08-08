import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const userRole = req.nextauth.token?.role;
    if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url)); // رجع المستخدم للصفحة الرئيسية
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // يسمح بالدخول إذا فيه جلسة
    },
  }
);

export const config = {
  matcher: [
    "/trips/:path*",
    "/reservations/:path*",
    "/properties/:path*",
    "/favorites/:path*",
    "/admin/:path*", // إضافة حماية لمسار الأدمن
  ],
};
