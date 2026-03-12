import { supplierService } from "@/modules/supplier/supplier.service"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

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

}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json()

        const supplier = await supplierService.createSupplier(body)

        return sendSuccess(supplier)

    } catch (error) {

        return handleError(error)

    }

}