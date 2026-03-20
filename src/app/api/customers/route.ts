import { authController } from "@/modules/auth/auth.controller"
import { customerController } from "@/modules/customer/customer.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return customerController.getCustomers(req)
}

export async function POST(req: NextRequest) {
    return authController.customerRegister(req)
}