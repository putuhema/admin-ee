import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";
import { UserType } from "./db/schema";

type BetterSession = {
  session: Session;
  user: UserType;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectURL = (path: string) => new URL(path, request.url);

  const publicRoutes = ["/sign-up", "/sign-in", "/favicon.ico",
    "/robots.txt"];
  const isPublicRoute = publicRoutes.includes(pathname);

  try {
    const { data: session } = await betterFetch<BetterSession>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    
    if (session) {
      if (pathname === "/dashboard" && session.user.role !== "admin") {
        return NextResponse.redirect(redirectURL("/"));
      }
      if (isPublicRoute) {
        return NextResponse.redirect(redirectURL("/"));
      }
    } else if (!isPublicRoute) {
      return NextResponse.redirect(redirectURL("/sign-in"));
    }

    return NextResponse.next();
  } catch (error) {
    return !isPublicRoute 
      ? NextResponse.redirect(redirectURL("/sign-in"))
      : NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
