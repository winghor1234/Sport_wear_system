import { setCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

interface CookieParams {
    req: NextRequest;
    res: NextResponse;
    accessToken: string;
    refreshToken: string;
}

export function setAuthCookies({
    req,
    res,
    accessToken,
    refreshToken
}: CookieParams) {

    setCookie("access_token", accessToken, {
        req,
        res,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 15
    });

    setCookie("refresh_token", refreshToken, {
        req,
        res,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7
    });

}