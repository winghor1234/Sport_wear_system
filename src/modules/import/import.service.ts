import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const importService = {

    async getImports(options?: Prisma.ImportFindManyArgs) {
        return prisma.import.findMany(options)
    },

    async getImport(id: string) {

        const record = await prisma.import.findUnique({
            where: { import_id: id },
            include: {
                employee: true,
                purchase: true,
                import_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!record) {
            throw new Error("Import not found")
        }

        return record
    },

    async createImport(data: Prisma.ImportCreateInput) {

        const result = await prisma.$transaction(async (tx) => {

            const importRecord = await tx.import.create({
                data,
                include: {
                    import_details: true
                }
            })

            for (const detail of importRecord.import_details) {

                await tx.product.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock_qty: {
                            increment: detail.quantity
                        }
                    }
                })

            }

            return importRecord
        })

        return result
    },

    async deleteImport(id: string) {

        const record = await prisma.import.delete({
            where: { import_id: id }
        })

        return record
    }

}