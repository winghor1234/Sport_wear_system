

import { NextRequest, NextResponse } from "next/server"
import { authService } from "./auth.service"
import { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, errorResponse, successResponse } from "@/utils/response"
import { LoginInput, CustomerRegisterInput, EmployeeRegisterInput } from "./auth.type"
import { clearAuthCookies, setAuthCookies } from "@/utils/cookie"
import { verifyAccessToken } from "@/utils/jwt"
import { loginLimiter, otpLimiter } from "@/utils/rateLimiter"

export const authController = {

    async customerRegister(req: NextRequest): Promise<NextResponse> {

        try {
            const body: CustomerRegisterInput = await req.json();
            if (!body.email || !body.password) {
                throw new BadRequestError("Email and password are required");
            }
            const result = await authService.customerRegister(body);
            const { password, ...safeUser } = result.user;
            const response = successResponse(safeUser, "User registered successfully", 201);
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
            return errorResponse("Internal Server Error", 500)
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
            const response = successResponse(safeUser, "Login successful", 200)
            setAuthCookies({
                response,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            })
            return response
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
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
            return successResponse(result, "OTP sent", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }

    },
    async customerVerifyOTP(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.otp) {
                throw new BadRequestError("Email and OTP are required");
            }
            await authService.customerVerifyOTP(body.email, body.otp);
            return successResponse(null, "OTP verified", 200);
        } catch (error) {
            console.log(error)
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },
    async customerResetPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.password) {
                throw new BadRequestError("Email and new password are required");
            }
            await authService.customerResetPassword(body.email, body.password);
            return successResponse(null, "Password reset successful", 200);
        } catch (error) {
            console.log(error)
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async customerLogout(req: NextRequest): Promise<NextResponse> {
        try {
            const payload = verifyAccessToken(req);
            await authService.customerLogout(payload.user_id);
            const response = successResponse(null, "Logout successful", 200);
            clearAuthCookies(response);
            return response;
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },


    async refresh(req: NextRequest): Promise<NextResponse> {
        try {
            const refreshToken = req.cookies.get("refresh_token")?.value;
            if (!refreshToken) {
                throw new BadRequestError("Refresh token missing");
            }
            const result = await authService.refreshToken(refreshToken);
            const response = successResponse(null, "Token refreshed", 200);
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
            return errorResponse("Internal Server Error", 500)
        }
    },


    // Admin and staff auth-------------------------------------------------------------------------------------------

    async adminRegister(req: NextRequest): Promise<NextResponse> {

        try {
            const body: EmployeeRegisterInput = await req.json();
            if (!body.email || !body.password) {
                throw new BadRequestError("Email and password are required");
            }
            const result = await authService.adminRegister(body);
            const { password, ...safeUser } = result.user;
            const response = successResponse(safeUser, "User registered successfully", 201);
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
            return errorResponse("Internal Server Error", 500)
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
            const response = successResponse(result.user, "Login successful", 200);
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
            return errorResponse("Internal Server Error", 500)
        }
    },

    async adminForgotPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const ip = req.headers.get("x-forwarded-for") || "unknown"
            await otpLimiter.consume(ip)
            const body = await req.json()
            const result = await authService.adminForgotPassword(body.email)
            return successResponse(result, "OTP sent", 200)

        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }

    },
    async adminVerifyOTP(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.otp) {
                throw new BadRequestError("Email and OTP are required");
            }
            await authService.adminVerifyOTP(body.email, body.otp);
            return successResponse(null, "OTP verified", 200);
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },
    async adminResetPassword(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            if (!body.email || !body.password) {
                throw new BadRequestError("Email and new password are required");
            }
            await authService.adminResetPassword(body.email, body.password);
            return successResponse(null, "Password reset successful", 200);
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async adminLogout(req: NextRequest): Promise<NextResponse> {

        try {
            const payload = verifyAccessToken(req);
            await authService.adminLogout(payload.user_id);
            const response = successResponse(null, "Logout successful", 200);
            clearAuthCookies(response);
            return response;
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500);
        }
    },


    async adminRefresh(req: NextRequest): Promise<NextResponse> {
        try {
            const refreshToken = req.cookies.get("refresh_token")?.value;
            if (!refreshToken) {
                throw new BadRequestError("Refresh token missing");
            }
            const result = await authService.adminRefreshToken(refreshToken);
            const response = successResponse(null, "Token refreshed", 200);
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
            return errorResponse("Internal Server Error", 500)
        }
    },



}