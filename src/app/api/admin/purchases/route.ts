import { purchaseService } from "@/modules/purchase/purchase.service"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    try {

        const { page, limit, skip } = getPaginationParams(req)
        const search = getSearchParam(req)
        const orderBy = getSortingParams(req)

        const where: Prisma.PurchaseOrderWhereInput = search
            ? {
                supplier: {
                    supplier_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            }
            : {}

        const [purchases, total] = await Promise.all([

            purchaseService.getPurchases({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    supplier: true,
                    employee: true
                }
            }),

            prisma.purchaseOrder.count({ where })

        ])

        const meta = getPaginationMeta(total, page, limit)

        return sendSuccess({
            data: purchases,
            meta
        })

    } catch (error) {

        return handleError(error)

    }

}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json()

        const purchase = await purchaseService.createPurchase(body)

        return sendSuccess(purchase)

    } catch (error) {

        return handleError(error)

    }

}