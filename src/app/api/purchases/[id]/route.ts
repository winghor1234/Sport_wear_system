import { purchaseController } from "@/modules/purchase/purchase.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return purchaseController.getPurchase(id)

}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return purchaseController.updatePurchase(req, id)

}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return purchaseController.deletePurchase(id)

}