import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/", // Landing page
    "/sign-in",
    "/sign-up",
    "/api/auth/signin",
    "/api/auth/signout",
    "/api/auth/callback",
    "/api/auth/session",
    "/api/auth/providers",
    "/api/auth/csrf",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/terms",
    "/privacy",
    "/about",
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow authenticated users to access protected routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
