import { reportService } from "@/modules/report/report.service"
import { exportToExcel } from "@/utils/exportExcel"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const sales = await reportService.getSalesQuantityReport()
    const buffer = exportToExcel(sales, "Sales Report")
    return new Response(buffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=sales-report.xlsx"
        }
    })

}