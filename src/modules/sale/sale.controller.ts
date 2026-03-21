import { saleService } from "./sale.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateSaleInput } from "./sale.type"
import { getUserFromToken } from "@/utils/cookie"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
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
            return successResponse({ data: sales, meta}, "Get sales successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async getSale(id: string) {
        try {
            const sale = await saleService.getSale(id)
            return successResponse(sale, "Get sale successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async createSale(req: NextRequest) {
        try {
            const body: CreateSaleInput = await req.json()
            const payload = getUserFromToken(req)
            const userId = (await payload).id
            const sale = await saleService.createSale(body, userId)
            return successResponse(sale, "Create sale successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

}