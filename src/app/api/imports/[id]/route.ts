
import { importController } from "@/modules/import/import.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return importController.getImport(id)

}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return importController.deleteImport(id)

}