import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { RefundService } from "./refund.service"
import { prisma } from "@/lib/prisma"
import { CreateRefundInput } from "./refund.type"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"

export const refundController = {
    async getRefunds(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.RefundWhereInput = search
                ? {
                    sale: {
                        sale_id: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
                : {}
            const [refund, total] = await Promise.all([
                RefundService.getRefunds({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.refund.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: refund, meta }, "Get refunds successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    },
    async getRefund(id: string) {
        try {
            const refund = await RefundService.getRefund(id)
            return successResponse(refund, "Get refund successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async createRefund(req: NextRequest) {
        try {
            const body: CreateRefundInput = await req.json()
            const refund = await RefundService.createRefund(body)
            return successResponse(refund, "Create refund successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    }

}