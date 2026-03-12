import { orderService } from "@/modules/order/order.service"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSortingParams } from "@/utils/sorting"
import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    try {

        const { page, limit, skip } = getPaginationParams(req)
        const orderBy = getSortingParams(req)

        const [orders, total] = await Promise.all([

            orderService.getOrders({
                skip,
                take: limit,
                orderBy,
                include: {
                    customer: true
                }
            }),

            prisma.order.count()

        ])

        const meta = getPaginationMeta(total, page, limit)

        return sendSuccess({
            data: orders,
            meta
        })

    } catch (error) {

        return handleError(error)

    }

}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json()

        const order = await orderService.createOrder(body)

        return sendSuccess(order)

    } catch (error) {

        return handleError(error)

    }

}