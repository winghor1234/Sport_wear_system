// import { importService } from "@/modules/import/import.service"
// import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
// import { getSortingParams } from "@/utils/sorting"
// import { sendSuccess } from "@/utils/response"
// import { handleError } from "@/utils/errorHandler"
// import { prisma } from "@/lib/prisma"
// import { NextRequest } from "next/server"

// export async function GET(req: NextRequest) {

//     try {

//         const { page, limit, skip } = getPaginationParams(req)
//         const orderBy = getSortingParams(req)

//         const [imports, total] = await Promise.all([

//             importService.getImports({
//                 skip,
//                 take: limit,
//                 orderBy,
//                 include: {
//                     employee: true,
//                     purchase: true
//                 }
//             }),

//             prisma.import.count()

//         ])

//         const meta = getPaginationMeta(total, page, limit)

//         return sendSuccess({
//             data: imports,
//             meta
//         })

//     } catch (error) {

//         return handleError(error)

//     }

// }

// export async function POST(req: NextRequest) {

//     try {

//         const body = await req.json()

//         const record = await importService.createImport(body)

//         return sendSuccess(record)

//     } catch (error) {

//         return handleError(error)

//     }

// }


import { importController } from "@/modules/import/import.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    return importController.getImports(req)

}

export async function POST(req: Request) {

    return importController.createImport(req)

}