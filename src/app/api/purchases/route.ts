import { purchaseController } from "@/modules/purchase/purchase.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return purchaseController.getPurchases(req)
}

export async function POST(req: NextRequest) {
    return purchaseController.createPurchase(req)
}