import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const dashboard = await reportService.getDashboardSummary()

        return sendSuccess(dashboard)

    } catch (error) {

        return sendError("Dashboard report error", 500, error)

    }

}