import { prisma } from "@/lib/prisma"

export const reportService = {

    async getProductReport() {

        return prisma.product.findMany({
            select: {
                product_id: true,
                product_name: true,
                stock_qty: true,
                price: true,
                category: {
                    select: {
                        category_name: true
                    }
                }
            }
        })

    },

    async getSalesReport() {

        return prisma.sale.findMany({
            include: {
                employee: true,
                customer: true,
                sale_details: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                sale_date: "desc"
            }
        })

    },

    async getPurchaseReport() {

        return prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

    },

    async getRevenueReport() {

        const sales = await prisma.sale.aggregate({
            _sum: {
                total_amount: true
            }
        })

        const purchases = await prisma.purchaseOrder.aggregate({
            _sum: {
                total_amount: true
            }
        })

        const revenue = sales._sum.total_amount || 0
        const cost = purchases._sum.total_amount || 0

        return {
            revenue,
            cost,
            profit: revenue - cost
        }

    },


    async getImportReport() {

        return prisma.import.findMany({
            include: {
                employee: true,
                purchase: true,
                import_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

    },


    async getCustomerReport() {

        return prisma.customer.findMany({
            include: {
                orders: true,
                sales: true
            }
        })

    },

    async getSalesQuantityReport() {

        return prisma.saleDetail.groupBy({
            by: ["product_id"],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: "desc"
                }
            }
        })

    },


    // -------------------------------------------------------------------------------------------------

    async getDashboardSummary() {

        const totalProducts = await prisma.product.count()
        const totalCustomers = await prisma.customer.count()
        const totalOrders = await prisma.order.count()
        const totalSales = await prisma.sale.count()

        const revenue = await prisma.sale.aggregate({
            _sum: {
                total_amount: true
            }
        })

        return {
            totalProducts,
            totalCustomers,
            totalOrders,
            totalSales,
            revenue: revenue._sum.total_amount || 0
        }

    },

    async getTopSellingProducts() {

        return prisma.saleDetail.groupBy({
            by: ["product_id"],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: "desc"
                }
            },
            take: 10
        })

    },


    async getMonthlyRevenue() {

        return prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', sale_date) AS month,
      SUM(total_amount) AS revenue
    FROM "Sale"
    GROUP BY month
    ORDER BY month ASC
  `

    }

}