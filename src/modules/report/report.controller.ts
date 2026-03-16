import { reportService } from "./report.service"
import { sendSuccess } from "@/utils/response"
import { handleError } from "@/utils/errorHandler"

export const reportController = {

    async productReport() {

        try {

            const data = await reportService.getProductReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async purchaseReport() {

        try {

            const data = await reportService.getPurchaseReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async importReport() {

        try {

            const data = await reportService.getImportReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async customerReport() {

        try {

            const data = await reportService.getCustomerReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async salesQuantityReport() {

        try {

            const data = await reportService.getSalesQuantityReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async revenueReport() {

        try {

            const data = await reportService.getRevenueReport()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async topProductsReport() {

        try {

            const data = await reportService.getTopSellingProducts()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },

    async lowStockReport() {

        try {

            const data = await reportService.getLowStockProducts()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },
    async monthlyRevenueReport() {

        try {

            const data = await reportService.getMonthlyRevenue()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    },
    async dashboardReport() {

        try {

            const data = await reportService.getDashboardSummary()

            return sendSuccess(data)

        } catch (error) {

            return handleError(error)

        }

    }





}