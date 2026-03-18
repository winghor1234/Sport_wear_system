


import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateOrderInput } from "./order.types"

export const orderService = {

    async getOrders(options?: Prisma.OrderFindManyArgs) {

        return prisma.order.findMany({
            ...options,
            include: {
                customer: true,
                order_details: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                delivery: true
            }
        })

    },

    async getOrder(id: string) {

        const order = await prisma.order.findUnique({
            where: { order_id: id },
            include: {
                customer: true,
                order_details: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                delivery: true
            }
        })

        if (!order) {
            throw new Error("Order not found")
        }

        return order

    },

    async createOrder(data: CreateOrderInput) {
        await prisma.$transaction(async (tx) => {
            // ✅ check stock ก่อน
            for (const item of data.order_details) {
                const product = await tx.product.findUnique({
                    where: { product_id: item.product_id }
                })
                if (!product || product.stock_qty < item.quantity) {
                    throw new Error("Insufficient stock")
                }
            }
            // ✅ create order + details
            const order = await tx.order.create({
                data: {
                    customer_id: data.customer_id,
                    total_amount: data.total_amount,
                    order_details: {
                        create: data.order_details
                    }
                },
                include: { order_details: true }
            })

            // ✅ update stock
            for (const item of data.order_details) {
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            return order
        })

    },

    async deleteOrder(id: string) {

        return prisma.order.delete({
            where: { order_id: id }
        })

    }

}