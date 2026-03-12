import { saleService } from "@/modules/sale/sale.service"
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

        const [sales, total] = await Promise.all([

            saleService.getSales({
                skip,
                take: limit,
                orderBy,
                include: {
                    employee: true,
                    customer: true
                }
            }),

            prisma.sale.count()

        ])

        const meta = getPaginationMeta(total, page, limit)

        return sendSuccess({
            data: sales,
            meta
        })

    } catch (error) {

        return handleError(error)

    }

}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json()

        const sale = await saleService.createSale(body)

        return sendSuccess(sale)

    } catch (error) {

        return handleError(error)

    }

}