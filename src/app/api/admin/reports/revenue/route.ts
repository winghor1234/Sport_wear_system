import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const report = await reportService.getRevenueReport()

        return sendSuccess(report)

    } catch (error) {

        return sendError("Revenue report error", 500, error)

    }

}