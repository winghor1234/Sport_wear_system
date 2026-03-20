import { reportService } from "@/modules/report/report.service"

export async function GET() {
    return reportService.getDashboardSummary()
}