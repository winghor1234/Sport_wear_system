// import { productService } from "@/modules/product/product.service"
// import { sendError, sendSuccess } from "@/utils/response"
// import { NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     try {
//         const { id } = await params
//         const product = await productService.getProduct(id)
//         return sendSuccess(product)
//     } catch (error) {
//         sendError("Internal Product Server Error", 500, error)
//     }

// }

// export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     try {
//         const { id } = await params
//         const body = await req.json()
//         const product = await productService.updateProduct(id, body)
//         return sendSuccess(product)
//     } catch (error) {
//         sendError("Internal Product Server Error", 500, error)
//     }

// }

// export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     try {
//         const { id } = await params
//         await productService.deleteProduct(id)
//         return sendSuccess({ message: "Product deleted" })
//     } catch (error) {
//         sendError("Internal Product Server Error", 500, error)
//     }
// }


import { productController } from "@/modules/product/product.controller"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {

    return productController.getProduct(req, params.id)

}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {

    return productController.updateProduct(req, params.id)

}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {

    return productController.deleteProduct(params.id)

}