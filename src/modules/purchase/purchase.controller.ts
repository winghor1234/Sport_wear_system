import { purchaseService } from "./purchase.service"
import { prisma } from "@/lib/prisma"

import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"

import { sendError, sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"

import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreatePurchaseInput, UpdatePurchaseInput } from "./purchase.type"
import { getAuthCookies, getUserFromToken } from "@/utils/cookie"
import { Payload } from '../../generated/prisma/internal/prismaNamespace';

export const purchaseController = {

    async getPurchases(req: NextRequest) {
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
                    orderBy
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
    },

    async getPurchase(id: string) {
        try {
            const purchase = await purchaseService.getPurchase(id)
            return sendSuccess(purchase)
        } catch (error) {
            return sendError("Get purchase failed", 500, error)
        }
    },

    async createPurchase(req: NextRequest) {
        const body: CreatePurchaseInput = await req.json()
        const payload = getUserFromToken(req)
        const userId = (await payload).id
        const purchase = await purchaseService.createPurchase(body, userId)
        return sendSuccess(purchase)
    },

    async updatePurchase(req: NextRequest, id: string) {
        try {
            const body: UpdatePurchaseInput = await req.json()
            const user = await getUserFromToken(req)
            const purchase = await purchaseService.updatePurchase(id, body, user.id)
            return sendSuccess(purchase)
        } catch (error) {
            return sendError("Update purchase failed", 500, error)
        }
    },

    async deletePurchase(id: string) {
        try {
            await purchaseService.deletePurchase(id)
            return sendSuccess({
                message: "Purchase deleted"
            })
        } catch (error) {
            return sendError("Delete purchase failed", 500, error)
        }
    }
}