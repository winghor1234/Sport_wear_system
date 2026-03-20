

import { reportController } from "@/modules/report/report.controller";
export async function GET() {
    return reportController.purchaseReport()
}