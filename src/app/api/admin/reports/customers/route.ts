import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const customers = await reportService.getCustomerReport()

        return sendSuccess(customers)

    } catch (error) {

        return sendError("Internal Customer Report Server Error", 500, error)

    }

}