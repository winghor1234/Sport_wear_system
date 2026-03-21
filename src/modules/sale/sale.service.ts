import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateSaleInput } from "./sale.type"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const saleService = {
    async getSales(options?: Prisma.SaleFindManyArgs) {

        return prisma.sale.findMany({
            ...options,
            include: {
                employee: true,
                customer: true,
                sale_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

    },

    async getSale(id: string) {

        const sale = await prisma.sale.findUnique({
            where: { sale_id: id },
            include: {
                employee: true,
                customer: true,
                sale_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return sale

    },

    async createSale(data: CreateSaleInput, userId: string) {
        return prisma.$transaction(async (tx) => {

            // ✅ 1. validation
            if (!data.sale_details || data.sale_details.length === 0) {
                throw new BadRequestError("Sale must have at least one item")
            }
            const items = data.sale_details

            if (items.some(i => i.quantity <= 0)) {
                throw new BadRequestError("Invalid quantity")
            }

            // 🔍 2. fetch products
            const productIds = items.map(i => i.product_id)

            const products = await tx.product.findMany({
                where: { product_id: { in: productIds } }
            })

            const productMap = new Map(
                products.map(p => [p.product_id, p])
            )

            // ✅ 3. check stock
            for (const item of items) {
                const product = productMap.get(item.product_id)

                if (!product) {
                    throw new NotFoundError("Product not found")
                }

                if (product.stock_qty < item.quantity) {
                    throw new BadRequestError(
                        `Insufficient stock for product ${product.product_name}`
                    )
                }
            }

            // 💰 4. calculate total (ห้ามใช้จาก client)
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

            // 🧾 5. create sale
            const result = await tx.sale.create({
                data: {
                    employee_id: userId,
                    customer_id: data.customer_id,
                    total_amount: total,
                    sale_details: {
                        create: items
                    }
                },
                include: {
                    sale_details: true
                }
            })

            // 🔁 6. deduct stock
            for (const item of items) {
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            // 🎁 7. add point (fix logic)
            if (result.customer_id) {

                const point = Math.floor((total || 0) / 100)

                await tx.customer.update({
                    where: { customer_id: result.customer_id },
                    data: {
                        point: {
                            increment: point
                        }
                    }
                })
            }
            if (!result) {
                throw new BadRequestError("Failed to create sale")
            }
            return result
        })
    },

}