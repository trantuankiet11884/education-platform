import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const teacherRoutes = ["/teacher", "/teacher/dashboard", "/teacher/courses"];
const adminRoutes = ["/admin", "/admin/dashboard", "/admin/users"];
const studentRoutes = ["/dashboard", "/learn"];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isTeacherRoute = teacherRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isStudentRoute = studentRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const firebaseId = request.cookies.get("firebaseId")?.value;

  let userRole: string | undefined;

  if (firebaseId) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        userRole = userData.role;
      } else {
        console.error("Failed to verify user in middleware");
      }
    } catch (error) {
      console.error("Error calling verify API:", error);
    }
  }

  if (!firebaseId && (isTeacherRoute || isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (firebaseId && userRole) {
    if (path === "/dashboard") {
      if (userRole === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url)
        );
      } else if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(
          userRole === "teacher"
            ? "/teacher/dashboard"
            : userRole === "admin"
            ? "/admin/dashboard"
            : "/dashboard",
          request.url
        )
      );
    }

    if (isTeacherRoute && userRole !== "teacher" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(
        new URL(
          userRole === "teacher" ? "/teacher/dashboard" : "/dashboard",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/learn/:path*",
    "/auth/:path*",
  ],
};
