import { authController } from "@/modules/auth/auth.controller"
import { employeeController } from "@/modules/employee/employee.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return employeeController.getEmployees(req)

}

export async function POST(req: NextRequest) {
    return authController.adminRegister(req)

}