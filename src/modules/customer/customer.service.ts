// import { prisma } from "@/lib/prisma"
// import { CustomerInput, CustomerUpdateInput } from "@/schemas/schema"

// export const customerService = {

//     async getCustomers() {
//         return prisma.customer.findMany()
//     },

//     async getCustomer(id: string) {
//         return prisma.customer.findUnique({
//             where: { customer_id: id }
//         })
//     },

//     async createCustomer(data: CustomerInput) {
//         return prisma.customer.create({ data })
//     },

//     async updateCustomer(id: string, data: CustomerUpdateInput) {
//         return prisma.customer.update({
//             where: { customer_id: id },
//             data
//         })
//     },

//     async deleteCustomer(id: string) {
//         return prisma.customer.delete({
//             where: { customer_id: id }
//         })
//     }

// }


import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

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

    async createCustomer(data: Prisma.CustomerCreateInput) {

        return prisma.customer.create({
            data
        })

    },

    async updateCustomer(id: string, data: Prisma.CustomerUpdateInput) {

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