import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";


type AdminPayload = {
  email: string;
  role: "admin";
};

type UserPayload = {
  userId: string;
};


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/**

 *  HELPER GENÉRICO (SEM any)

 */
async function verifyToken<T = JWTPayload>(
  token: string | undefined
): Promise<T | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}

/**
 * 
 *  RESPONSE HELPERS
 * 
 */
function unauthorizedJson() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

/**
 * 
 *  MIDDLEWARE
 * 
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminToken = req.cookies.get("admin_token")?.value;
  const userToken = req.cookies.get("user_token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isApiAdminRoute = pathname.startsWith("/api/admin");

  const isUserProtectedRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/user");

  /**

   * ADMIN FRONT
   
   */
  if (isAdminRoute && pathname !== "/admin/login") {
    const admin = await verifyToken<AdminPayload>(adminToken);

    if (!admin) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    //  ROLE CHECK (PRODUCTION READY)
    if (admin.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    return NextResponse.next();
  }

  /**
 
   *  ADMIN API
  
   */
  if (isApiAdminRoute && pathname !== "/api/admin/login") {
    const admin = await verifyToken<AdminPayload>(adminToken);

    if (!admin) {
      return unauthorizedJson();
    }

    //  ROLE CHECK
    if (admin.role !== "admin") {
      return unauthorizedJson();
    }

    return NextResponse.next();
  }

  /**
   * =========================
   *  USER AREA
   * =========================
   */
  if (isUserProtectedRoute) {
    const user = await verifyToken<UserPayload>(userToken);

    if (!user) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/api/user/:path*",
  ],
};