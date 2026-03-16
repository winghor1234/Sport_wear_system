// import { NextRequest } from "next/server"
// import { authService } from "./auth.service"
// import { sendSuccess, sendError } from "@/utils/response"



// export const authController = {

//     async login(req: NextRequest) {

//         try {

//             const body = await req.json()

//             const result = await authService.login(
//                 body.email,
//                 body.password
//             )

//             return sendSuccess(result)

//         } catch (error) {

//             return sendError("Login failed", 500, error)

//         }

//     },

//     async forgotPassword(req: NextRequest) {

//         try {

//             const body = await req.json()

//             await authService.forgotPassword(body.email)

//             return sendSuccess({
//                 message: "OTP sent to email"
//             })

//         } catch (error) {

//             return sendError("Forgot password failed", 500, error)

//         }

//     },

//     async verifyOTP(req: NextRequest) {

//         try {

//             const body = await req.json()

//             const result = await authService.verifyOTP(
//                 body.email,
//                 body.otp
//             )

//             return sendSuccess(result)

//         } catch (error) {

//             return sendError("OTP verification failed", 500, error)

//         }

//     },

//     async resetPassword(req: NextRequest) {

//         try {

//             const body = await req.json()

//             await authService.resetPassword(
//                 body.email,
//                 body.otp,
//                 body.newPassword
//             )

//             return sendSuccess({
//                 message: "Password reset successful"
//             })

//         } catch (error) {

//             return sendError("Reset password failed", 500, error)

//         }

//     }

// }

import { NextRequest, NextResponse } from "next/server"
import { authService } from "./auth.service"
import { sendSuccess, sendError } from "@/utils/response"
import { setAuthCookies } from "@/lib/cookies"
import { RegisterInput } from "./auth.type"
import { getCookie, setCookie } from "cookies-next"
import { cookieOptions } from "@/utils/cookie"

export const authController = {

    async register(req: NextRequest): Promise<NextResponse> {

        try {
            const body: RegisterInput = await req.json()
            if (!body) {
                return sendError("Email and password are required", 400)
            }


            const result = await authService.customerRegister(body)

            setCookie("access_token", result.accessToken, {
                ...cookieOptions,
                maxAge: 60 * 15
            })

            setCookie("refresh_token", result.refreshToken, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 7
            })
            console.log("access_token : ", getCookie("access_token"))
            console.log("refresh_token : ", getCookie("refresh_token"))
            return sendSuccess(result)

        } catch (error) {
            console.log(error)
            if (error instanceof Error && error.message === "User already exists") {
                return sendError("User already exists", 409, error)
            }
            return sendError("Register failed", 500, error)
        }

    },

    async customerLogin(req: NextRequest) {

        try {
            const body = await req.json()
            if (!body) {
                return sendError("Email and password are required", 400)
            }
            const { user, accessToken, refreshToken } = await authService.customerLogin(body)
            const res = NextResponse.json({ user })
            setAuthCookies({
                req,
                res,
                accessToken,
                refreshToken
            })
            return sendSuccess(user)

        } catch (error) {

            return sendError("Login failed", 500, error)

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
    async forgotPassword(req: NextRequest) {

        try {

            const body = await req.json()

            await authService.forgotPassword(body.email)

            return sendSuccess({
                message: "OTP sent to email"
            })

        } catch (error) {

            return sendError("Forgot password failed", 500, error)

        }

    },
    async verifyOTP(req: NextRequest) {

        try {

            const body = await req.json()

            const result = await authService.verifyOTP(
                body.email,
                body.otp
            )

            return sendSuccess(result)

        } catch (error) {

            return sendError("OTP verification failed", 500, error)

        }

    },
    async resetPassword(req: NextRequest) {

        try {

            const body = await req.json()

            await authService.resetPassword(
                body.email,
                body.otp,
                body.newPassword
            )

            return sendSuccess({
                message: "Password reset successful"
            })

        } catch (error) {

            return sendError("Reset password failed", 500, error)

        }

    }

}