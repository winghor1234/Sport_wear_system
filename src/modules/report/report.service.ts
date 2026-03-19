

import { prisma } from "@/lib/prisma"

export const reportService = {

    // Product Report
    async getProductReport() {

        return prisma.product.findMany({
            include: {
                category: true
            }
        })

    },

    // Purchase Report
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

    // Import Report
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

    // Customer Report
    async getCustomerReport() {

        return prisma.customer.findMany()

    },

    // Sales Quantity Report
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

    // Top Selling Products
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

    // Low Stock Alert
    async getLowStockProducts() {

        return prisma.product.findMany({
            where: {
                stock_qty: {
                    lt: 10
                }
            }
        })

    },

    // Revenue Report
    async getRevenueReport() {

        const revenue = await prisma.sale.aggregate({
            _sum: {
                total_amount: true
            }
        })

        const cost = await prisma.importDetail.aggregate({
            _sum: {
                cost_price: true
            }
        })

        const profit =
            (revenue._sum.total_amount || 0) -
            (cost._sum.cost_price || 0)

        return {
            revenue: revenue._sum.total_amount || 0,
            cost: cost._sum.cost_price || 0,
            profit
        }

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

    },
    async getDashboardSummary() {

        const revenue = await prisma.sale.aggregate({
            _sum: {
                total_amount: true
            }
        })

        const cost = await prisma.importDetail.aggregate({
            _sum: {
                cost_price: true
            }
        })

        const profit =
            (revenue._sum.total_amount || 0) -
            (cost._sum.cost_price || 0)

        return {
            revenue: revenue._sum.total_amount || 0,
            cost: cost._sum.cost_price || 0,
            profit
        }

    }



}