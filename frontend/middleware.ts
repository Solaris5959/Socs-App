import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Read token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Redirect if trying to access protected route without token
  if (isProtected && !token) {
    console.log("Redirecting to login page due to missing token");

    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
