import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // Check for the session cookie
    const session = request.cookies.get("__session");

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect /login to /dashboard if already logged in
    if (request.nextUrl.pathname === "/login") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
