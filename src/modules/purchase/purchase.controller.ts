import { purchaseService } from "./purchase.service"
import { prisma } from "@/lib/prisma"

import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"

import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"

import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"

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

            return handleError(error)

        }

    },

    async createPurchase(req: Request) {

        try {

            const body = await req.json()

            const purchase = await purchaseService.createPurchase(body)

            return sendSuccess(purchase)

        } catch (error) {

            return handleError(error)

        }

    },

    async updatePurchase(req: Request, id: string) {

        try {

            const body = await req.json()

            const purchase = await purchaseService.updatePurchase(id, body)

            return sendSuccess(purchase)

        } catch (error) {

            return handleError(error)

        }

    },

    async deletePurchase(id: string) {

        try {

            await purchaseService.deletePurchase(id)

            return sendSuccess({
                message: "Purchase deleted"
            })

        } catch (error) {

            return handleError(error)

        }

    }

}