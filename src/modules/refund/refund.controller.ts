import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { RefundService } from "./refund.service"
import { prisma } from "@/lib/prisma"
import { sendError, sendSuccess } from "@/utils/response"
import { CreateRefundInput } from "./refund.type"

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
            return sendSuccess({
                data: refund,
                meta
            })
        } catch (error) {
            return sendError("Get refunds failed", 500, error)

        }

    },
    async getRefund(id: string) {
        try {
            const refund = await RefundService.getRefund(id)
            return sendSuccess(refund)
        } catch (error) {
            return sendError("Get refund failed", 500, error)
        }
    },

    async createRefund(req: NextRequest) {
        try {
            const body: CreateRefundInput = await req.json()
            if (!body) {
                return sendError("Invalid data", 400)
            }
            const refund = await RefundService.createRefund(body)
            return sendSuccess(refund, "Refund created successfully")
        } catch (error) {
            console.log(error)
            return sendError("Create refund failed", 500, error)
        }
    }

}