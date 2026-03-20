import { employeeController } from "@/modules/employee/employee.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return employeeController.getEmployee(id)

}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return employeeController.updateEmployee(req, id)

}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return employeeController.deleteEmployee(id)

}