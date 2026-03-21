import { purchaseService } from "./purchase.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreatePurchaseInput, UpdatePurchaseInput } from "./purchase.type"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { getUserFromToken } from "@/utils/cookie"


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
            return successResponse({ data: purchases, meta }, "Get purchases successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async getPurchase(id: string) {
        try {
            const purchase = await purchaseService.getPurchase(id)
            return successResponse(purchase, "Get purchase successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async createPurchase(req: NextRequest) {
        const body: CreatePurchaseInput = await req.json()
        const payload = getUserFromToken(req)
        const userId = (await payload).id
        const purchase = await purchaseService.createPurchase(body, userId)
        return successResponse(purchase, "Create purchase successfully", 201)
    },

    async updatePurchase(req: NextRequest, id: string) {
        try {
            const body: UpdatePurchaseInput = await req.json()
            const purchase = await purchaseService.updatePurchase(id, body)
            return successResponse(purchase, "Update purchase successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deletePurchase(id: string) {
        try {
            await purchaseService.deletePurchase(id)
            return successResponse(null, "Delete purchase successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    }
}