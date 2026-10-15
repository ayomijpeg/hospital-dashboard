import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If logged in and visiting auth pages, redirect to dashboard
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "SUPER_SECRET_LOCAL_DEV_KEY_JWT_2026",
    });
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Only guard /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "SUPER_SECRET_LOCAL_DEV_KEY_JWT_2026",
    });

    // Redirect unauthenticated visitors to login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = ((token.role as string) || "PATIENT").toUpperCase();

    // Boundary 1: Superadmin Only (/dashboard/admin)
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "ADMIN") {
        const deniedUrl = new URL("/dashboard", req.url);
        deniedUrl.searchParams.set("error", "restricted_admin_clearance");
        return NextResponse.redirect(deniedUrl);
      }
    }

    // Boundary 2: Clinician & Superadmin Only (Patient registry, shift scheduling, bill creation)
    const staffOnlyPrefixes = [
      "/dashboard/patients",
      "/dashboard/Schedules",
      "/dashboard/billing/create",
    ];

    const isStaffRoute = staffOnlyPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (isStaffRoute) {
      if (role !== "DOCTOR" && role !== "ADMIN") {
        const deniedUrl = new URL("/dashboard", req.url);
        deniedUrl.searchParams.set("error", "restricted_clinical_clearance");
        return NextResponse.redirect(deniedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
