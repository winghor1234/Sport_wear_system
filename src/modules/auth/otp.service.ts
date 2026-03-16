// import { prisma } from "@/lib/prisma"

// export function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString()
// }

// export async function saveOTP(email: string, otp: string) {

//     await prisma.PasswordOTP.create({
//         data: {
//             email,
//             otp_code: otp,
//             expiresAt: new Date(Date.now() + 5 * 60 * 1000)
//         }
//     })

// }

// export async function verifyOTP(email: string, otp: string) {

//     const record = await prisma.passwordOTP.findFirst({
//         where: {
//             email,
//             otp_code: otp,
//             expiresAt: { gt: new Date() }
//         }
//     })

//     if (!record) {
//         throw new Error("Invalid or expired OTP")
//     }

//     await prisma.passwordOTP.update({
//         where: { otp_id: record.otp_id },
//         data: { verified: true }
//     })

//     return true
// }


import { prisma } from "@/lib/prisma"
export const otpService = {

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString()
    },

    async saveOTP(email: string, otp: string) {

        await prisma.passwordOTP.create({
            data: {
                email,
                otp_code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        })

    },

    async verifyOTP(email: string, otp: string) {

        const record = await prisma.passwordOTP.findFirst({
            where: {
                email,
                otp_code: otp,
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (!record) {
            throw new Error("Invalid or expired OTP")
        }

        await prisma.passwordOTP.update({
            where: { otp_id: record.otp_id },
            data: { verified: true }
        })

        return true

    }

}