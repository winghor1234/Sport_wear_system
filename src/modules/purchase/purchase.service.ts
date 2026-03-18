// import { prisma } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"

// export const purchaseService = {

//     async getPurchases(options?: Prisma.PurchaseOrderFindManyArgs) {
//         return prisma.purchaseOrder.findMany(options)
//     },

//     async getPurchase(id: string) {

//         const purchase = await prisma.purchaseOrder.findUnique({
//             where: { purchase_id: id },
//             include: {
//                 supplier: true,
//                 employee: true,
//                 purchase_details: {
//                     include: {
//                         product: true
//                     }
//                 }
//             }
//         })

//         if (!purchase) {
//             throw new Error("Purchase not found")
//         }

//         return purchase
//     },

//     async createPurchase(data: Prisma.PurchaseOrderCreateInput) {

//         const purchase = await prisma.purchaseOrder.create({
//             data,
//             include: {
//                 purchase_details: true
//             }
//         })

//         return purchase
//     },

//     async updatePurchase(id: string, data: Prisma.PurchaseOrderUpdateInput) {

//         const purchase = await prisma.purchaseOrder.update({
//             where: { purchase_id: id },
//             data
//         })

//         return purchase
//     },

//     async deletePurchase(id: string) {

//         const purchase = await prisma.purchaseOrder.delete({
//             where: { purchase_id: id }
//         })

//         return purchase
//     }

// }


import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreatePurchaseInput, UpdatePurchaseInput } from "./purchase.type"

export const purchaseService = {

    async getPurchases(options?: Prisma.PurchaseOrderFindManyArgs) {

        return prisma.purchaseOrder.findMany({
            ...options,
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

    },

    async getPurchase(id: string) {

        const purchase = await prisma.purchaseOrder.findUnique({
            where: { purchase_id: id },
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!purchase) {
            throw new Error("Purchase not found")
        }

        return purchase

    },

    async createPurchase(data: CreatePurchaseInput, userId: string) {
        return prisma.$transaction(async (tx) => {
            return tx.purchaseOrder.create({
                data: {
                    supplier_id: data.supplier_id,
                    employee_id: userId, // ✅ จาก token
                    total_amount: data.total_amount,
                    status: "pending",
                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: { purchase_details: true }
            })
        })
    },

    async updatePurchase(id: string, data: UpdatePurchaseInput, userId: string) {
        return prisma.$transaction(async (tx) => {

            // 🔍 1. check purchase exists
            const existing = await tx.purchaseOrder.findUnique({
                where: { purchase_id: id },
                include: {
                    imports: true,
                    purchase_details: true
                }
            })

            if (!existing) {
                throw new Error("Purchase not found")
            }

            // ❌ 2. ห้าม update ถ้ามี import แล้ว
            if (existing.imports.length > 0) {
                throw new Error("Cannot update purchase after import")
            }

            // ❌ 3. optional: check status
            if (existing.status !== "pending") {
                throw new Error("Only pending purchase can be updated")
            }

            // 🧨 4. ลบ detail เก่า
            await tx.purchaseDetail.deleteMany({
                where: { purchase_id: id }
            })

            // 🔁 5. update + recreate details
            const updated = await tx.purchaseOrder.update({
                where: { purchase_id: id },
                data: {
                    supplier_id: data.supplier_id,
                    employee_id: userId, // ✅ from token (override)
                    total_amount: data.total_amount,
                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: {
                    purchase_details: true
                }
            })

            return updated
        })
    },

    async deletePurchase(id: string) {

        return prisma.purchaseOrder.delete({
            where: { purchase_id: id }
        })

    }

}