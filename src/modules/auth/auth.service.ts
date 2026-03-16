


import { prisma } from "@/lib/prisma"
import { signAccessToken, signRefreshToken } from "@/utils/jwt"
import { comparePassword, hashPassword } from "@/utils/password"
import { sendOTPEmail } from "@/utils/email"
import { EmployeeLoginInput, LoginInput, RegisterInput } from "./auth.type"
import { generateAccessToken, generateRefreshToken } from "@/utils/cookie"
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/utils/response"

export const authService = {

    // CUSTOMER REGISTER
    async customerRegister(data: RegisterInput) {

        const existingUser = await prisma.customer.findFirst({
            where: { phone: data.phone }

        });

        if (existingUser) {
            throw new NotFoundError("User already exists")
        }
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.customer.create({
            data: {
                customer_name: data.customer_name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword
            }
        });

        const accessToken = generateAccessToken(user.customer_id, "CUSTOMER");
        const refreshToken = generateRefreshToken(user.customer_id);
        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: user.customer_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new Error("Failed to create refresh token");
        }

        return {
            user,
            accessToken,
            refreshToken
        };

    },
    // CUSTOMER LOGIN
    async customerLogin(data: LoginInput) {

        const user = await prisma.customer.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        /* 🔒 CHECK ACCOUNT LOCK */
        if (user.lockUntil && user.lockUntil > new Date()) {
            throw new ForbiddenError("Account temporarily locked");
        }

        const isPasswordValid = await comparePassword(
            data.password,
            user.password
        );

        /* ❌ PASSWORD WRONG */
        if (!isPasswordValid) {

            const attempts = user.failedLoginAttempts + 1;

            await prisma.customer.update({
                where: { customer_id: user.customer_id },
                data: {
                    failedLoginAttempts: attempts
                }
            });

            if (attempts >= 5) {

                await prisma.customer.update({
                    where: { customer_id: user.customer_id },
                    data: {
                        lockUntil: new Date(Date.now() + 15 * 60 * 1000)
                    }
                });

                throw new ForbiddenError("Account locked for 15 minutes");
            }

            throw new UnauthorizedError("Invalid email or password");
        }

        /* ✅ LOGIN SUCCESS → RESET ATTEMPTS */

        await prisma.customer.update({
            where: { customer_id: user.customer_id },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null
            }
        });

        const accessToken = generateAccessToken(user.customer_id, "CUSTOMER");
        const refreshToken = generateRefreshToken(user.customer_id);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: user.customer_id
                    }
                }
            }
        });

        return {
            user,
            accessToken,
            refreshToken
        };

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
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.oTP.create({
            data: {
                email,
                otp_code: otp,
                type: "RESET_PASSWORD",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
        sendOTPEmail(email, otp);
        return { message: "OTP sent" }
    },

    // VERIFY OTP
    async verifyOTP(email: string, otp: string) {
        const record = await prisma.oTP.findFirst({
            where: {
                email,
                otp_code: otp,
                verified: false
            }
        });

        if (!record) {
            throw new BadRequestError("Invalid OTP");
        }

        if (record.expiresAt < new Date()) {
            throw new BadRequestError("OTP expired");
        }

        await prisma.oTP.update({
            where: { otp_id: record.otp_id },
            data: { verified: true }
        });

        return true;
    },

    // RESET PASSWORD
    async resetPassword(email: string, password: string) {

        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                verified: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!otp) {
            throw new UnauthorizedError("OTP verification required");
        }
        const hashed = await hashPassword(password);
        await prisma.customer.update({
            where: { email },
            data: { password: hashed }
        });

        return true;
    },

    async logout(customerId: string) {

        await prisma.refreshToken.deleteMany({
            where: {
                customer_id: customerId
            }
        });

        return true;
    },

    async refreshToken(token: string) {

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { customer: true }
        });

        if (!storedToken) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (!storedToken.customer) {
            throw new UnauthorizedError("Customer not found");
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token expired");
        }

        const customer = storedToken.customer;

        const newAccessToken = generateAccessToken(
            customer.customer_id,
            customer.role
        );

        const newRefreshToken = generateRefreshToken(
            customer.customer_id
        );

        await prisma.refreshToken.delete({
            where: { token }
        });

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: customer.customer_id
                    }
                }
            }
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}