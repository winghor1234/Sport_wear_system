
import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return orderController.getOrders(req)
}

export async function POST(req: NextRequest) {
    return orderController.createOrder(req)
}