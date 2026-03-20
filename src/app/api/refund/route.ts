
import { refundController } from "@/modules/refund/refund.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return refundController.getRefunds(req)
}

export async function POST(req: NextRequest) {
    return refundController.createRefund(req)
}