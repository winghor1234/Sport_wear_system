import { refundController } from "@/modules/refund/refund.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } =  params
    return refundController.getRefund(id)
}
