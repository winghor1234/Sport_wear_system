import { customerController } from "@/modules/customer/customer.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return customerController.getCustomer(id)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } =  params
    return customerController.updateCustomer(req, id)

}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return customerController.deleteCustomer(id)

}