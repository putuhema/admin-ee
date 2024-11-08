import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/sign-up", "/sign-in"];
  const isPublicRoute = publicRoutes.includes(pathname);

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
