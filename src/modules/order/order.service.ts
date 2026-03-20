import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateOrderInput } from "./order.types"
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/response"

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
        if (!orders) {
            throw new NotFoundError("Orders not found")
        }
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

        if (!order) {
            throw new NotFoundError("Order not found")
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
                    throw new BadRequestError("Insufficient stock")
                }
            }
            const total_amount = data.order_details.reduce((acc, item) => { return acc + item.price * item.quantity }, 0)
            // ✅ create order + details
            const order = await tx.order.create({
                data: {
                    customer_id: data.customer_id,
                    total_amount: total_amount,
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
        return prisma.$transaction(async (tx) => {

            const existing = await tx.order.findUnique({
                where: { order_id: id },
                include: {
                    payment: true,
                    delivery: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Order not found")
            }

            // ❌ ห้ามลบถ้ามี payment
            if (existing.payment) {
                throw new BadRequestError("Cannot delete paid order")
            }

            // ❌ ห้ามลบถ้ามี delivery
            if (existing.delivery) {
                throw new BadRequestError("Cannot delete order with delivery")
            }

            // ❌ optional: check status
            if (existing.status !== "pending") {
                throw new BadRequestError("Only pending order can be deleted")
            }

            // 🗑️ delete
            await tx.order.delete({
                where: { order_id: id }
            })
            if (!existing) {
                throw new BadRequestError("Failed to delete order")
            }
            return { message: "Order deleted successfully" }
        })
    }

}