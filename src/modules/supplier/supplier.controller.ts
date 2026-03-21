import { supplierService } from "./supplier.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateSupplierInput, UpdateSupplierInput } from "./supplier.type"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"


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
            return successResponse({ data: suppliers, meta }, "Get suppliers successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async getSupplier(id: string) {
        try {
            const supplier = await supplierService.getSupplier(id)
            return successResponse(supplier, "Get supplier successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async createSupplier(req: Request) {
        try {
            const body: CreateSupplierInput = await req.json()
            const supplier = await supplierService.createSupplier(body)
            return successResponse(supplier, "Create supplier successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async updateSupplier(req: Request, id: string) {
        try {
            const body: UpdateSupplierInput = await req.json()
            const supplier = await supplierService.updateSupplier(id, body)
            return successResponse(supplier, "Update supplier successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteSupplier(id: string) {
        try {
            await supplierService.deleteSupplier(id)
            return successResponse(null, "Delete supplier successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    }
}