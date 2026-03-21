
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { UpdateCustomerInput } from "./customer.type"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const customerService = {

    async getCustomers(options?: Prisma.CustomerFindManyArgs) {
        const customers = await prisma.customer.findMany({
            ...options,
            include: {
                orders: true,
                sales: true
            }
        })

        return customers


    },

    async getCustomer(id: string) {

        const customer = await prisma.customer.findUnique({
            where: { customer_id: id },
            include: {
                orders: true,
                sales: true,
                points: true
            }
        })


        return customer

    },


    async updateCustomer(id: string, data: UpdateCustomerInput) {
        const customer = await prisma.customer.update({
            where: { customer_id: id },
            data
        })
        if (!customer) {
            throw new BadRequestError("Failed to update customer")
        }
        return customer
    },

    async deleteCustomer(id: string) {
        const customer = await prisma.customer.findUnique({
            where: { customer_id: id }
        })

        if (!customer) {
            throw new NotFoundError("Customer not found")
        }

        // ❌ ถ้าปิดไปแล้ว
        if (!customer.isActive) {
            throw new BadRequestError("Customer already inactive")
        }

        // ✅ soft delete
        return prisma.customer.update({
            where: { customer_id: id },
            data: {
                isActive: false
            }
        })
    }

}