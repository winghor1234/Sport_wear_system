
import { productController } from "@/modules/product/product.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return productController.getProduct(req, id)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return productController.updateProduct(req, id)

}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return productController.deleteProduct(req, id)
}