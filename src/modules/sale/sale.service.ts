import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const saleService = {

    async getSales(options?: Prisma.SaleFindManyArgs) {
        return prisma.sale.findMany(options)
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

        if (!sale) {
            throw new Error("Sale not found")
        }

        return sale
    },

    async createSale(data: Prisma.SaleCreateInput) {

        const result = await prisma.$transaction(async (tx) => {

            const sale = await tx.sale.create({
                data,
                include: {
                    sale_details: true
                }
            })

            for (const detail of sale.sale_details) {

                await tx.product.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock_qty: {
                            decrement: detail.quantity
                        }
                    }
                })

            }

            return sale
        })

        return result
    },

    async deleteSale(id: string) {

        const sale = await prisma.sale.delete({
            where: { sale_id: id }
        })

        return sale
    }

}