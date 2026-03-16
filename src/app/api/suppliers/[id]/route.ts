// import { supplierService } from "@/modules/supplier/supplier.service"
// import { sendSuccess, sendError } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function GET(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const supplier = await supplierService.getSupplier(id)

//         return sendSuccess(supplier)

//     } catch (error) {

//         return sendError("Internal Supplier Server Error", 500, error)

//     }

// }

// export async function PUT(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params
//         const body = await req.json()

//         const supplier = await supplierService.updateSupplier(id, body)

//         return sendSuccess(supplier)

//     } catch (error) {

//         return sendError("Internal Supplier Server Error", 500, error)

//     }

// }

// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         await supplierService.deleteSupplier(id)

//         return sendSuccess({
//             message: "Supplier deleted"
//         })

//     } catch (error) {

//         return sendError("Internal Supplier Server Error", 500, error)

//     }

// }


import { supplierController } from "@/modules/supplier/supplier.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return supplierController.getSupplier(params.id)

}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return supplierController.updateSupplier(req, params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return supplierController.deleteSupplier(params.id)

}