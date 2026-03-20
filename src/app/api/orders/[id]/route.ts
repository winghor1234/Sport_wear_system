
import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return orderController.getOrder(id)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return orderController.deleteOrder(id)
}