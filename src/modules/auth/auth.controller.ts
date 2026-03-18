

import { NextRequest, NextResponse } from "next/server"
import { authService } from "./auth.service"
import { sendSuccess, sendError, BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, errorResponse } from "@/utils/response"
import { LoginInput, CustomerRegisterInput, EmployeeRegisterInput } from "./auth.type"
import { clearAuthCookies, setAuthCookies } from "@/utils/cookie"
import { verifyAccessToken } from "@/utils/jwt"
import { loginLimiter, otpLimiter } from "@/utils/rateLimiter"

export const authController = {

    async customerRegister(req: NextRequest): Promise<NextResponse> {

        try {
            const body: CustomerRegisterInput = await req.json();
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
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Register failed", 500);
        }

    },

    async customerLogin(req: NextRequest): Promise<NextResponse> {

        try {
            const ip = req.headers.get("x-forwarded-for") || "unknown"
            const body: LoginInput = await req.json()
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
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Login failed", 401)
        }
    },


    // ------------------------------------------------------------------------

    // async customerLogin(req: NextRequest) {

    //     const body = await req.json();

    //     const result = await authService.login(body, "CUSTOMER");

    //     const { password, ...safeUser } = result.user;

    //     const response = sendSuccess(safeUser, "Login successful");

    //     setAuthCookies({
    //         response,
    //         accessToken: result.accessToken,
    //         refreshToken: result.refreshToken
    //     });

    //     return response;
    // },

    // async employeeLogin(req: NextRequest) {

    //     const body = await req.json();

    //     const result = await authService.login(body, "EMPLOYEE");

    //     const { password, ...safeUser } = result.user;

    //     const response = sendSuccess(safeUser, "Login successful");

    //     setAuthCookies({
    //         response,
    //         accessToken: result.accessToken,
    //         refreshToken: result.refreshToken
    //     });

    //     return response;
    // },
    // ------------------------------------------------------------------------

    async customerForgotPassword(req: NextRequest): Promise<NextResponse> {

        try {

            const ip = req.headers.get("x-forwarded-for") || "unknown"

            await otpLimiter.consume(ip)

            const body = await req.json()

            const result = await authService.customerForgotPassword(body.email)

            return sendSuccess(result, "OTP sent")

        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Login failed", 401)
        }

    },
    async customerVerifyOTP(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.otp) {
                return sendError("Email and OTP are required", 400);
            }
            await authService.customerVerifyOTP(body.email, body.otp);
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
    async customerResetPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.password) {
                return sendError("Email and new password are required", 400);
            }
            await authService.customerResetPassword(body.email, body.password);
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

    async customerLogout(req: NextRequest): Promise<NextResponse> {

        try {

            const payload = verifyAccessToken(req);

            await authService.customerLogout(payload.user_id);

            const response = sendSuccess(null, "Logout successful");

            clearAuthCookies(response);

            return response;

        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
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
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Refresh failed", 500);
        }
    },


    // Admin and staff auth-------------------------------------------------------------------------------------------

    async adminRegister(req: NextRequest): Promise<NextResponse> {

        try {
            const body: EmployeeRegisterInput = await req.json();
            if (!body.email || !body.password) {
                return sendError("Email and password are required", 400);
            }
            const result = await authService.adminRegister(body);
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


    async adminLogin(req: NextRequest): Promise<NextResponse> {

        try {
            const ip = req.headers.get("x-forwarded-for") || "unknown"
            const body: LoginInput = await req.json()
            const key = `${body.email}_${ip}`
            await loginLimiter.consume(key)
            const result = await authService.adminLogin(body);
            // const { password, ...safeUser } = result.user;
            const response = sendSuccess(result, "Login successful");
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
            return sendError("Login failed", 500);
        }
    },

    async adminForgotPassword(req: NextRequest): Promise<NextResponse> {

        try {

            const ip = req.headers.get("x-forwarded-for") || "unknown"
            await otpLimiter.consume(ip)
            const body = await req.json()
            const result = await authService.adminForgotPassword(body.email)
            return sendSuccess(result, "OTP sent")

        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Login failed", 401)
        }

    },
    async adminVerifyOTP(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.otp) {
                return sendError("Email and OTP are required", 400);
            }
            await authService.adminVerifyOTP(body.email, body.otp);
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
    async adminResetPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.password) {
                return sendError("Email and new password are required", 400);
            }
            await authService.adminResetPassword(body.email, body.password);
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

    async adminLogout(req: NextRequest): Promise<NextResponse> {

        try {
            const payload = verifyAccessToken(req);
            await authService.adminLogout(payload.user_id);
            const response = sendSuccess(null, "Logout successful");
            clearAuthCookies(response);
            return response;
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return sendError("Logout failed", 500);
        }
    },


    async adminRefresh(req: NextRequest): Promise<NextResponse> {
        try {
            const refreshToken = req.cookies.get("refresh_token")?.value;
            if (!refreshToken) {
                return sendError("Refresh token missing", 401);
            }
            const result = await authService.adminRefreshToken(refreshToken);
            const response = sendSuccess(null, "Token refreshed");
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
            return sendError("Refresh failed", 500);
        }
    },



}