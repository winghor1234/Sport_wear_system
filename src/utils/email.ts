import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export async function sendOTPEmail(email: string, otp: string) {

    await transporter.sendMail({
        to: email,
        subject: "Password Reset OTP",
        html: `<h2>Your OTP Code: ${otp}</h2>`
    })

}