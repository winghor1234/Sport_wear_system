import { customerService } from "./customer.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendError, sendSuccess } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateCustomerInput, UpdateCustomerInput } from "./customer.type"

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
            return sendSuccess({
                data: customers,
                meta
            })
        } catch (error) {
            return sendError("Get customers failed", 500, error)
        }
    },

    async getCustomer(id: string) {
        try {
            const customer = await customerService.getCustomer(id)
            return sendSuccess(customer)
        } catch (error) {
            return sendError("Get customer failed", 500, error)
        }
    },

    // async createCustomer(req: Request) {
    //     try {
    //         const body: CreateCustomerInput = await req.json()
    //         const customer = await customerService.createCustomer(body)
    //         return sendSuccess(customer)
    //     } catch (error) {
    //         console.log(error)
    //         return sendError("Create customer failed", 500, error)
    //     }
    // },

    async updateCustomer(req: Request, id: string) {
        try {
            const body: UpdateCustomerInput = await req.json()
            const customer = await customerService.updateCustomer(id, body)
            return sendSuccess(customer)
        } catch (error) {
            return sendError("Update customer failed", 500, error)
        }
    },

    async deleteCustomer(id: string) {
        try {
            await customerService.deleteCustomer(id)
            return sendSuccess({
                message: "Customer deleted"
            })
        } catch (error) {
            return sendError("Delete customer failed", 500, error)

        }

    }

}