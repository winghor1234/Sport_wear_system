
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateCustomerInput, UpdateCustomerInput } from "./customer.type"

export const customerService = {

    async getCustomers(options?: Prisma.CustomerFindManyArgs) {

        return prisma.customer.findMany({
            ...options,
            include: {
                orders: true,
                sales: true
            }
        })

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

        if (!customer) {
            throw new Error("Customer not found")
        }

        return customer

    },

    // async createCustomer(data: CreateCustomerInput) {
    //     return prisma.customer.create({
    //         data
    //     })
    // },

    async updateCustomer(id: string, data: UpdateCustomerInput) {
        return prisma.customer.update({
            where: { customer_id: id },
            data
        })
    },

    async deleteCustomer(id: string) {
        return prisma.customer.delete({
            where: { customer_id: id }
        })

    }

}