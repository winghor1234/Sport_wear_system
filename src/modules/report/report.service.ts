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
        if (!products) {
            throw new NotFoundError("Products not found")
        }
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

        if (!purchases) {
            throw new NotFoundError("Purchases not found");
        }
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
        if (!imports) {
            throw new NotFoundError("Imports not found")
        }
        return imports

    },

    // Customer Report
    async getCustomerReport() {
        const customers = await prisma.customer.findMany()
        if (!customers) {
            throw new NotFoundError("Customers not found")
        }
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

        if (!sales) {
            throw new NotFoundError("Sales not found")
        }
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
        if (!topSellingProducts) {
            throw new NotFoundError("Top selling products not found")
        }
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
        if (!lowStockProducts) {
            throw new NotFoundError("Low stock products not found")
        }
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
        if (!revenue) {
            throw new NotFoundError("Revenue not found")
        }
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