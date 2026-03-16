// import { prisma } from "@/lib/prisma"
// import { categoryService } from "@/modules/category/category.service"
// import { handleError } from "@/utils/errorHandler"
// import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
// import { sendError, sendSuccess } from "@/utils/response"
// import { getSearchParam } from "@/utils/search"
// import { getSortingParams } from "@/utils/sorting"
// import { Prisma } from "@prisma/client"
// import { NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest, res: NextResponse) {
//   try {
//     const { page, limit, skip } = getPaginationParams(req)
//     const search = getSearchParam(req)
//     const orderBy = getSortingParams(req)
//     const where: Prisma.CategoryWhereInput = search
//       ? {
//         category_name: {
//           contains: search,
//           mode: "insensitive"
//         }
//       }
//       : {}

//     const [categories, total] = await Promise.all([
//       categoryService.getCategories({
//         where,
//         skip,
//         take: limit,
//         orderBy
//       }),
//       prisma.category.count({ where })
//     ]);
//     const meta = getPaginationMeta(total, page, limit)
//     return sendSuccess({
//       data: categories,
//       meta
//     });
//   } catch (error) {
//     return handleError(error)
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const category = await categoryService.createCategory(body)
//     return sendSuccess(category)
//   } catch (error) {
//     return sendError("Internal Category Server Error", 500, error)

//   }
// }



import { categoryController } from "@/modules/category/category.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

  return categoryController.getCategories(req)

}

export async function POST(req: Request) {

  return categoryController.createCategory(req)

}