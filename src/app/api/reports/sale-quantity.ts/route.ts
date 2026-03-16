import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const report = await reportService.getSalesQuantityReport()

        return sendSuccess(report)

    } catch (error) {

        return sendError("Internal Sales Quantity Report Server Error", 500, error)

    }

}