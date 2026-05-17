import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/robots.txt",
  "/sitemap(.*)",
  "/api/health",
  "/api/cron(.*)",
]);
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    })
  : function proxy(req: NextRequest) {
      if (isPublicRoute(req)) {
        return NextResponse.next();
      }

      const demoAuth = req.cookies.get("alphaforge-demo-auth")?.value === "1";

      if (!demoAuth) {
        const signUpUrl = new URL("/sign-up", req.url);
        signUpUrl.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);

        return NextResponse.redirect(signUpUrl);
      }

      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
