// // import { prisma } from "@/lib/prisma"
// // import { CustomerLoginAuthInput, CustomerRegisterInput } from "@/schemas/schema"
// // import bcrypt from "bcryptjs"
// // import { signToken } from "@/utils/jwt"

// // export const customerAuthService = {

// //     async register(data: CustomerRegisterInput) {
// //         const hashedPassword = await bcrypt.hash(data.password, 10)
// //         const customer = await prisma.customer.create({
// //             data: {
// //                 customer_name: data.customer_name,
// //                 phone: data.phone,
// //                 password: hashedPassword,
// //                 email: data.email,
// //                 gender: data.gender,
// //                 address: data.address
// //             }
// //         })

// //         return customer
// //     },

// //     async login(data: CustomerLoginAuthInput) {

// //         const customer = await prisma.customer.findUnique({
// //             where: { phone: data.phone }
// //         })

// //         if (!customer) {
// //             throw new Error("Customer not found")
// //         }

// //         const validPassword = await bcrypt.compare(
// //             data.password,
// //             customer.password
// //         )

// //         if (!validPassword) {
// //             throw new Error("Invalid password")
// //         }

// //         const token = signToken({
// //             user_id: customer.customer_id,
// //             phone: customer.phone,
// //             role: "customer"
// //         })

// //         const { password, ...customerData } = customer

// //         return {
// //             token,
// //             customer: customerData
// //         }

// //     }
// // }


// import { prisma } from "@/lib/prisma"
// import { hashPassword, comparePassword } from "@/utils/password"
// import { signToken } from "@/utils/jwt"
// import crypto from "crypto"
// import {  CustomerLoginInput, CustomerRegisterInput } from "@/schemas/schema"

// export const authService = {

//     async registerCustomer(data: CustomerRegisterInput) {

//         const hashed = await hashPassword(data.password)

//         const customer = await prisma.customer.create({
//             data: {
//                 customer_name: data.customer_name,
//                 phone: data.phone,
//                 password: hashed
//             }
//         })

//         return customer

//     },

//     async loginCustomer(data: CustomerLoginInput) {

//         const customer = await prisma.customer.findUnique({
//             where: { phone: data.phone }
//         })

//         if (!customer) {
//             throw new Error("Customer not found")
//         }

//         const valid = await comparePassword(
//             data.password,
//             customer.password
//         )

//         if (!valid) {
//             throw new Error("Invalid password")
//         }

//         const token = signToken({
//             user_id: customer.customer_id,
//             phone: customer.phone,
//             role: "CUSTOMER"
//         })

//         const { password, ...customerData } = customer

//         return {
//             token,
//             customer: customerData
//         }

//     },

//     async forgotPassword(phone: string) {

//         const customer = await prisma.customer.findUnique({
//             where: { phone }
//         })

//         if (!customer) {
//             throw new Error("Customer not found")
//         }

//         const token = crypto.randomBytes(32).toString("hex")

//         await prisma.customer.update({
//             where: { customer_id: customer.customer_id },
//             data: {
//                 resetToken: token,
//                 resetTokenExp: new Date(Date.now() + 3600000)
//             }
//         })

//         return token

//     },

//     async resetPassword(token: string, newPassword: string) {

//         const customer = await prisma.customer.findFirst({
//             where: {
//                 resetToken: token,
//                 resetTokenExp: {
//                     gt: new Date()
//                 }
//             }
//         })

//         if (!customer) {
//             throw new Error("Invalid or expired token")
//         }

//         const hashed = await hashPassword(newPassword)

//         await prisma.customer.update({
//             where: { customer_id: customer.customer_id },
//             data: {
//                 password: hashed,
//                 resetToken: null,
//                 resetTokenExp: null
//             }
//         })

//         return true

//     }

// }

// import { comparePassword, hashPassword } from "@/utils/password"
// import { signAccessToken, signRefreshToken } from "@/utils/jwt"
// import { generateOTP, saveOTP, verifyOTP } from "./otp.service"
// import { sendOTPEmail } from "@/utils/email"
// import { prisma } from "@/lib/prisma"

// export const authService = {

//     async login(phone: string, password: string) {

//         const user = await prisma.customer.findUnique({
//             where: {
//                 phone: phone
//             }
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
//            where: { email }
//         })

//         if (!user) throw new Error("User not found")

//         const otp = generateOTP()

//         await saveOTP(email, otp)

//         await sendOTPEmail(email, otp)

//     },

//     async verifyOTP(email: string, otp: string) {

//         await verifyOTP(email, otp)

//         return { message: "OTP verified" }

//     },

//     async resetPassword(email: string, otp: string, newPassword: string) {

//         await verifyOTP(email, otp)

//         const hashed = await hashPassword(newPassword)

//         await prisma.customer.update({
//             where: { email },
//             data: { password: hashed }
//         })

//     }

// }