import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { employeeService } from "./employee.service"
import { UpdateEmployeeInput } from "./employeetype"
import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"

export const employeeController = {

    async getEmployees(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.EmployeeWhereInput = search
                ? {
                    employee_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [employees, total] = await Promise.all([
                employeeService.getEmployees({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.employee.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)

            return successResponse({ data: employees, meta }, "Get employees successfully", 200);
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async getEmployee(id: string) {
        try {
            const employee = await employeeService.getEmployee(id)
            return successResponse(employee, "Get employee successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },


    async updateEmployee(req: Request, id: string) {
        try {
            const body: UpdateEmployeeInput = await req.json()
            const employee = await employeeService.updateEmployee(id, body)
            return successResponse(employee, "Update employee successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteEmployee(id: string) {
        try {
            await employeeService.deleteEmployee(id)
            return successResponse(null, "Delete employee successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }

    }

}