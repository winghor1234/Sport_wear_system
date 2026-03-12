import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const revenue = await reportService.getMonthlyRevenue()

        return sendSuccess(revenue)

    } catch (error) {

        return sendError("Monthly revenue report error", 500, error)

    }

}