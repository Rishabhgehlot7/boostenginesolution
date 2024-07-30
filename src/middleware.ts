import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/user/:path*",
    "/cart/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated
  if (token) {
    const userRole = token.role;

    // Redirect authenticated users away from auth pages
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access to all routes for admin users
    if (userRole === "admin" || userRole === "employee") {
      return NextResponse.next();
    }

    // Restrict access to admin routes for non-admin users
    if (url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access for authenticated users to other routes
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access restricted routes
  if (
    url.pathname === "/" ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/cart") ||
    url.pathname.startsWith("/user")
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to public routes
  return NextResponse.next();
}
