import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/utils/jwt"

export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    // Public routes
    const publicRoutes = [
        "/api/auth/customer/login",
        "/api/auth/customer/register",
        "/api/auth/customer/forgot-password",
        "/api/auth/customer/verify-otp",
        "/api/auth/customer/reset-password",
        "/api/auth/employee/login"
    ]

    if (publicRoutes.includes(path)) {
        return NextResponse.next()
    }

    // ถ้ามี access token
    if (accessToken) {

        try {

            verifyAccessToken(accessToken)

            return NextResponse.next()

        } catch { }

    }

    // ถ้า access token หมดอายุ → ใช้ refresh token
    if (refreshToken) {

        try {

            const payload = verifyRefreshToken(refreshToken)

            const newAccessToken = signAccessToken({
                user_id: payload.user_id,
                role: payload.role
            })

            const response = NextResponse.next()

            response.cookies.set("access_token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 15
            })

            return response

        } catch {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )

        }

    }

    return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
    )

}