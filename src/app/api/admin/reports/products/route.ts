import { reportService } from "@/modules/report/report.service"
import { sendSuccess, sendError } from "@/utils/response"

export async function GET() {

    try {

        const products = await reportService.getProductReport()

        return sendSuccess(products)

    } catch (error) {

        return sendError("Product report error", 500, error)

    }

}