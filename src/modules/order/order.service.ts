import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const orderService = {

    async getOrders(options?: Prisma.OrderFindManyArgs) {
        return prisma.order.findMany(options)
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

    async createOrder(data: Prisma.OrderCreateInput) {

        const result = await prisma.$transaction(async (tx) => {

            const order = await tx.order.create({
                data,
                include: {
                    order_details: true
                }
            })

            for (const detail of order.order_details) {

                await tx.product.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock_qty: {
                            decrement: detail.quantity
                        }
                    }
                })

            }

            return order
        })

        return result
    },

    async deleteOrder(id: string) {

        const order = await prisma.order.delete({
            where: { order_id: id }
        })

        return order
    }

}