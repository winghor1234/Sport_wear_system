import { reportService } from "@/modules/report/report.service"
import { getDateFilter, getReportDateFilter } from "@/utils/reportFilter"
import { sendSuccess, sendError } from "@/utils/response"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    try {

        const where = getReportDateFilter(req, "sale_date")

        const sales = await reportService.getSalesReport(where)

        return sendSuccess(sales)

    } catch (error) {

        return sendError("Sales report error", 500, error)

    }

}