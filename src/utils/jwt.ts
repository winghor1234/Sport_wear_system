import jwt, { verify } from "jsonwebtoken"
import { UnauthorizedError } from "./response"
import { NextRequest } from "next/server";

interface JwtPayload {
    user_id: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
}

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export function signAccessToken(payload: object) {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    })
}

export function signRefreshToken(payload: object) {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    })
}

export function verifyAccessToken(req: NextRequest): JwtPayload {

    const token = req.cookies.get("access_token")?.value;

    if (!token) {
        throw new UnauthorizedError("Access token missing");
    }

    try {

        const payload = verify(
            token,
            process.env.JWT_ACCESS_SECRET!
        ) as JwtPayload;

        return payload;

    } catch {

        throw new UnauthorizedError("Invalid or expired token");

    }

}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET)
}