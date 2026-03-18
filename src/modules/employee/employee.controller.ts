import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { sendError, sendSuccess } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { employeeService } from "./employee.service"
import {  UpdateEmployeeInput } from "./employeetype"

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
            return sendSuccess({
                data: employees,
                meta
            })
        } catch (error) {
            console.log(error)
            return sendError("Get employees failed", 500, error)
        }
    },

    async getEmployee(id: string) {
        try {
            const employee = await employeeService.getEmployee(id)
            return sendSuccess(employee)
        } catch (error) {
            return sendError("Get employee failed", 500, error)
        }
    },

    // async createEmployee(req: Request) {
    //     try {
    //         const body: CreateEmployeeInput = await req.json()
    //         const employee = await employeeService.createEmployee(body)
    //         return sendSuccess(employee)
    //     } catch (error) {
    //         console.log(error)
    //         return sendError("Create employee failed", 500, error)
    //     }
    // },

    async updateEmployee(req: Request, id: string) {
        try {
            const body: UpdateEmployeeInput = await req.json()
            const employee = await employeeService.updateEmployee(id, body)
            return sendSuccess(employee)
        } catch (error) {
            return sendError("Update employee failed", 500, error)
        }
    },

    async deleteEmployee(id: string) {
        try {
            await employeeService.deleteEmployee(id)
            return sendSuccess({
                message: "Employee deleted"
            })
        } catch (error) {
            return sendError("Delete employee failed", 500, error)

        }

    }

}