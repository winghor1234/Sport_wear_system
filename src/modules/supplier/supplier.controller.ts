import { supplierService } from "./supplier.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendError, sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateSupplierInput, UpdateSupplierInput } from "./supplier.type"


export const supplierController = {
    async getSuppliers(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.SupplierWhereInput = search
                ? {
                    supplier_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [suppliers, total] = await Promise.all([
                supplierService.getSuppliers({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.supplier.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return sendSuccess({
                data: suppliers,
                meta
            })
        } catch (error) {
            return handleError(error)
        }
    },

    async getSupplier(id: string) {
        try {
            const supplier = await supplierService.getSupplier(id)
            return sendSuccess(supplier)
        } catch (error) {
            return sendError("Get supplier error", 500, error)
        }
    },

    async createSupplier(req: Request) {
        try {
            const body: CreateSupplierInput = await req.json()
            const supplier = await supplierService.createSupplier(body)
            return sendSuccess(supplier)
        } catch (error) {
            console.log(error)
            return sendError("Create supplier error", 500, error)
        }
    },

    async updateSupplier(req: Request, id: string) {
        try {
            const body: UpdateSupplierInput = await req.json()
            const supplier = await supplierService.updateSupplier(id, body)
            return sendSuccess(supplier)
        } catch (error) {
            return sendError("Update supplier error", 500, error)
        }
    },

    async deleteSupplier(id: string) {
        try {
            await supplierService.deleteSupplier(id)
            return sendSuccess({
                message: "Supplier deleted"
            })
        } catch (error) {
            return sendError("Delete supplier error", 500, error)
        }
    }
}