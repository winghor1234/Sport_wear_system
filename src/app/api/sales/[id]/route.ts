// import { saleService } from "@/modules/sale/sale.service"
// import { sendSuccess, sendError } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function GET(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const sale = await saleService.getSale(id)

//         return sendSuccess(sale)

//     } catch (error) {

//         return sendError("Internal Sale Server Error", 500, error)

//     }

// }

// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         await saleService.deleteSale(id)

//         return sendSuccess({
//             message: "Sale deleted"
//         })

//     } catch (error) {

//         return sendError("Internal Sale Server Error", 500, error)

//     }

// }


import { saleController } from "@/modules/sale/sale.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    return saleController.getSales(req)

}

export async function POST(req: NextRequest) {

    return saleController.createSale(req)

}