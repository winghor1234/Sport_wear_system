import { authController } from "@/modules/auth/auth.controller"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    return authController.customerForgotPassword(req)
}