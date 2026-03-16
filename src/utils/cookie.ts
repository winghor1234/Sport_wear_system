import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET_REFRESH;

interface AuthCookieParams {
    response: NextResponse;
    accessToken: string;
    refreshToken: string;
}

export function setAuthCookies({ response, accessToken, refreshToken }: AuthCookieParams) {
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15 // 15 minutes
    });

    response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 14 // 14 days
    });

}

export function getAuthCookies(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value || null;
    const refreshToken = request.cookies.get("refreshToken")?.value || null;

    return { accessToken, refreshToken };
}


export function clearAuthCookies(response: NextResponse) {
    response.cookies.set("access_token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0)
    });
    response.cookies.set("refresh_token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0)
    });

}

export function generateAccessToken(userId: string, role: string): string {
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    try {
        const token = jwt.sign(
            {
                userId: userId,           // ✅ แค่ userId
                role: role,               // ✅ เพิ่ม role
                type: 'access',           // ✅ ระบุประเภท
                iat: Math.floor(Date.now() / 1000)
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
                algorithm: 'HS256'
            }
        );
        return token;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Error generating access token");
    }
}

export function generateRefreshToken(userId: string): string {
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    try {
        const token = jwt.sign(
            {
                userId,
                type: 'refresh',       // ✅ ระบุประเภท
                iat: Math.floor(Date.now() / 1000)
            },
            REFRESH_TOKEN_SECRET,      // ✅ ใช้ secret คนละตัว!
            {
                expiresIn: "14d",       // ✅ อายุยาว 14 วัน
                algorithm: 'HS256'
            }
        );
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Error generating refresh token");
    }
}

