import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateSupplierInput, UpdateSupplierInput } from "./supplier.type"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const supplierService = {

    async getSuppliers(options?: Prisma.SupplierFindManyArgs) {
        const suppliers = await prisma.supplier.findMany(options)
        return suppliers
    },

    async getSupplier(id: string) {
        const supplier = await prisma.supplier.findUnique({
            where: { supplier_id: id }
        })
        return supplier
    },

    async createSupplier(data: CreateSupplierInput) {
        const supplier = await prisma.supplier.create({
            data
        })
        if (!supplier) {
            throw new BadRequestError("Failed to create supplier")
        }
        return supplier

    },

    async updateSupplier(id: string, data: UpdateSupplierInput) {
        const supplier = await prisma.supplier.update({
            where: { supplier_id: id },
            data
        })
        if (!supplier) {
            throw new BadRequestError("Failed to update supplier")
        }
        return supplier
    },

    async deleteSupplier(id: string) {
        const supplier = await prisma.supplier.delete({
            where: { supplier_id: id }
        })
        if (!supplier) {
            throw new BadRequestError("Failed to delete supplier")
        }
        return supplier
    }

}