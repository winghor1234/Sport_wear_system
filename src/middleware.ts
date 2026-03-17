import { NextRequest, NextResponse } from "next/server";
import { roleRoutes } from "./config/roleRoutes";
import { JwtPayload } from "./types/jwt";
import { apiLimiter } from "./utils/rateLimiter";
import { jwtVerify } from "jose";


export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    /* ✅ allow auth routes */
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown"
        await apiLimiter.consume(ip)
    } catch {
        return NextResponse.json(
            { message: "Too many requests" },
            { status: 429 }
        )
    }


    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify<JwtPayload>(token, secret);
        const role = payload.role;
        if (role === "ADMIN") {
            return NextResponse.next();
        }
        const allowedRoutes = roleRoutes[role];
        if (!allowedRoutes) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const isAllowed = allowedRoutes.some((route: string) =>
            pathname.startsWith(route)
        );

        if (!isAllowed) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.next();

    } catch (error) {
        console.log("error : ", error)
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        );

    }

}

export const config = {
    matcher: ["/api/:path*"]
};