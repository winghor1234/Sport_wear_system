import { saleController } from "@/modules/sale/sale.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params
    return saleController.getSale(id)
}
