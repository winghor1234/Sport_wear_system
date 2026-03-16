// import { prisma } from "@/lib/prisma"
// import { comparePassword, hashPassword } from "@/utils/password"
// import { signAccessToken, signRefreshToken } from "@/utils/jwt"
// import { otpService } from "./otp.service"
// import { sendOTPEmail } from "@/utils/email"



// export const authService = {

//     async login(email: string, password: string) {

//         const user = await prisma.customer.findUnique({
//             where: { email }
//         })

//         if (!user) throw new Error("User not found")

//         const valid = await comparePassword(password, user.password)

//         if (!valid) throw new Error("Invalid password")

//         const accessToken = signAccessToken({
//             user_id: user.customer_id,
//             role: "CUSTOMER"
//         })

//         const refreshToken = signRefreshToken({
//             user_id: user.customer_id
//         })

//         await prisma.refreshToken.create({
//             data: {
//                 token: refreshToken,
//                 user_id: user.customer_id,
//                 role: "CUSTOMER",
//                 expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//             }
//         })

//         return { accessToken, refreshToken }

//     },

//     async forgotPassword(email: string) {

//         const user = await prisma.customer.findUnique({
//             where: { email }
//         })

//         if (!user) throw new Error("User not found")

//         const otp = otpService.generateOTP()

//         await otpService.saveOTP(email, otp)

//         await sendOTPEmail(email, otp)

//     },

//     async verifyOTP(email: string, otp: string) {

//         await otpService.verifyOTP(email, otp)

//         return { message: "OTP verified" }

//     },

//     async resetPassword(email: string, otp: string, newPassword: string) {

//         await otpService.verifyOTP(email, otp)

//         const hashed = await hashPassword(newPassword)

//         await prisma.customer.update({
//             where: { email },
//             data: { password: hashed }
//         })

//     },

//     async refreshToken(refreshToken: string) {

//         const record = await prisma.refreshToken.findUnique({
//             where: { token: refreshToken }
//         })

//         if (!record) throw new Error("Invalid refresh token")

//         const accessToken = signAccessToken({
//             user_id: record.user_id,
//             role: record.role
//         })

//         return { accessToken }

//     },

//     async logout(refreshToken: string) {

//         await prisma.refreshToken.deleteMany({
//             where: { token: refreshToken }
//         })

//     }

// }


import { prisma } from "@/lib/prisma"
import { signAccessToken, signRefreshToken } from "@/utils/jwt"
import { comparePassword, hashPassword } from "@/utils/password"
import { otpService } from "./otp.service"
import { sendOTPEmail } from "@/utils/email"
import { EmployeeLoginInput, LoginInput, RegisterInput } from "./auth.type"

export const authService = {

    // CUSTOMER REGISTER
    async customerRegister(data: RegisterInput) {

        const existingUser = await prisma.customer.findUnique({
            where: { email: data.email, phone: data.phone }
        })
        if (existingUser) {
            throw new Error("User already exists")
        }
        const hashed = await hashPassword(data.password)
        const user = await prisma.customer.create({
            data: {
                customer_name: data.customer_name,
                email: data.email,
                phone: data.phone,
                password: hashed
            }
        })

        const accessToken = signAccessToken({
            user_id: user.customer_id,
            role: "CUSTOMER"
        })

        const refreshToken = signRefreshToken({
            user_id: user.customer_id
        })

        return { user, accessToken, refreshToken }

    },

    // CUSTOMER LOGIN
    async customerLogin(data: LoginInput) {

        const user = await prisma.customer.findUnique({
            where: { email: data.email }
        })

        if (!user) throw new Error("Customer not found")

        const valid = await comparePassword(data.password, user.password)

        if (!valid) throw new Error("Invalid password")

        const accessToken = signAccessToken({
            user_id: user.customer_id,
            role: "CUSTOMER"
        })

        const refreshToken = signRefreshToken({
            user_id: user.customer_id
        })

        return {
            user,
            accessToken,
            refreshToken
        }

    },

    // EMPLOYEE LOGIN
    async employeeLogin(data: EmployeeLoginInput) {

        const employee = await prisma.employee.findUnique({
            where: { email: data.email }
        })

        if (!employee) throw new Error("Employee not found")

        const valid = await comparePassword(data.password, employee.password)

        if (!valid) throw new Error("Invalid password")

        const accessToken = signAccessToken({
            user_id: employee.employee_id,
            role: employee.role
        })

        const refreshToken = signRefreshToken({
            user_id: employee.employee_id
        })

        return {
            employee,
            accessToken,
            refreshToken
        }

    },
    // FORGOT PASSWORD
    async forgotPassword(email: string) {

        const user = await prisma.customer.findUnique({
            where: { email }
        })

        if (!user) throw new Error("User not found")

        const otp = otpService.generateOTP()

        await otpService.saveOTP(email, otp)

        await sendOTPEmail(email, otp)

    },

    // VERIFY OTP
    async verifyOTP(email: string, otp: string) {

        await otpService.verifyOTP(email, otp)

        return { message: "OTP verified" }

    },

    // RESET PASSWORD
    async resetPassword(email: string, otp: string, newPassword: string) {

        await otpService.verifyOTP(email, otp)

        const hashed = await hashPassword(newPassword)

        await prisma.customer.update({
            where: { email },
            data: { password: hashed }
        })

    }

}