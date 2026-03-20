import { supplierController } from "@/modules/supplier/supplier.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return supplierController.getSuppliers(req)
}

export async function POST(req: Request) {
    return supplierController.createSupplier(req)
}