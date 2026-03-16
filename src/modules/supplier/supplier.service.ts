// import { prisma } from "@/lib/prisma"
// import { SupplierInput, SupplierUpdateInput } from "@/schemas/schema"
// import { Prisma } from "@prisma/client"

// export const supplierService = {

//     async getSuppliers(options?: Prisma.SupplierFindManyArgs) {
//         return prisma.supplier.findMany(options)
//     },

//     async getSupplier(id: string) {
//         const supplier = await prisma.supplier.findUnique({
//             where: { supplier_id: id }
//         })

//         if (!supplier) {
//             throw new Error("Supplier not found")
//         }

//         return supplier
//     },

//     async createSupplier(data: SupplierInput) {

//         const supplier = await prisma.supplier.create({
//             data
//         })

//         if (!supplier) {
//             throw new Error("Invalid supplier created")
//         }

//         return supplier
//     },

//     async updateSupplier(id: string, data: SupplierUpdateInput) {

//         const supplier = await prisma.supplier.update({
//             where: { supplier_id: id },
//             data
//         })

//         return supplier
//     },

//     async deleteSupplier(id: string) {

//         const supplier = await prisma.supplier.delete({
//             where: { supplier_id: id }
//         })

//         return supplier
//     }

// }

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const supplierService = {

    async getSuppliers(options?: Prisma.SupplierFindManyArgs) {

        return prisma.supplier.findMany(options)

    },

    async getSupplier(id: string) {

        const supplier = await prisma.supplier.findUnique({
            where: { supplier_id: id }
        })

        if (!supplier) {
            throw new Error("Supplier not found")
        }

        return supplier

    },

    async createSupplier(data: Prisma.SupplierCreateInput) {

        return prisma.supplier.create({
            data
        })

    },

    async updateSupplier(id: string, data: Prisma.SupplierUpdateInput) {

        return prisma.supplier.update({
            where: { supplier_id: id },
            data
        })

    },

    async deleteSupplier(id: string) {

        return prisma.supplier.delete({
            where: { supplier_id: id }
        })

    }

}