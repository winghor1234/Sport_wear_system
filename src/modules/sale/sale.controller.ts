import { saleService } from "./sale.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateSaleInput } from "./sale.type"
import { getUserFromToken } from "@/utils/cookie"
export const saleController = {

    async getSales(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.SaleWhereInput = search
                ? {
                    customer: {
                        customer_name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
                : {}
            const [sales, total] = await Promise.all([
                saleService.getSales({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.sale.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return sendSuccess({
                data: sales,
                meta
            })
        } catch (error) {
            return handleError(error)
        }

    },

    async getSale(id: string) {
        try {
            const sale = await saleService.getSale(id)
            return sendSuccess(sale)
        } catch (error) {
            return handleError(error)
        }

    },

    async createSale(req: NextRequest) {
        try {
            const body: CreateSaleInput = await req.json()
            const payload = getUserFromToken(req)
            const userId = (await payload).id
            const sale = await saleService.createSale(body, userId)
            return sendSuccess(sale)
        } catch (error) {
            return handleError(error)

        }

    },

    async deleteSale(id: string) {

        try {

            await saleService.deleteSale(id)

            return sendSuccess({
                message: "Sale deleted"
            })

        } catch (error) {

            return handleError(error)

        }

    }

}