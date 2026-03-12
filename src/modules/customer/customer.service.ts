import { prisma } from "@/lib/prisma"
import { CustomerInput, CustomerUpdateInput } from "@/schemas/schema"

export const customerService = {

    async getCustomers() {
        return prisma.customer.findMany()
    },

    async getCustomer(id: string) {
        return prisma.customer.findUnique({
            where: { customer_id: id }
        })
    },

    async createCustomer(data: CustomerInput) {
        return prisma.customer.create({ data })
    },

    async updateCustomer(id: string, data: CustomerUpdateInput) {
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