import { prisma } from "@/lib/prisma"
import { NotFoundError } from "@/utils/response"

export const reportService = {
    // Product Report
    async getProductReport() {
        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        })
        return products
    },

    // Purchase Report
    async getPurchaseReport() {
        const purchases = await prisma.purchaseOrder.findMany({
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
        return purchases;

    },

    // Import Report
    async getImportReport() {
        const imports = await prisma.import.findMany({
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
        return imports

    },

    // Customer Report
    async getCustomerReport() {
        const customers = await prisma.customer.findMany()
        return customers
    },

    // Sales Quantity Report
    async getSalesQuantityReport() {
        const sales = await prisma.saleDetail.groupBy({
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
        return sales

    },

    // Top Selling Products
    async getTopSellingProducts() {
        const topSellingProducts = await prisma.saleDetail.groupBy({
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
        return topSellingProducts

    },

    // Low Stock Alert
    async getLowStockProducts() {
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock_qty: {
                    lt: 10
                }
            }
        })
        return lowStockProducts

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

        const profit = (revenue._sum.total_amount || 0) - (cost._sum.cost_price || 0)

        return {
            revenue: revenue._sum.total_amount || 0,
            cost: cost._sum.cost_price || 0,
            profit
        }

    },
    async getMonthlyRevenue() {

        const revenue = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', sale_date) AS month,
      SUM(total_amount) AS revenue
    FROM "Sale"
    GROUP BY month
    ORDER BY month ASC
  `
        return revenue
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