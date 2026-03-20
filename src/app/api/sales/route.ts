import { saleController } from "@/modules/sale/sale.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return saleController.getSales(req)
}

export async function POST(req: NextRequest) {
    return saleController.createSale(req)

}