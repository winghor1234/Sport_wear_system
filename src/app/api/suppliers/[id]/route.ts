import { supplierController } from "@/modules/supplier/supplier.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return supplierController.getSupplier(id)

}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return supplierController.updateSupplier(req, id)

}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return supplierController.deleteSupplier(id)

}