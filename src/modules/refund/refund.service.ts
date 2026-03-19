import { prisma } from "@/lib/prisma"
import { CreateRefundInput } from "./refund.type"
import { Prisma } from "@prisma/client"

export const RefundService = {
    async createRefund(data: CreateRefundInput) {
        return prisma.$transaction(async (tx) => {

            // ✅ 2. validation
            if (!data.refund_details || data.refund_details.length === 0) {
                throw new Error("Refund must have at least one item")
            }

            if (data.refund_details.some(i => i.quantity <= 0)) {
                throw new Error("Invalid quantity")
            }

            // 🔍 3. หา sale
            const sale = await tx.sale.findUnique({
                where: { sale_id: data.sale_id },
                include: { sale_details: true }
            })

            if (!sale) {
                throw new Error("Sale not found")
            }

            // 🧠 map sale detail
            const saleMap = new Map(
                sale.sale_details.map(d => [d.product_id, d])
            )

            // ✅ 4. validate refund
            for (const item of data.refund_details) {
                const saleDetail = saleMap.get(item.product_id)

                if (!saleDetail) {
                    throw new Error("Product not in sale")
                }

                if (item.quantity > saleDetail.quantity) {
                    throw new Error("Refund exceeds sold quantity")
                }
            }

            // 💰 5. calculate total
            const total = data.refund_details.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            )

            // 🧾 6. create refund
            const refund = await tx.refund.create({
                data: {
                    sale_id: data.sale_id,
                    total_amount: total,
                    refund_details: {
                        create: data.refund_details
                    }
                },
                include: {
                    refund_details: true
                }
            })

            // 🔁 7. คืน stock
            for (const item of data.refund_details) {
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            increment: item.quantity
                        }
                    }
                })
            }

            // 🎁 8. คืน point
            if (sale.customer_id) {
                const point = Math.floor(total / 100)

                await tx.customer.update({
                    where: { customer_id: sale.customer_id },
                    data: {
                        point: {
                            decrement: point
                        }
                    }
                })
            }

            return refund
        })
    },

    async getRefunds(options?: Prisma.RefundFindManyArgs) {

        return prisma.refund.findMany({
            ...options,
            include: {
                refund_details: true,
                sale: {
                    select: {
                        sale_id: true,
                        customer_id: true,
                        total_amount: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

    },

    async getRefund(id: string) {
        const refund = await prisma.refund.findUnique({
            where: { refund_id: id },
            include: {
                refund_details: true,
                sale: {
                    include: {
                        sale_details: true
                    }
                }
            }
        })

        if (!refund) {
            throw new Error("Refund not found")
        }

        return refund
    },

}