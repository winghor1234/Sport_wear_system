

import { NextRequest, NextResponse } from "next/server"
import { authService } from "./auth.service"
import { sendSuccess, sendError, BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, errorResponse } from "@/utils/response"
import { LoginInput, RegisterInput } from "./auth.type"
import { clearAuthCookies, setAuthCookies } from "@/utils/cookie"
import { verifyAccessToken } from "@/utils/jwt"
import { loginLimiter, otpLimiter } from "@/utils/rateLimiter"

export const authController = {

    async customerRegister(req: NextRequest): Promise<NextResponse> {

        try {
            const body: RegisterInput = await req.json();
            if (!body.email || !body.password) {
                return sendError("Email and password are required", 400);
            }

            const result = await authService.customerRegister(body);
            const { password, ...safeUser } = result.user;
            const response = sendSuccess(safeUser, "User registered successfully");
            setAuthCookies({
                response,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });
            return response;

        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Register failed", 500);
        }

    },

    // async customerLogin(req: NextRequest): Promise<NextResponse> {

    //     try {

    //         const body: LoginInput = await req.json();

    //         if (!body.email || !body.password) {
    //             return sendError("Email and password are required", 400);
    //         }

    //         const result = await authService.customerLogin(body);

    //         // const { password, ...safeUser } = result.user;

    //         const response = sendSuccess(result, "Login successful");

    //         setAuthCookies({
    //             response,
    //             accessToken: result.accessToken,
    //             refreshToken: result.refreshToken
    //         });

    //         return response;

    //     } catch (error) {

    //         if (
    //             error instanceof BadRequestError ||
    //             error instanceof NotFoundError ||
    //             error instanceof ForbiddenError ||
    //             error instanceof UnauthorizedError
    //         ) {
    //             return errorResponse(error.message, error.statusCode);
    //         }

    //         return sendError("Login failed", 500);
    //     }
    // },

    async customerLogin(req: NextRequest): Promise<NextResponse> {

        try {

            const ip = req.headers.get("x-forwarded-for") || "unknown"

            const body = await req.json()

            const key = `${body.email}_${ip}`

            await loginLimiter.consume(key)

            const result = await authService.customerLogin(body)

            const { password, ...safeUser } = result.user

            const response = sendSuccess(safeUser, "Login successful")

            setAuthCookies({
                response,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            })

            return response

        } catch (error) {

            if (error instanceof Error && "remainingPoints" in error) {
                return sendError("Too many login attempts", 429)
            }

            return sendError("Login failed", 401)
        }
    },

    async employeeLogin(req: NextRequest) {

        try {

            const body = await req.json()

            const result = await authService.employeeLogin(
                body.email
            )

            return sendSuccess(result)

        } catch (error) {

            return sendError("Login failed", 500, error)

        }

    },
    // async forgotPassword(req: NextRequest): Promise<NextResponse> {

    //     try {
    //         const body = await req.json();
    //         if (!body.email) {
    //             return sendError("Email is required", 400);
    //         }
    //         await authService.forgotPassword(body.email);
    //         return sendSuccess(null, "OTP sent");
    //     } catch (error) {
    //         if (
    //             error instanceof BadRequestError ||
    //             error instanceof NotFoundError ||
    //             error instanceof ForbiddenError ||
    //             error instanceof UnauthorizedError
    //         ) {
    //             return errorResponse(error.message, error.statusCode);
    //         }
    //         return sendError("Forgot password failed", 500);
    //     }
    // },


    async forgotPassword(req: NextRequest): Promise<NextResponse> {

        try {

            const ip = req.headers.get("x-forwarded-for") || "unknown"

            await otpLimiter.consume(ip)

            const body = await req.json()

            const result = await authService.forgotPassword(body.email)

            return sendSuccess(result, "OTP sent")

        } catch (error) {

            if (error instanceof Error && "remainingPoints" in error) {
                return sendError("Too many login attempts", 429)
            }

            return sendError("Login failed", 401)
        }

    },
    async verifyOTP(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.otp) {
                return sendError("Email and OTP are required", 400);
            }
            await authService.verifyOTP(body.email, body.otp);
            return sendSuccess(null, "OTP verified");
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("OTP verification failed", 500);
        }
    },
    async resetPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.password) {
                return sendError("Email and new password are required", 400);
            }
            await authService.resetPassword(body.email, body.password);
            return sendSuccess(null, "Password reset successful");
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Reset password failed", 500);
        }
    },

    async logout(req: NextRequest): Promise<NextResponse> {

        try {

            const payload = verifyAccessToken(req);

            await authService.logout(payload.user_id);

            const response = sendSuccess(null, "Logout successful");

            clearAuthCookies(response);

            return response;

        } catch (error) {

            return sendError("Logout failed", 500);
        }
    },


    async refresh(req: NextRequest): Promise<NextResponse> {
        try {
            const refreshToken = req.cookies.get("refresh_token")?.value;
            if (!refreshToken) {
                return sendError("Refresh token missing", 401);
            }
            const result = await authService.refreshToken(refreshToken);
            const response = sendSuccess(null, "Token refreshed");
            setAuthCookies({
                response,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });
            return response;
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Refresh failed", 500);
        }
    }


}