import { reportService } from "@/modules/report/report.service"
import { exportToPdf } from "@/utils/exportPdf"

export async function GET() {
    const sales = await reportService.getSalesQuantityReport()
    const pdf = await exportToPdf(sales)
    return new Response(pdf as any, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=sales-report.pdf"
        }
    })

}