import { customerService } from "./customer.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { UpdateCustomerInput } from "./customer.type"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"

export const customerController = {

    async getCustomers(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.CustomerWhereInput = search
                ? {
                    customer_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [customers, total] = await Promise.all([
                customerService.getCustomers({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.customer.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: customers, meta }, "Get customers successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async getCustomer(id: string) {
        try {
            const customer = await customerService.getCustomer(id)
            return successResponse(customer, "Get customer successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async updateCustomer(req: Request, id: string) {
        try {
            const body: UpdateCustomerInput = await req.json()
            const customer = await customerService.updateCustomer(id, body)
            return successResponse(customer, "Update customer successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteCustomer(id: string) {
        try {
            await customerService.deleteCustomer(id)
            return successResponse(null, "Delete customer successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    }

}