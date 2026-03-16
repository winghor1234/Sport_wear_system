// import { categoryService } from "@/modules/category/category.service"
// import { sendSuccess } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     const body = await req.json()
//     const category = await categoryService.updateCategory(id, body)
//     return sendSuccess(category)
// }

// export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     await categoryService.deleteCategory(id)
//     return sendSuccess({ message: "Category deleted" })
// }

// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     const category = await categoryService.getCategory(id)
//     return sendSuccess(category)
// }


import { categoryController } from "@/modules/category/category.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return categoryController.getCategory(params.id)

}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return categoryController.updateCategory(req, params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return categoryController.deleteCategory(params.id)

}