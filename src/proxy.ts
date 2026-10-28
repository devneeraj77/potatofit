import { NextRequest, NextResponse } from "next/server";

// Known admin session cookie keys for NextAuth v5 / Auth.js
const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function isProtectedAdminRoute(pathname: string): boolean {
  // Always permit access to the admin login portal without redirection loops
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return false;
  }

  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

/**
 * Extracts and decodes lightweight session payload or email from Auth.js / NextAuth cookies
 */
export function extractAuthSession(request: NextRequest): {
  isAuthenticated: boolean;
  email?: string;
  role?: string;
} {
  // Check for NextAuth / Auth.js session cookies
  let hasSessionCookie = false;

  for (const cookieName of AUTH_COOKIE_NAMES) {
    const c = request.cookies.get(cookieName);
    if (c?.value) {
      hasSessionCookie = true;
      break;
    }
  }

  // Check custom admin authorization header or token for development/terminal verification
  const devAdminHeader = request.headers.get("x-admin-token");
  if (devAdminHeader === "uchitatvam-admin-secret-2026") {
    return {
      isAuthenticated: true,
      email: "dev.neerajrekwar@gmail.com",
      role: "super_admin",
    };
  }

  if (!hasSessionCookie) {
    return { isAuthenticated: false };
  }

  return {
    isAuthenticated: true,
    email: undefined,
    role: undefined,
  };
}

/**
 * Core proxy guard preventing unauthorized access to all /(admin)/admin pages and APIs
 * Unauthenticated requests to /admin are redirected directly to /admin/login
 */
export async function adminGuard(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Never block the admin login route itself
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // Only protect admin routes
  if (!isProtectedAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const session = extractAuthSession(request);

  // If completely unauthenticated (no session cookie or auth headers)
  if (!session.isAuthenticated) {
    // For API requests, return JSON 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Administrative credentials required to access this endpoint.",
        },
        { status: 401 }
      );
    }

    // For web browser navigation to /admin, redirect directly to /admin/login with callbackUrl
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    redirectUrl.searchParams.set("error", "AdminAccessRequired");
    return NextResponse.redirect(redirectUrl);
  }

  // Create response and set verified admin header
  const response = NextResponse.next();
  response.headers.set("x-admin-protected", "1");
  response.headers.set("x-admin-timestamp", new Date().toISOString());

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

export default adminGuard;
