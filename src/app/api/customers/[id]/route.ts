import { customerController } from "@/modules/customer/customer.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return customerController.getCustomer(params.id)

}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return customerController.updateCustomer(req, params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return customerController.deleteCustomer(params.id)

}