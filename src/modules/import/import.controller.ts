import { importService } from "./import.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendError, sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
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
            return sendSuccess({
                data: imports,
                meta
            })
        } catch (error) {
            return handleError(error)
        }

    },

    async getImport(id: string) {
        try {
            const record = await importService.getImport(id)
            return sendSuccess(record)
        } catch (error) {
            return sendError("Get import failed", 500, error)
        }
    },

    async createImport(req: NextRequest) {
        try {
            const body: CreateImportInput = await req.json()
            const payload = getUserFromToken(req)
            const userId = (await payload).id
            const record = await importService.createImport(body, userId)
            return sendSuccess(record)
        } catch (error) {
            return sendError("Create import failed", 500, error)
        }
    },

    async deleteImport(id: string) {
        try {
            await importService.deleteImport(id)
            return sendSuccess({
                message: "Import deleted"
            })
        } catch (error) {
            return sendError("Delete import failed", 500, error)

        }

    }

}