
import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return orderController.getOrder(id)

}

export async function DELETE( req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return orderController.deleteOrder(id)

}