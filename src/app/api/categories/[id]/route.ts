import { categoryController } from "@/modules/category/category.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return categoryController.getCategory(id)

}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params

    return categoryController.updateCategory(req, id)

}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params

    return categoryController.deleteCategory(id)

}