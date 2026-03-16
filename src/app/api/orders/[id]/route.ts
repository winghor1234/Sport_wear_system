// import { orderService } from "@/modules/order/order.service"
// import { sendSuccess, sendError } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function GET(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const order = await orderService.getOrder(id)

//         return sendSuccess(order)

//     } catch (error) {

//         return sendError("Internal Order Server Error", 500, error)

//     }

// }

// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         await orderService.deleteOrder(id)

//         return sendSuccess({
//             message: "Order deleted"
//         })

//     } catch (error) {

//         return sendError("Internal Order Server Error", 500, error)

//     }

// }


import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return orderController.getOrder(params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return orderController.deleteOrder(params.id)

}