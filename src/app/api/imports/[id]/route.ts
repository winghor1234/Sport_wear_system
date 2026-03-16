// import { importService } from "@/modules/import/import.service"
// import { sendSuccess, sendError } from "@/utils/response"
// import { NextRequest } from "next/server"

// export async function GET(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         const record = await importService.getImport(id)

//         return sendSuccess(record)

//     } catch (error) {

//         return sendError("Internal Import Server Error", 500, error)

//     }

// }

// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {

//     try {

//         const { id } = await params

//         await importService.deleteImport(id)

//         return sendSuccess({
//             message: "Import deleted"
//         })

//     } catch (error) {

//         return sendError("Internal Import Server Error", 500, error)

//     }

// }


import { importController } from "@/modules/import/import.controller"
import { NextRequest } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return importController.getImport(params.id)

}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    return importController.deleteImport(params.id)

}