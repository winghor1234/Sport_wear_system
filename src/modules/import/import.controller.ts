import { importService } from "./import.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateImportInput } from "./import.type"
import { getUserFromToken } from "@/utils/cookie"
export const importController = {

    async getImports(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.ImportWhereInput = search
                ? {
                    purchase: {
                        supplier: {
                            supplier_name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    }
                }
                : {}
            const [imports, total] = await Promise.all([
                importService.getImports({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.import.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: imports, meta }, "Get imports successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }

    },

    async getImport(id: string) {
        try {
            const record = await importService.getImport(id)
            return successResponse(record, "Get import successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async createImport(req: NextRequest) {
        try {
            const body: CreateImportInput = await req.json()
            const payload = getUserFromToken(req)
            const userId = (await payload).id
            const record = await importService.createImport(body, userId)
            return successResponse(record, "Create import successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteImport(id: string) {
        try {
            await importService.deleteImport(id)
            return successResponse(null, "Delete import successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    }

}