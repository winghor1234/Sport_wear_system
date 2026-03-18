import { orderService } from "./order.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendCreated, sendError, sendSuccess } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest} from "next/server"
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
            return sendSuccess({
                data: orders,
                meta
            })
        } catch (error) {
            return sendError("Get orders failed", 500, error)

        }

    },

    async getOrder(id: string) {
        try {
            const order = await orderService.getOrder(id)
            return sendSuccess(order)
        } catch (error) {
            return sendError("Get order failed", 500, error)
        }
    },

    async createOrder(req: NextRequest) {
        try {
            const body: CreateOrderInput = await req.json()
            if (!body) {
                return sendError("Invalid data", 400)
            }
            const order = await orderService.createOrder(body)
            return sendCreated(order, "Order created successfully")
        } catch (error) {
            console.log(error)
            return sendError("Create order failed", 500, error)
        }
    },

    async deleteOrder(id: string) {
        try {
            await orderService.deleteOrder(id)
            return sendSuccess({
                message: "Order deleted"
            })
        } catch (error) {
            return sendError("Delete order failed", 500, error)
        }
    }
}