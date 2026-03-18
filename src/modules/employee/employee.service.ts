import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateEmployeeInput, UpdateEmployeeInput } from "./employeetype"

export const employeeService = {

    async getEmployees(options?: Prisma.EmployeeFindManyArgs) {

        return prisma.employee.findMany({
            ...options,
            include: {
                purchases: true,
                imports: true,
                sales: true
            }
        })

    },

    async getEmployee(id: string) {

        const employee = await prisma.employee.findUnique({
            where: { employee_id: id },
            include: {
                purchases: true,
                imports: true,
                sales: true,
            }
        })

        if (!employee) {
            throw new Error("Employee not found")
        }

        return employee

    },

    // async createEmployee(data: CreateEmployeeInput) {
    //     return prisma.employee.create({
    //         data
    //     })
    // },

    async updateEmployee(id: string, data: UpdateEmployeeInput) {
        return prisma.employee.update({
            where: { employee_id: id },
            data
        })
    },

    async deleteEmployee(id: string) {
        return prisma.employee.delete({
            where: { employee_id: id }
        })

    }

}