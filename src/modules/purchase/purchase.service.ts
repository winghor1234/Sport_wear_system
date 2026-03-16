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

    async createPurchase(data: Prisma.PurchaseOrderCreateInput) {

        return prisma.purchaseOrder.create({
            data,
            include: {
                purchase_details: true
            }
        })

    },

    async updatePurchase(id: string, data: Prisma.PurchaseOrderUpdateInput) {

        return prisma.purchaseOrder.update({
            where: { purchase_id: id },
            data
        })

    },

    async deletePurchase(id: string) {

        return prisma.purchaseOrder.delete({
            where: { purchase_id: id }
        })

    }

}