import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/checkout(.*)",
  "/admin(.*)",
]);

// Routes that are admin-only
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const isDev = process.env.NODE_ENV !== "production";
  const { userId, sessionClaims } = await auth();

  // Protect authenticated routes (in production)
  if (isProtectedRoute(req) && !isDev) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect admin routes via Phone+OTP Admin Session
  if (isAdminRoute(req)) {
    // Allow /admin/login without session
    if (req.nextUrl.pathname === "/admin/login") {
      const adminSession = req.cookies.get("varah_admin_session");
      if (adminSession?.value) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // All other /admin routes require verified Phone+OTP admin session
    const adminSession = req.cookies.get("varah_admin_session");
    if (!adminSession?.value) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
