// import { purchaseService } from "@/modules/purchase/purchase.service"
// import { sendSuccess, sendError } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function GET(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const purchase = await purchaseService.getPurchase(id)

//         return sendSuccess(purchase)

//     } catch (error) {

//         return sendError("Internal Purchase Server Error", 500, error)

//     }

// }

// export async function PUT(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params
//         const body = await req.json()

//         const purchase = await purchaseService.updatePurchase(id, body)

//         return sendSuccess(purchase)

//     } catch (error) {

//         return sendError("Internal Purchase Server Error", 500, error)

//     }

// }

// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         await purchaseService.deletePurchase(id)

//         return sendSuccess({
//             message: "Purchase deleted"
//         })

//     } catch (error) {

//         return sendError("Internal Purchase Server Error", 500, error)

//     }

// }


import { purchaseController } from "@/modules/purchase/purchase.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return purchaseController.getPurchase(params.id)

}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return purchaseController.updatePurchase(req, params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return purchaseController.deletePurchase(params.id)

}