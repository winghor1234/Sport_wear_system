
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateImportInput } from "./import.type"

export const importService = {

    async getImports(options?: Prisma.ImportFindManyArgs) {

        return prisma.import.findMany({
            ...options,
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

    async createImport(data: CreateImportInput, userId: string) {
        return prisma.$transaction(async (tx) => {

            // 🔍 1. หา purchase
            const purchase = await tx.purchaseOrder.findUnique({
                where: { purchase_id: data.purchase_id },
                include: {
                    purchase_details: true
                }
            })

            if (!purchase) {
                throw new Error("Purchase not found")
            }

            if (purchase.status !== "pending") {
                throw new Error("Only pending purchase can be imported")
            }

            // 🔍 map purchase detail
            const detailMap = new Map(
                purchase.purchase_details.map(d => [d.product_id, d])
            )

            // ✅ 2. validate import
            for (const item of data.import_details) {
                const purchaseDetail = detailMap.get(item.product_id)

                if (!purchaseDetail) {
                    throw new Error("Product not in purchase")
                }

                const remaining = purchaseDetail.quantity - purchaseDetail.received_qty

                if (item.quantity > remaining) {
                    throw new Error(
                        `Import quantity exceeds remaining for product ${item.product_id}`
                    )
                }
            }

            // 🧾 3. create import
            const newImport = await tx.import.create({
                data: {
                    purchase_id: data.purchase_id,
                    employee_id: userId,
                    import_details: {
                        create: data.import_details
                    }
                },
                include: { import_details: true }
            })

            // 🔁 4. update purchase_detail + product stock
            for (const item of data.import_details) {

                // update received_qty
                await tx.purchaseDetail.updateMany({
                    where: {
                        purchase_id: data.purchase_id,
                        product_id: item.product_id
                    },
                    data: {
                        received_qty: {
                            increment: item.quantity
                        }
                    }
                })

                // update stock
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            increment: item.quantity
                        }
                    }
                })
            }

            // ✅ 5. check if completed
            const updatedDetails = await tx.purchaseDetail.findMany({
                where: { purchase_id: data.purchase_id }
            })

            const isCompleted = updatedDetails.every(
                d => d.received_qty >= d.quantity
            )

            if (isCompleted) {
                await tx.purchaseOrder.update({
                    where: { purchase_id: data.purchase_id },
                    data: { status: "completed" }
                })
            }

            return newImport
        })
    },

    async deleteImport(id: string) {
        return prisma.$transaction(async (tx) => {

            // 🔍 1. หา import
            const existing = await tx.import.findUnique({
                where: { import_id: id },
                include: {
                    import_details: true,
                    purchase: true
                }
            })

            if (!existing) {
                throw new Error("Import not found")
            }

            // ❗ optional: ห้ามลบถ้า purchase completed แล้ว
            if (existing.purchase.status === "completed") {
                throw new Error("Cannot delete import from completed purchase")
            }

            // 🔁 2. rollback stock + received_qty
            for (const item of existing.import_details) {

                // ลด received_qty
                await tx.purchaseDetail.updateMany({
                    where: {
                        purchase_id: existing.purchase_id,
                        product_id: item.product_id
                    },
                    data: {
                        received_qty: {
                            decrement: item.quantity
                        }
                    }
                })

                // ลด stock
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            // 🗑️ 3. ลบ import
            await tx.import.delete({
                where: { import_id: id }
            })

            // 🔄 4. update purchase status กลับเป็น pending
            await tx.purchaseOrder.update({
                where: { purchase_id: existing.purchase_id },
                data: { status: "pending" }
            })

            return { message: "Import deleted successfully" }
        })
    }

}