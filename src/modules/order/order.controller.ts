import { orderService } from "./order.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateOrderInput } from "./order.types"

export const orderController = {
    async getOrders(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.OrderWhereInput = search
                ? {
                    customer: {
                        customer_name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                }
                : {}
            const [orders, total] = await Promise.all([
                orderService.getOrders({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.order.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: orders, meta }, "Get orders successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    },

    async getOrder(id: string) {
        try {
            const order = await orderService.getOrder(id)
            return successResponse(order, "Get order successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async createOrder(req: NextRequest) {
        try {
            const body: CreateOrderInput = await req.json()
            const order = await orderService.createOrder(body)
            return successResponse(order, "Create order successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteOrder(id: string) {
        try {
            await orderService.deleteOrder(id)
            return successResponse(null, "Delete order successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    }
}