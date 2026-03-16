import { orderService } from "./order.service"
import { prisma } from "@/lib/prisma"

import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"

import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"

import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"

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

            return handleError(error)

        }

    },

    async getOrder(id: string) {

        try {

            const order = await orderService.getOrder(id)

            return sendSuccess(order)

        } catch (error) {

            return handleError(error)

        }

    },

    async createOrder(req: Request) {

        try {

            const body = await req.json()

            const order = await orderService.createOrder(body)

            return sendSuccess(order)

        } catch (error) {

            return handleError(error)

        }

    },

    async deleteOrder(id: string) {

        try {

            await orderService.deleteOrder(id)

            return sendSuccess({
                message: "Order deleted"
            })

        } catch (error) {

            return handleError(error)

        }

    }

}