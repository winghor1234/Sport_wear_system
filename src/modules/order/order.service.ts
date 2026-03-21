import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateOrderInput } from "./order.types"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const orderService = {

    async getOrders(options?: Prisma.OrderFindManyArgs) {
        const orders = await prisma.order.findMany({
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
        return orders
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
        return order

    },

    async createOrder(data: CreateOrderInput) {
        return prisma.$transaction(async (tx) => {

            if (!data.order_details.length) {
                throw new BadRequestError("Order must have at least one item")
            }

            // 🔍 fetch products (optimize)
            const productIds = data.order_details.map(i => i.product_id)

            const products = await tx.product.findMany({
                where: { product_id: { in: productIds } }
            })

            const productMap = new Map(
                products.map(p => [p.product_id, p])
            )

            // ✅ check stock
            for (const item of data.order_details) {
                const product = productMap.get(item.product_id)

                if (!product) {
                    throw new NotFoundError("Product not found")
                }

                if (product.stock_qty < item.quantity) {
                    throw new BadRequestError("Insufficient stock")
                }
            }

            // 💰 calculate total
            const total_amount = data.order_details.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )

            // 🧾 create order
            const order = await tx.order.create({
                data: {
                    customer_id: data.customer_id,
                    total_amount,
                    status: "WAITING_PAYMENT", // ✅ สำคัญ
                    order_details: {
                        create: data.order_details
                    }
                },
                include: {
                    order_details: true
                }
            })

            // 🔁 deduct stock
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
        return prisma.$transaction(async (tx) => {

            const existing = await tx.order.findUnique({
                where: { order_id: id },
                include: {
                    payment: true,
                    delivery: true,
                    order_details: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Order not found")
            }

            if (existing.payment) {
                throw new BadRequestError("Cannot delete paid order")
            }

            if (existing.delivery) {
                throw new BadRequestError("Cannot delete order with delivery")
            }

            if (existing.status !== "WAITING_PAYMENT") {
                throw new BadRequestError("Only waiting payment order can be deleted")
            }

            // 🔁 rollback stock
            for (const item of existing.order_details) {
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            increment: item.quantity
                        }
                    }
                })
            }

            await tx.order.delete({
                where: { order_id: id }
            })

            return { message: "Order deleted successfully" }
        })
    }

}