import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt-edge";
import { ADMIN_TOKEN_COOKIE_NAME } from "@/constants/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow access to admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      const decoded = verifyTokenEdge(token);

      if (!decoded) {
        // Token is invalid or expired, redirect to login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        // Clear invalid cookie
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(ADMIN_TOKEN_COOKIE_NAME);
        return response;
      }

      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Token verification failed, redirect to login
      console.error("Error verifying token in middleware:", error);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_TOKEN_COOKIE_NAME);
      return response;
    }
  }

  // Allow all other routes
  return NextResponse.next();
};
